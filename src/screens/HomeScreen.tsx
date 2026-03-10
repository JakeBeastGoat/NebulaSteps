import React, { useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, SafeAreaView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';
import { useChallengeStore } from '../store/useChallengeStore';
import ChallengeCard from '../components/ChallengeCard';
import PrimaryButton from '../components/PrimaryButton';
import AnimatedBackground from '../components/AnimatedBackground';
import { colors } from '../theme/colors';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function HomeScreen() {
    const navigation = useNavigation<NavigationProp>();
    const challenges = useChallengeStore((state) => state.challenges);
    const fetchChallenges = useChallengeStore((state) => state.fetchChallenges);

    useEffect(() => {
        fetchChallenges();
    }, []);

    return (
        <AnimatedBackground>
            <SafeAreaView style={styles.safeArea}>
                <View style={styles.container}>
                    <FlatList
                        data={challenges}
                        keyExtractor={(item) => item.id}
                        contentContainerStyle={styles.listContent}
                        showsVerticalScrollIndicator={false}
                        ListEmptyComponent={
                            <View style={styles.emptyContainer}>
                                <Text style={styles.emptyTitle}>No Challenges Yet</Text>
                                <Text style={styles.emptySubtitle}>
                                    Every great journey begins with a single step. What's stopping you today?
                                </Text>
                            </View>
                        }
                        renderItem={({ item, index }) => (
                            <ChallengeCard
                                challenge={item}
                                index={index}
                                onPress={() => navigation.navigate('ChallengeDetail', { challengeId: item.id })}
                            />
                        )}
                    />

                    <View style={styles.footer}>
                        <PrimaryButton
                            title="Overcome a Challenge"
                            onPress={() => navigation.navigate('AddChallenge')}
                        />
                    </View>
                </View>
            </SafeAreaView>
        </AnimatedBackground>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        // Make sure it doesn't block the animated background
        backgroundColor: 'transparent',
    },
    container: {
        flex: 1,
        paddingHorizontal: 20,
    },
    listContent: {
        flexGrow: 1,
        paddingVertical: 24,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 100,
    },
    emptyTitle: {
        color: colors.text,
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 12,
    },
    emptySubtitle: {
        color: colors.textMuted,
        fontSize: 16,
        textAlign: 'center',
        lineHeight: 24,
        paddingHorizontal: 20,
    },
    footer: {
        paddingVertical: 20,
        paddingBottom: 100, // Account for absolute tab bar (80px) + extra space
        backgroundColor: 'transparent',
    }
});
