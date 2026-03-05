import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';
import PrimaryButton from '../components/PrimaryButton';
import AnimatedBackground from '../components/AnimatedBackground';
import { colors } from '../theme/colors';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'AddChallenge'>;

export default function AddChallengeScreen() {
    const [obstacle, setObstacle] = useState('');
    const navigation = useNavigation<NavigationProp>();

    const handleNext = () => {
        if (obstacle.trim()) {
            navigation.navigate('GeneratingSteps', { obstacle });
        }
    };

    return (
        <AnimatedBackground>
            <KeyboardAvoidingView
                style={styles.container}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                keyboardVerticalOffset={100}
            >
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <View style={styles.inner}>
                        <Text style={styles.title}>What is your challenge?</Text>
                        <Text style={styles.subtitle}>
                            Describe the obstacle you are currently facing. We'll use AI to break it down into manageable steps.
                        </Text>

                        <TextInput
                            style={styles.input}
                            placeholder="e.g. I want to learn React Native but feel overwhelmed..."
                            placeholderTextColor={colors.textMuted + '80'}
                            multiline
                            numberOfLines={5}
                            value={obstacle}
                            onChangeText={setObstacle}
                            autoFocus
                        />

                        <View style={styles.footer}>
                            <PrimaryButton
                                title="Help Me Overcome This"
                                onPress={handleNext}
                                style={[
                                    styles.button,
                                    !obstacle.trim() && { opacity: 0.5 }
                                ]}
                                disabled={!obstacle.trim()}
                            />
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            </KeyboardAvoidingView>
        </AnimatedBackground>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'transparent',
    },
    inner: {
        flex: 1,
        padding: 24,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: colors.text,
        marginBottom: 12,
    },
    subtitle: {
        fontSize: 16,
        color: colors.textMuted,
        lineHeight: 24,
        marginBottom: 32,
    },
    input: {
        backgroundColor: colors.surface,
        color: colors.text,
        fontSize: 18,
        borderRadius: 16,
        padding: 20,
        minHeight: 160,
        textAlignVertical: 'top',
        borderWidth: 1,
        borderColor: colors.border,
    },
    footer: {
        marginTop: 'auto',
        paddingBottom: 20,
    },
    button: {
        width: '100%',
    }
});
