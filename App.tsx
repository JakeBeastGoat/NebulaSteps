import { NavigationContainer } from '@react-navigation/native';
import { NavigationContainerRef } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AppNavigator from './src/navigation/AppNavigator';
import { useChallengeStore } from './src/store/useChallengeStore';

export default function App() {
    // Initialize store (if persistence was needed, we'd load here)
    return (
        <SafeAreaProvider>
            <NavigationContainer>
                <StatusBar style="light" />
                <AppNavigator />
            </NavigationContainer>
        </SafeAreaProvider>
    );
}
