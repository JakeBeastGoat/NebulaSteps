import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Home, BarChart2 } from 'lucide-react-native';
import { RootStackParamList, RootTabParamList } from '../types';

import HomeScreen from '../screens/HomeScreen';
import AddChallengeScreen from '../screens/AddChallengeScreen';
import GeneratingStepsScreen from '../screens/GeneratingStepsScreen';
import SelectStepsScreen from '../screens/SelectStepsScreen';
import ChallengeDetailScreen from '../screens/ChallengeDetailScreen';
import ProgressScreen from '../screens/ProgressScreen';
import { colors } from '../theme/colors';

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<RootTabParamList>();

function TabNavigator() {
    return (
        <Tab.Navigator
            id={undefined as any}
            screenOptions={{
                headerStyle: { backgroundColor: colors.surface, elevation: 0, shadowOpacity: 0 },
                headerTintColor: colors.text,
                headerTitleStyle: { fontWeight: '600' },
                tabBarStyle: {
                    position: 'absolute',
                    backgroundColor: 'transparent',
                    borderTopWidth: 0,
                    elevation: 0,
                    height: 80,
                    paddingBottom: 20,
                    paddingHorizontal: 20,
                },
                tabBarItemStyle: {
                    backgroundColor: 'rgba(255, 255, 255, 0.06)',
                    borderRadius: 24,
                    marginHorizontal: 8,
                    paddingVertical: 8,
                    borderWidth: 1,
                    borderColor: 'rgba(255, 255, 255, 0.05)',
                },
                tabBarActiveTintColor: colors.primary,
                tabBarInactiveTintColor: colors.textMuted,
            }}
        >
            <Tab.Screen
                name="HomeTab"
                component={HomeScreen}
                options={{
                    title: 'My Challenges',
                    tabBarIcon: ({ color }) => <Home color={color} size={24} />
                }}
            />
            <Tab.Screen
                name="ProgressTab"
                component={ProgressScreen}
                options={{
                    title: 'Progress',
                    tabBarIcon: ({ color }) => <BarChart2 color={color} size={24} />
                }}
            />
        </Tab.Navigator>
    );
}

export default function AppNavigator() {
    return (
        <Stack.Navigator
            id={undefined as any}
            initialRouteName="Tabs"
            screenOptions={{
                headerStyle: { backgroundColor: colors.surface },
                headerTintColor: colors.text,
                headerTitleStyle: { fontWeight: 'bold' },
                contentStyle: { backgroundColor: colors.background },
            }}
        >
            <Stack.Screen name="Tabs" component={TabNavigator} options={{ headerShown: false }} />
            <Stack.Screen name="AddChallenge" component={AddChallengeScreen} options={{ title: 'New Challenge' }} />
            <Stack.Screen name="GeneratingSteps" component={GeneratingStepsScreen} options={{ headerShown: false }} />
            <Stack.Screen name="SelectSteps" component={SelectStepsScreen} options={{ title: 'Select Steps', headerBackVisible: false }} />
            <Stack.Screen name="ChallengeDetail" component={ChallengeDetailScreen} options={{ title: 'Challenge' }} />
        </Stack.Navigator>
    );
}
