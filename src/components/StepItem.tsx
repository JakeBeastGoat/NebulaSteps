import React, { useEffect } from 'react';
import { StyleSheet, Text, Pressable, View } from 'react-native';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withSpring,
    withTiming,
    interpolateColor,
} from 'react-native-reanimated';
import { Check, Circle } from 'lucide-react-native';
import { Step } from '../types';
import { colors } from '../theme/colors';

interface StepItemProps {
    step: Step;
    onToggle: () => void;
    index: number;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export default function StepItem({ step, onToggle, index }: StepItemProps) {
    const scale = useSharedValue(1);
    const progress = useSharedValue(step.completed ? 1 : 0);

    useEffect(() => {
        progress.value = withTiming(step.completed ? 1 : 0, { duration: 300 });
    }, [step.completed]);

    const animatedStyle = useAnimatedStyle(() => {
        const borderColor = interpolateColor(
            progress.value,
            [0, 1],
            [colors.border, colors.success]
        );

        const backgroundColor = interpolateColor(
            progress.value,
            [0, 1],
            [colors.surface, 'rgba(50, 215, 75, 0.15)'] // Stronger neon faint success background
        );

        return {
            transform: [{ scale: scale.value }],
            borderColor,
            backgroundColor,
        };
    });

    const animatedTextStyle = useAnimatedStyle(() => {
        return {
            opacity: interpolateColor(progress.value, [0, 1], [1, 0.6]),
            textDecorationLine: step.completed ? 'line-through' : 'none',
        };
    });

    return (
        <AnimatedPressable
            style={[styles.container, animatedStyle]}
            onPress={() => {
                // Quick satisfying pop animation
                scale.value = withSequence(
                    withSpring(0.95),
                    withSpring(1)
                );
                onToggle();
            }}
        >
            <View style={styles.iconContainer}>
                {step.completed ? (
                    <Check size={24} color={colors.success} />
                ) : (
                    <Circle size={24} color={colors.textMuted} />
                )}
            </View>
            <Animated.Text style={[styles.text, animatedTextStyle]}>
                {step.text}
            </Animated.Text>
        </AnimatedPressable>
    );
}

// Helper to make the 'pop' sequence work easily
import { withSequence } from 'react-native-reanimated';

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        padding: 22, // slightly more padding
        borderRadius: 24, // larger radius
        borderWidth: 2,
        marginBottom: 16, // more spacing
        alignItems: 'center',
    },
    iconContainer: {
        marginRight: 16,
    },
    text: {
        flex: 1,
        color: colors.text,
        fontSize: 16,
        lineHeight: 24,
    }
});
