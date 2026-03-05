import React from 'react';
import { StyleSheet, Text, Pressable, PressableProps } from 'react-native';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withSpring
} from 'react-native-reanimated';
import { colors } from '../theme/colors';

interface PrimaryButtonProps extends PressableProps {
    title: string;
    outline?: boolean;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export default function PrimaryButton({ title, outline = false, style, ...props }: PrimaryButtonProps) {
    const scale = useSharedValue(1);

    const animatedStyle = useAnimatedStyle(() => {
        return {
            transform: [{ scale: scale.value }],
        };
    });

    return (
        <AnimatedPressable
            {...props}
            onPressIn={(e) => {
                scale.value = withSpring(0.95);
                if (props.onPressIn) props.onPressIn(e);
            }}
            onPressOut={(e) => {
                scale.value = withSpring(1);
                if (props.onPressOut) props.onPressOut(e);
            }}
            style={[
                styles.button,
                outline ? styles.buttonOutline : styles.buttonSolid,
                animatedStyle,
                style as any
            ]}
        >
            <Text style={[styles.text, outline ? styles.textOutline : styles.textSolid]}>
                {title}
            </Text>
        </AnimatedPressable>
    );
}

const styles = StyleSheet.create({
    button: {
        paddingVertical: 18,
        paddingHorizontal: 28,
        borderRadius: 100,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000000', // Subtle dark shadow instead of neon glow
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 8,
        elevation: 4,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.05)', // Glassy rim
    },
    buttonSolid: {
        backgroundColor: colors.primary,
    },
    buttonOutline: {
        backgroundColor: 'transparent',
        borderWidth: 2,
        borderColor: colors.primary,
        shadowOpacity: 0,
        elevation: 0,
    },
    text: {
        fontSize: 16,
        fontWeight: '600', // A bit softer, more elegant
        letterSpacing: 0.5,
    },
    textSolid: {
        color: '#0A0C10', // Deep dark text for contrast on muted green
    },
    textOutline: {
        color: colors.primary,
    }
});
