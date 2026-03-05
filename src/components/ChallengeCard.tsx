import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { CheckCircle2 } from 'lucide-react-native';
import PlanetIcon from './PlanetIcon';
import { Challenge } from '../types';
import { colors } from '../theme/colors';

interface ChallengeCardProps {
    challenge: Challenge;
    onPress: () => void;
    index: number;
}

export default function ChallengeCard({ challenge, onPress, index }: ChallengeCardProps) {
    const totalSteps = challenge.steps.length;
    const completedSteps = challenge.steps.filter(s => s.completed).length;
    const progress = totalSteps > 0 ? completedSteps / totalSteps : 0;

    const isCompleted = progress === 1 && totalSteps > 0;

    return (
        <Animated.View entering={FadeInUp.delay(index * 100).springify()}>
            <Pressable
                style={({ pressed }) => [
                    styles.card,
                    pressed && styles.cardPressed
                ]}
                onPress={onPress}
            >
                <View style={styles.topSection}>
                    <View style={styles.iconContainer}>
                        {isCompleted ? (
                            <CheckCircle2 size={32} color={colors.success} />
                        ) : (
                            <PlanetIcon size={40} />
                        )}
                    </View>
                    <View style={styles.headerRight}>
                        <Text style={styles.missionLabel}>MISSION</Text>
                        <Text style={styles.dateText}>
                            {new Date(challenge.createdAt).toLocaleDateString()}
                        </Text>
                    </View>
                </View>

                <Text style={styles.title} numberOfLines={2}>
                    {challenge.obstacle}
                </Text>

                <View style={styles.progressContainer}>
                    <View style={styles.progressTextRow}>
                        <Text style={styles.progressLabel}>Completion Path</Text>
                        <Text style={styles.progressValue}>
                            {Math.round(progress * 100)}%
                        </Text>
                    </View>

                    <View style={styles.progressBarBg}>
                        <View style={[
                            styles.progressBarFill,
                            {
                                width: `${progress * 100}%`,
                                backgroundColor: isCompleted ? colors.success : colors.secondary
                            }
                        ]} />
                    </View>
                </View>
            </Pressable>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: colors.surface,
        borderRadius: 32, // Rounder like the mockup
        padding: 24,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.3,
        shadowRadius: 20,
        elevation: 8,
    },
    cardPressed: {
        backgroundColor: colors.surfaceLight,
        transform: [{ scale: 0.98 }],
    },
    topSection: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 20,
    },
    iconContainer: {
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: colors.surfaceLight,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: colors.border,
    },
    headerRight: {
        alignItems: 'flex-end',
    },
    missionLabel: {
        color: colors.primary, // Sun yellow
        fontSize: 10,
        fontWeight: '900',
        letterSpacing: 2,
        marginBottom: 4,
    },
    dateText: {
        color: colors.textMuted,
        fontSize: 12,
        fontWeight: '500',
    },
    title: {
        color: colors.text,
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 24,
        lineHeight: 30,
    },
    progressContainer: {
        marginTop: 'auto',
    },
    progressTextRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    progressLabel: {
        color: colors.textMuted,
        fontSize: 14,
        fontWeight: '500',
    },
    progressValue: {
        color: colors.text,
        fontSize: 14,
        fontWeight: 'bold',
    },
    progressBarBg: {
        height: 10, // Thicker
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderRadius: 5,
        overflow: 'hidden',
    },
    progressBarFill: {
        height: '100%',
        borderRadius: 5,
    }
});
