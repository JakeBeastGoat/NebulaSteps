import React from 'react';
import { View, Text, StyleSheet, FlatList, Alert, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { Trash2, ArrowLeft, Plus } from 'lucide-react-native';
import { RootStackParamList } from '../types';
import { useChallengeStore } from '../store/useChallengeStore';
import SubTaskCard from '../components/SubTaskCard';
import PlanetIllustration from '../components/PlanetIllustration';
import PrimaryButton from '../components/PrimaryButton';
import AnimatedBackground from '../components/AnimatedBackground';
import DeleteModal from '../components/DeleteModal';
import { colors } from '../theme/colors';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'ChallengeDetail'>;
type ChallengeDetailRouteProp = RouteProp<RootStackParamList, 'ChallengeDetail'>;

export default function ChallengeDetailScreen() {
    const navigation = useNavigation<NavigationProp>();
    const route = useRoute<ChallengeDetailRouteProp>();
    const { challengeId } = route.params;

    const challenge = useChallengeStore((state) =>
        state.challenges.find(c => c.id === challengeId)
    );

    const [isDeleteModalVisible, setIsDeleteModalVisible] = React.useState(false);

    const toggleStep = useChallengeStore(state => state.toggleStepCompletion);
    const deleteChallenge = useChallengeStore(state => state.deleteChallenge);
    const addStep = useChallengeStore(state => state.addStep);

    if (!challenge) {
        return (
            <AnimatedBackground>
                <View style={styles.container}>
                    <Text style={styles.notFound}>Challenge not found.</Text>
                </View>
            </AnimatedBackground>
        );
    }

    const handleDelete = () => {
        setIsDeleteModalVisible(true);
    };

    const confirmDelete = () => {
        setIsDeleteModalVisible(false);
        deleteChallenge(challengeId);
        navigation.goBack();
    };

    const handleAddStep = () => {
        Alert.prompt(
            "Add Step",
            "Enter the text for your next small step:",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Add",
                    onPress: (text) => {
                        if (text && text.trim()) {
                            addStep(challengeId, text.trim());
                        }
                    }
                }
            ],
            'plain-text'
        );
    };

    const totalSteps = challenge.steps.length;
    const completedSteps = challenge.steps.filter(s => s.completed).length;
    const isAllComplete = totalSteps > 0 && completedSteps === totalSteps;

    return (
        <AnimatedBackground>
            <View style={styles.container}>
                {/* Top Navigation */}
                <View style={styles.topNav}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.navIcon}>
                        <ArrowLeft size={24} color={colors.text} />
                    </TouchableOpacity>
                    <View style={styles.rightNavIcons}>
                        <TouchableOpacity style={styles.navIcon} onPress={handleAddStep}>
                            <Plus size={24} color={colors.text} />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.navIcon} onPress={handleDelete}>
                            <Trash2 size={24} color={colors.danger} />
                        </TouchableOpacity>
                    </View>
                </View>

                <ScrollView
                    style={styles.scrollContainer}
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                >
                    {/* Central Mission Card (Planet) */}
                    <View style={styles.missionCard}>
                        <PlanetIllustration isAllComplete={isAllComplete} />
                        <Text style={styles.missionHeader}>MISSION LIMITS</Text>
                        <Text style={styles.missionTitle} numberOfLines={2}>{challenge.obstacle}</Text>
                    </View>

                    {/* Breakdown Section */}
                    <View style={styles.breakdownSection}>
                        <Text style={styles.sectionTitle}>Breakdown</Text>
                        <Text style={styles.sectionSubtitle}>Take it step by step</Text>

                        <View style={styles.taskList}>
                            {challenge.steps.map((item, index) => (
                                <SubTaskCard
                                    key={item.id}
                                    step={item}
                                    index={index}
                                    onToggle={() => toggleStep(challengeId, item.id)}
                                />
                            ))}
                        </View>
                    </View>

                    <View style={styles.footer}>
                        <TouchableOpacity style={styles.launchButton} onPress={() => { }}>
                            <Text style={styles.launchButtonText}>Next Small Step</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>

                <DeleteModal
                    isVisible={isDeleteModalVisible}
                    onCancel={() => setIsDeleteModalVisible(false)}
                    onConfirm={confirmDelete}
                />
            </View>
        </AnimatedBackground>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'transparent',
    },
    topNav: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingTop: 60, // Safe area + padding
        paddingBottom: 20,
    },
    navIcon: {
        padding: 8,
    },
    rightNavIcons: {
        flexDirection: 'row',
        gap: 16,
    },
    scrollContainer: {
        flex: 1,
    },
    scrollContent: {
        paddingBottom: 40,
    },
    missionCard: {
        backgroundColor: colors.surface,
        marginHorizontal: 20,
        borderRadius: 32,
        padding: 32,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.3,
        shadowRadius: 20,
        elevation: 8,
        marginBottom: 32,
    },
    missionHeader: {
        color: colors.textMuted,
        fontSize: 12,
        fontWeight: '700',
        letterSpacing: 2,
        marginTop: 24,
        marginBottom: 8,
    },
    missionTitle: {
        color: colors.text,
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        lineHeight: 32,
    },
    breakdownSection: {
        marginBottom: 32,
    },
    sectionTitle: {
        color: colors.text,
        fontSize: 22,
        fontWeight: 'bold',
        paddingHorizontal: 20,
        marginBottom: 4,
    },
    sectionSubtitle: {
        color: colors.textMuted,
        fontSize: 14,
        paddingHorizontal: 20,
        marginBottom: 16,
    },
    taskList: {
        paddingHorizontal: 20,
        gap: 16,
    },
    footer: {
        paddingHorizontal: 20,
        paddingBottom: 40,
        marginTop: 24,
    },
    launchButton: {
        backgroundColor: colors.text, // Soft white background
        borderRadius: 100, // Fully rounded
        paddingVertical: 18,
        alignItems: 'center',
        shadowColor: colors.text,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 10,
        elevation: 4,
    },
    launchButtonText: {
        color: colors.background, // Dark text
        fontSize: 18,
        fontWeight: 'bold',
    },
    notFound: {
        color: colors.text,
        fontSize: 18,
        textAlign: 'center',
        marginTop: 100,
    }
});
