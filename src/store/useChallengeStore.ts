import { create } from 'zustand';
import { Challenge, Step } from '../types';
import { supabase } from '../supabase';

// For simplicity, let's use a simple unique ID generator
const generateId = () => Math.random().toString(36).substr(2, 9);

interface ChallengeState {
    challenges: Challenge[];
    isLoading: boolean;
    addChallenge: (obstacle: string, steps: string[], targetDate?: number) => void;
    toggleStepCompletion: (challengeId: string, stepId: string) => void;
    deleteChallenge: (challengeId: string) => void;
    addStep: (challengeId: string, text: string) => void;
    saveMainTaskToSupabase: (obstacle: string, steps: string[], targetDate?: number) => Promise<void>;
    fetchChallenges: () => Promise<void>;
}

export const useChallengeStore = create<ChallengeState>((set, get) => ({
    challenges: [],
    isLoading: false,

    addChallenge: (obstacle, stepsText, targetDate) => {
        const newSteps: Step[] = stepsText.map((text) => ({
            id: generateId(),
            text,
            completed: false,
        }));

        const newChallenge: Challenge = {
            id: generateId(),
            obstacle,
            steps: newSteps,
            createdAt: Date.now(),
            targetDate,
        };

        set((state) => ({ challenges: [newChallenge, ...state.challenges] }));
    },

    toggleStepCompletion: (challengeId, stepId) => {
        set((state) => ({
            challenges: state.challenges.map((challenge) =>
                challenge.id === challengeId
                    ? {
                        ...challenge,
                        steps: challenge.steps.map((step) =>
                            step.id === stepId ? { ...step, completed: !step.completed } : step
                        )
                    }
                    : challenge
            )
        }));

        // Also update in Supabase
        const challenge = get().challenges.find(c => c.id === challengeId);
        const step = challenge?.steps.find(s => s.id === stepId);
        if (step) {
            supabase
                .from('sub_tasks')
                .update({ is_done: step.completed })
                .eq('id', stepId)
                .then(({ error }) => {
                    if (error) console.error('Failed to update sub_task:', error);
                });
        }
    },

    deleteChallenge: (challengeId) => {
        set((state) => ({
            challenges: state.challenges.filter((c) => c.id !== challengeId)
        }));

        // Also delete from Supabase (cascade will handle sub_tasks)
        supabase
            .from('main_tasks')
            .delete()
            .eq('id', challengeId)
            .then(({ error }) => {
                if (error) console.error('Failed to delete main_task:', error);
            });
    },

    addStep: (challengeId, text) => {
        const newStepId = generateId();
        set((state) => ({
            challenges: state.challenges.map((challenge) =>
                challenge.id === challengeId
                    ? {
                        ...challenge,
                        steps: [...challenge.steps, { id: newStepId, text, completed: false }]
                    }
                    : challenge
            )
        }));

        // Also insert into Supabase
        supabase
            .from('sub_tasks')
            .insert({ parent_id: challengeId, content: text, is_done: false })
            .then(({ error }) => {
                if (error) console.error('Failed to add sub_task:', error);
            });
    },

    saveMainTaskToSupabase: async (obstacle, steps, targetDate) => {
        try {
            // Insert main task
            const { data: mainTask, error: mainError } = await supabase
                .from('main_tasks')
                .insert({
                    title: obstacle,
                    created_at: new Date().toISOString(),
                })
                .select()
                .single();

            if (mainError || !mainTask) {
                console.error('Failed to save main_task:', mainError);
                // Fall back to local-only storage
                get().addChallenge(obstacle, steps, targetDate);
                return;
            }

            // Insert all sub-tasks
            const subTaskRows = steps.map((content) => ({
                parent_id: mainTask.id,
                content,
                is_done: false,
            }));

            const { data: subTasks, error: subError } = await supabase
                .from('sub_tasks')
                .insert(subTaskRows)
                .select();

            if (subError) {
                console.error('Failed to save sub_tasks:', subError);
            }

            // Build the local Challenge object from Supabase data
            const newSteps: Step[] = (subTasks || []).map((st: any) => ({
                id: st.id,
                text: st.content,
                completed: st.is_done,
            }));

            const newChallenge: Challenge = {
                id: mainTask.id,
                obstacle: mainTask.title,
                steps: newSteps,
                createdAt: new Date(mainTask.created_at).getTime(),
                targetDate,
            };

            set((state) => ({ challenges: [newChallenge, ...state.challenges] }));
        } catch (err) {
            console.error('saveMainTaskToSupabase error:', err);
            // Fall back to local-only storage
            get().addChallenge(obstacle, steps, targetDate);
        }
    },

    fetchChallenges: async () => {
        set({ isLoading: true });
        try {
            // Fetch all main tasks
            const { data: tasks, error: tasksError } = await supabase
                .from('main_tasks')
                .select('*')
                .order('created_at', { ascending: false });

            if (tasksError) {
                console.error('Failed to fetch main_tasks:', tasksError);
                set({ isLoading: false });
                return;
            }

            if (!tasks || tasks.length === 0) {
                set({ challenges: [], isLoading: false });
                return;
            }

            // Fetch all sub-tasks for these tasks
            const taskIds = tasks.map((t: any) => t.id);
            const { data: subTasks, error: subError } = await supabase
                .from('sub_tasks')
                .select('*')
                .in('parent_id', taskIds)
                .order('created_at', { ascending: true });

            if (subError) {
                console.error('Failed to fetch sub_tasks:', subError);
            }

            // Build challenges with their steps
            const challenges: Challenge[] = tasks.map((task: any) => ({
                id: task.id,
                obstacle: task.title,
                steps: (subTasks || [])
                    .filter((st: any) => st.parent_id === task.id)
                    .map((st: any) => ({
                        id: st.id,
                        text: st.content,
                        completed: st.is_done,
                    })),
                createdAt: new Date(task.created_at).getTime(),
            }));

            set({ challenges, isLoading: false });
        } catch (err) {
            console.error('fetchChallenges error:', err);
            set({ isLoading: false });
        }
    },
}));
