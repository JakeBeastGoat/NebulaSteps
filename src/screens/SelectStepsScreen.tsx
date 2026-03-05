import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, Pressable, TextInput, Platform } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { Check, Circle, Plus, Calendar } from 'lucide-react-native';
import Animated, { FadeInRight } from 'react-native-reanimated';
import DateTimePicker from '@react-native-community/datetimepicker';
import { RootStackParamList } from '../types';
import { useChallengeStore } from '../store/useChallengeStore';
import PrimaryButton from '../components/PrimaryButton';
import AnimatedBackground from '../components/AnimatedBackground';
import { colors } from '../theme/colors';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'SelectSteps'>;
type SelectStepsRouteProp = RouteProp<RootStackParamList, 'SelectSteps'>;

export default function SelectStepsScreen() {
    const navigation = useNavigation<NavigationProp>();
    const route = useRoute<SelectStepsRouteProp>();
    const addChallenge = useChallengeStore((state) => state.addChallenge);

    const { obstacle, generatedSteps } = route.params;

    const [allSteps, setAllSteps] = useState<string[]>(generatedSteps);
    const [selectedIndices, setSelectedIndices] = useState<Set<number>>(
        new Set(Object.keys(generatedSteps).map(Number))
    );
    const [customStep, setCustomStep] = useState('');

    const [targetDate, setTargetDate] = useState<Date | undefined>(undefined);
    const [showDatePicker, setShowDatePicker] = useState(false);

    const toggleSelection = (index: number) => {
        const newSet = new Set(selectedIndices);
        if (newSet.has(index)) {
            newSet.delete(index);
        } else {
            newSet.add(index);
        }
        setSelectedIndices(newSet);
    };

    const handleAddCustomStep = () => {
        if (customStep.trim()) {
            const newIndex = allSteps.length;
            setAllSteps([...allSteps, customStep.trim()]);
            setSelectedIndices(new Set(selectedIndices).add(newIndex));
            setCustomStep('');
        }
    };

    const handleDateChange = (event: any, selectedDate?: Date) => {
        setShowDatePicker(Platform.OS === 'ios'); // Keep picker open on iOS, close on Android/Web
        if (selectedDate) {
            setTargetDate(selectedDate);
        }
    };

    const handleSave = () => {
        const selectedSteps = allSteps.filter((_, idx) => selectedIndices.has(idx));
        addChallenge(obstacle, selectedSteps, targetDate?.getTime());
        navigation.popToTop();
    };

    return (
        <AnimatedBackground>
            <View style={styles.container}>
                <FlatList
                    data={allSteps}
                    keyExtractor={(_, index) => index.toString()}
                    contentContainerStyle={styles.list}
                    showsVerticalScrollIndicator={false}
                    ListHeaderComponent={
                        <View style={styles.headerContainer}>
                            <Text style={styles.headerTitle}>Select the steps that help you most</Text>
                            <Text style={styles.subtitle}>
                                We generated a few ideas. Uncheck any steps you feel aren't relevant to your situation.
                            </Text>
                        </View>
                    }
                    renderItem={({ item, index }) => {
                        const isSelected = selectedIndices.has(index);
                        return (
                            <Animated.View entering={FadeInRight.delay(Math.min(index, 5) * 150).springify()}>
                                <Pressable
                                    style={[
                                        styles.stepCard,
                                        isSelected ? styles.stepCardSelected : null
                                    ]}
                                    onPress={() => toggleSelection(index)}
                                >
                                    <View style={styles.checkboxContainer}>
                                        {isSelected ? (
                                            <Check size={24} color={colors.primary} />
                                        ) : (
                                            <Circle size={24} color={colors.textMuted} />
                                        )}
                                    </View>
                                    <Text style={[
                                        styles.stepText,
                                        !isSelected && styles.stepTextUnselected
                                    ]}>
                                        {item}
                                    </Text>
                                </Pressable>
                            </Animated.View>
                        );
                    }}
                    ListFooterComponent={
                        <View style={styles.listFooter}>
                            <View style={styles.customStepContainer}>
                                <TextInput
                                    style={styles.customInput}
                                    placeholder="Add your own step..."
                                    placeholderTextColor={colors.textMuted + '80'}
                                    value={customStep}
                                    onChangeText={setCustomStep}
                                    onSubmitEditing={handleAddCustomStep}
                                    returnKeyType="done"
                                />
                                <Pressable
                                    style={[styles.addButton, !customStep.trim() && { opacity: 0.5 }]}
                                    onPress={handleAddCustomStep}
                                    disabled={!customStep.trim()}
                                >
                                    <Plus size={24} color={colors.text} />
                                </Pressable>
                            </View>

                            <View style={styles.datePickerContainer}>
                                <Text style={styles.dateLabel}>Target Date & Time (Optional)</Text>
                                <Pressable
                                    style={styles.dateButton}
                                    onPress={() => setShowDatePicker(true)}
                                >
                                    <Calendar size={20} color={colors.primary} style={styles.dateIcon} />
                                    <Text style={styles.dateText}>
                                        {targetDate
                                            ? `${targetDate.toLocaleDateString()} at ${targetDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
                                            : 'Tap to select date & time'}
                                    </Text>
                                </Pressable>

                                {showDatePicker && (
                                    <DateTimePicker
                                        value={targetDate || new Date()}
                                        mode="datetime"
                                        display="default"
                                        onChange={handleDateChange}
                                    />
                                )}
                            </View>
                        </View>
                    }
                />

                <View style={styles.footer}>
                    <PrimaryButton
                        title={`Save ${selectedIndices.size} Steps`}
                        onPress={handleSave}
                        disabled={selectedIndices.size === 0}
                        style={selectedIndices.size === 0 ? { opacity: 0.5 } : {}}
                    />
                </View>
            </View>
        </AnimatedBackground>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'transparent',
        paddingHorizontal: 20,
    },
    headerContainer: {
        paddingTop: 10,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: colors.text,
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        color: colors.textMuted,
        lineHeight: 24,
        marginBottom: 24,
    },
    list: {
        paddingBottom: 20,
    },
    stepCard: {
        flexDirection: 'row',
        backgroundColor: colors.surface,
        padding: 20,
        borderRadius: 16,
        marginBottom: 12,
        borderWidth: 2,
        borderColor: colors.border,
        alignItems: 'center',
    },
    stepCardSelected: {
        borderColor: colors.primary,
        backgroundColor: '#1E293B',
    },
    checkboxContainer: {
        marginRight: 16,
    },
    stepText: {
        flex: 1,
        color: colors.text,
        fontSize: 16,
        lineHeight: 24,
    },
    stepTextUnselected: {
        color: colors.textMuted,
    },
    listFooter: {
        marginTop: 12,
    },
    customStepContainer: {
        flexDirection: 'row',
        marginBottom: 32,
    },
    customInput: {
        flex: 1,
        backgroundColor: colors.surface,
        color: colors.text,
        fontSize: 16,
        borderRadius: 16,
        paddingHorizontal: 20,
        paddingVertical: 16,
        borderWidth: 1,
        borderColor: colors.border,
        marginRight: 12,
    },
    addButton: {
        backgroundColor: colors.primary,
        width: 56,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: colors.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 5,
    },
    datePickerContainer: {
        backgroundColor: colors.surface,
        borderRadius: 16,
        padding: 20,
        borderWidth: 1,
        borderColor: colors.border,
        marginBottom: 20,
    },
    dateLabel: {
        color: colors.textMuted,
        fontSize: 14,
        marginBottom: 12,
        fontWeight: '500',
    },
    dateButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.background,
        padding: 16,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: colors.border,
    },
    dateIcon: {
        marginRight: 12,
    },
    dateText: {
        color: colors.text,
        fontSize: 16,
    },
    footer: {
        paddingTop: 16,
        paddingBottom: 20,
    }
});
