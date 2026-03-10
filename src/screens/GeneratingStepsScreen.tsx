import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
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
import { supabase } from '../supabase';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'GeneratingSteps'>;
type GeneratingStepsRouteProp = RouteProp<RootStackParamList, 'GeneratingSteps'>;

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

        // Call the generate-subtasks Edge Function
        let cancelled = false;

        const generateSubtasks = async () => {
            try {
                const { data, error } = await supabase.functions.invoke('generate-subtasks', {
                    body: { task_title: obstacle },
                });

                if (cancelled) return;

                if (error) {
                    console.error('Edge function error:', error);
                    Alert.alert(
                        'Generation Failed',
                        'Could not generate steps. Please try again.',
                        [{ text: 'OK', onPress: () => navigation.goBack() }]
                    );
                    return;
                }

                const subtasks: string[] = data?.subtasks;
                if (!subtasks || !Array.isArray(subtasks) || subtasks.length === 0) {
                    Alert.alert(
                        'No Steps Generated',
                        'The AI returned no steps. Please try again with a different challenge.',
                        [{ text: 'OK', onPress: () => navigation.goBack() }]
                    );
                    return;
                }

                navigation.replace('SelectSteps', {
                    obstacle,
                    generatedSteps: subtasks,
                });
            } catch (err) {
                if (cancelled) return;
                console.error('Unexpected error:', err);
                Alert.alert(
                    'Error',
                    'Something went wrong. Please try again.',
                    [{ text: 'OK', onPress: () => navigation.goBack() }]
                );
            }
        };

        generateSubtasks();

        return () => { cancelled = true; };
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
