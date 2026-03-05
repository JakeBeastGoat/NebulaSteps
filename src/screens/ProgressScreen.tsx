import React from 'react';
import { View, Text, StyleSheet, FlatList, SafeAreaView } from 'react-native';
import { useChallengeStore } from '../store/useChallengeStore';
import { colors } from '../theme/colors';
import { CheckCircle2, Target, Trophy } from 'lucide-react-native';
import AnimatedBackground from '../components/AnimatedBackground';

export default function ProgressScreen() {
    const challenges = useChallengeStore(state => state.challenges);

    const activeChallenges = challenges.filter(c => {
        const total = c.steps.length;
        const completed = c.steps.filter(s => s.completed).length;
        return total === 0 || completed < total;
    });

    const completedChallenges = challenges.filter(c => {
        const total = c.steps.length;
        const completed = c.steps.filter(s => s.completed).length;
        return total > 0 && completed === total;
    });

    const totalSteps = challenges.reduce((acc, c) => acc + c.steps.length, 0);
    const totalCompletedSteps = challenges.reduce((acc, c) => acc + c.steps.filter(s => s.completed).length, 0);

    return (
        <AnimatedBackground>
            <SafeAreaView style={styles.safeArea}>
                <View style={styles.container}>
                    <View style={styles.statsCard}>
                        <View style={styles.statBox}>
                            <Target size={28} color={colors.secondary} style={styles.statIcon} />
                            <Text style={styles.statValue}>{activeChallenges.length}</Text>
                            <Text style={styles.statLabel}>Active</Text>
                            <Text style={styles.statLabel}>Challenges</Text>
                        </View>
                        <View style={styles.divider} />
                        <View style={styles.statBox}>
                            <CheckCircle2 size={28} color={colors.success} style={styles.statIcon} />
                            <Text style={styles.statValue}>{totalCompletedSteps} / {totalSteps}</Text>
                            <Text style={styles.statLabel}>Steps</Text>
                            <Text style={styles.statLabel}>Completed</Text>
                        </View>
                    </View>

                    <Text style={styles.sectionTitle}>
                        <Trophy size={20} color={colors.primary} style={{ marginRight: 8 }} /> Past Completed Challenges
                    </Text>

                    <FlatList
                        data={completedChallenges}
                        keyExtractor={item => item.id}
                        contentContainerStyle={styles.listContent}
                        showsVerticalScrollIndicator={false}
                        ListEmptyComponent={
                            <View style={styles.emptyContainer}>
                                <Text style={styles.emptySubtitle}>No completed challenges yet. Keep pushing forward!</Text>
                            </View>
                        }
                        renderItem={({ item }) => (
                            <View style={styles.completedCard}>
                                <CheckCircle2 size={20} color={colors.success} style={styles.completedIcon} />
                                <Text style={styles.completedText}>{item.obstacle}</Text>
                            </View>
                        )}
                    />
                </View>
            </SafeAreaView>
        </AnimatedBackground>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: 'transparent',
    },
    container: {
        flex: 1,
        paddingHorizontal: 20,
        paddingTop: 20,
    },
    statsCard: {
        flexDirection: 'row',
        backgroundColor: colors.surface,
        borderRadius: 20,
        padding: 24,
        marginBottom: 32,
        borderWidth: 1,
        borderColor: colors.border,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 4,
    },
    statBox: {
        flex: 1,
        alignItems: 'center',
    },
    divider: {
        width: 1,
        backgroundColor: colors.border,
        marginHorizontal: 16,
    },
    statIcon: {
        marginBottom: 12,
    },
    statValue: {
        color: colors.text,
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    statLabel: {
        color: colors.textMuted,
        fontSize: 14,
        fontWeight: '500',
    },
    sectionTitle: {
        color: colors.text,
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 16,
        flexDirection: 'row',
        alignItems: 'center',
    },
    listContent: {
        paddingBottom: 100, // Account for absolute tab bar (80px) + extra space
    },
    completedCard: {
        flexDirection: 'row',
        backgroundColor: colors.surface,
        padding: 16,
        borderRadius: 16,
        marginBottom: 12,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: colors.border,
    },
    completedIcon: {
        marginRight: 12,
    },
    completedText: {
        color: colors.text,
        fontSize: 16,
        flex: 1,
        lineHeight: 24,
    },
    emptyContainer: {
        padding: 24,
        alignItems: 'center',
        backgroundColor: colors.surface,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: colors.border,
        borderStyle: 'dashed',
    },
    emptySubtitle: {
        color: colors.textMuted,
        fontSize: 14,
        textAlign: 'center',
        lineHeight: 20,
    }
});
