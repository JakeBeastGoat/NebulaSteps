import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withRepeat,
    withTiming,
    withSequence,
    withDelay
} from 'react-native-reanimated';
import { BrainCircuit } from 'lucide-react-native';
import { RootStackParamList } from '../types';
import AnimatedBackground from '../components/AnimatedBackground';
import { colors } from '../theme/colors';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'GeneratingSteps'>;
type GeneratingStepsRouteProp = RouteProp<RootStackParamList, 'GeneratingSteps'>;

const MOCK_STEPS = [
    "Take 5 minutes to gather your thoughts and breathe.",
    "Write down the top 3 small things that are blocking you right now.",
    "Pick the easiest task out of the 3 and complete it within 10 minutes.",
    "Review your progress and reward yourself for taking the first step.",
    "Communicate with someone you trust about your current feelings.",
];

export default function GeneratingStepsScreen() {
    const navigation = useNavigation<NavigationProp>();
    const route = useRoute<GeneratingStepsRouteProp>();
    const { obstacle } = route.params;

    const pulse = useSharedValue(1);
    const opacity = useSharedValue(0.5);

    useEffect(() => {
        pulse.value = withRepeat(
            withSequence(
                withTiming(1.2, { duration: 1000 }),
                withTiming(1, { duration: 1000 })
            ),
            -1,
            true
        );

        opacity.value = withRepeat(
            withSequence(
                withTiming(1, { duration: 1000 }),
                withTiming(0.5, { duration: 1000 })
            ),
            -1,
            true
        );

        // Mock API call delay (3 seconds)
        const timeout = setTimeout(() => {
            navigation.replace('SelectSteps', {
                obstacle,
                generatedSteps: MOCK_STEPS
            });
        }, 3000);

        return () => clearTimeout(timeout);
    }, []);

    const animatedIconStyle = useAnimatedStyle(() => ({
        transform: [{ scale: pulse.value }],
        opacity: opacity.value,
    }));

    return (
        <AnimatedBackground>
            <View style={styles.container}>
                <Animated.View style={[styles.iconContainer, animatedIconStyle]}>
                    <BrainCircuit size={80} color={colors.primary} />
                </Animated.View>

                <Text style={styles.title}>Analyzing Challenge...</Text>
                <Text style={styles.subtitle}>
                    Our AI is breaking down your obstacle into actionable steps.
                </Text>
            </View>
        </AnimatedBackground>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'transparent',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
    },
    iconContainer: {
        marginBottom: 40,
        padding: 30,
        backgroundColor: colors.surface,
        borderRadius: 100,
        borderWidth: 2,
        borderColor: colors.primaryHover,
        shadowColor: colors.primary,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.8,
        shadowRadius: 20,
        elevation: 10,
    },
    title: {
        color: colors.text,
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    subtitle: {
        color: colors.textMuted,
        fontSize: 16,
        textAlign: 'center',
        lineHeight: 24,
    }
});
