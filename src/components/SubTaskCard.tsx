import React, { useEffect } from 'react';
import { StyleSheet, Text, Pressable, View } from 'react-native';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withSpring,
    withTiming,
    interpolateColor,
    withSequence
} from 'react-native-reanimated';
import { Check, Circle, Moon, Star, Sun, Rocket, Cloud, Sparkles } from 'lucide-react-native';
import { Step } from '../types';
import { colors } from '../theme/colors';

interface SubTaskCardProps {
    step: Step;
    onToggle: () => void;
    index: number;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

// Array of celestial icons to cycle through
const celestialIcons = [Moon, Star, Rocket, Cloud, Sparkles, Sun];

export default function SubTaskCard({ step, onToggle, index }: SubTaskCardProps) {
    const scale = useSharedValue(1);
    const progress = useSharedValue(step.completed ? 1 : 0);

    // Pick an icon based on index
    const IconComponent = celestialIcons[index % celestialIcons.length];

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
            [colors.surfaceLight, 'rgba(6, 214, 160, 0.15)'] // Success teal bg
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
        };
    });

    return (
        <AnimatedPressable
            style={[styles.container, animatedStyle]}
            onPress={() => {
                scale.value = withSequence(
                    withSpring(0.92),
                    withSpring(1)
                );
                onToggle();
            }}
        >
            <View style={styles.topRow}>
                <View style={styles.iconContainer}>
                    <IconComponent size={24} color={step.completed ? colors.success : colors.secondary} />
                </View>
                <View style={styles.statusIcon}>
                    {step.completed ? (
                        <Check size={20} color={colors.success} strokeWidth={3} />
                    ) : (
                        <View style={styles.emptyCircle} />
                    )}
                </View>
            </View>

            <Animated.Text style={[styles.text, animatedTextStyle]} numberOfLines={3}>
                {step.text}
            </Animated.Text>
        </AnimatedPressable>
    );
}

const styles = StyleSheet.create({
    container: {
        width: '100%', // Full width in vertical list
        padding: 20,
        borderRadius: 24,
        borderWidth: 2,
        justifyContent: 'space-between',
        minHeight: 120,
    },
    topRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
    iconContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: colors.surface,
        alignItems: 'center',
        justifyContent: 'center',
    },
    statusIcon: {
        width: 24,
        height: 24,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyCircle: {
        width: 20,
        height: 20,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: colors.border,
    },
    text: {
        color: colors.text,
        fontSize: 15,
        fontWeight: '500',
        lineHeight: 22,
    }
});
