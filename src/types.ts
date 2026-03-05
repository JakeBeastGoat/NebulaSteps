export interface Step {
    id: string;
    text: string;
    completed: boolean;
}

export interface Challenge {
    id: string;
    obstacle: string;
    steps: Step[];
    createdAt: number;
    targetDate?: number;
}

import { NavigatorScreenParams } from '@react-navigation/native';

export type RootTabParamList = {
    HomeTab: undefined;
    ProgressTab: undefined;
};

export type RootStackParamList = {
    Tabs: NavigatorScreenParams<RootTabParamList>;
    AddChallenge: undefined;
    GeneratingSteps: { obstacle: string };
    SelectSteps: { obstacle: string; generatedSteps: string[] };
    ChallengeDetail: { challengeId: string };
};
