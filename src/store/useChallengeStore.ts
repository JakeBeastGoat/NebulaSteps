import { create } from 'zustand';
import { Challenge, Step } from '../types';

// For simplicity, let's use a simple unique ID generator
const generateId = () => Math.random().toString(36).substr(2, 9);

interface ChallengeState {
    challenges: Challenge[];
    addChallenge: (obstacle: string, steps: string[], targetDate?: number) => void;
    toggleStepCompletion: (challengeId: string, stepId: string) => void;
    deleteChallenge: (challengeId: string) => void;
    addStep: (challengeId: string, text: string) => void;
}

export const useChallengeStore = create<ChallengeState>((set) => ({
    challenges: [],
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
    },
    deleteChallenge: (challengeId) => {
        set((state) => ({
            challenges: state.challenges.filter((c) => c.id !== challengeId)
        }));
    },
    addStep: (challengeId, text) => {
        set((state) => ({
            challenges: state.challenges.map((challenge) =>
                challenge.id === challengeId
                    ? {
                        ...challenge,
                        steps: [...challenge.steps, { id: generateId(), text, completed: false }]
                    }
                    : challenge
            )
        }));
    }
}));
