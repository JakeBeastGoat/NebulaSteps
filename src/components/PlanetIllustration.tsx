import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withTiming,
    withSequence,
    withDelay,
    Easing,
    interpolate
} from 'react-native-reanimated';
import { colors } from '../theme/colors';

interface PlanetIllustrationProps {
    isAllComplete: boolean;
}

export default function PlanetIllustration({ isAllComplete }: PlanetIllustrationProps) {
    // Rocket success animation
    const rocketProgress = useSharedValue(0);

    useEffect(() => {
        if (isAllComplete) {
            rocketProgress.value = withSequence(
                withTiming(0, { duration: 0 }), // reset
                withDelay(300, withTiming(1, { duration: 1500, easing: Easing.out(Easing.back(1.5)) }))
            );
        } else {
            rocketProgress.value = withTiming(0, { duration: 500 });
        }
    }, [isAllComplete]);

    const rocketStyle = useAnimatedStyle(() => {
        // Rocket flies in from top right, lands on the planet
        const translateX = interpolate(rocketProgress.value, [0, 1], [150, 20]);
        const translateY = interpolate(rocketProgress.value, [0, 1], [-150, -40]);
        const rotate = interpolate(rocketProgress.value, [0, 1], [-45, 0]) + 'deg';
        const scale = interpolate(rocketProgress.value, [0, 1], [0.5, 1]);
        const opacity = interpolate(rocketProgress.value, [0, 0.2, 1], [0, 1, 1]);

        return {
            transform: [{ translateX }, { translateY }, { rotate }, { scale }],
            opacity
        } as any;
    });

    return (
        <View style={styles.container}>
            {/* The main planet body */}
            <View style={styles.planet}>
                {/* Craters - minimal flat style */}
                <View style={[styles.crater, { top: 20, left: 20, width: 30, height: 30, borderRadius: 15 }]} />
                <View style={[styles.crater, { top: 60, left: 70, width: 20, height: 20, borderRadius: 10 }]} />
                <View style={[styles.crater, { top: 90, left: 30, width: 15, height: 15, borderRadius: 7.5 }]} />
            </View>

            {/* The planetary ring */}
            <View style={styles.ringWrapper}>
                <View style={styles.ring} />
            </View>

            {/* Success Rocket landing */}
            <Animated.View style={[styles.rocketContainer, rocketStyle]}>
                <View style={styles.rocketBody}>
                    <View style={styles.rocketWindow} />
                </View>
                <View style={styles.rocketFins} />
                <View style={styles.rocketFlame} />
            </Animated.View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: 140,
        height: 140,
        alignItems: 'center',
        justifyContent: 'center',
        // No shadow on the container itself to keep the flat look inside the card
    },
    planet: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: colors.primary, // Sun-yellow / primary
        overflow: 'hidden',
        zIndex: 2,
    },
    crater: {
        position: 'absolute',
        backgroundColor: colors.primaryHover, // Slightly darker yellow
    },
    ringWrapper: {
        position: 'absolute',
        width: 180,
        height: 180,
        justifyContent: 'center',
        alignItems: 'center',
        transform: [{ rotate: '-30deg' }], // Angled ring
        zIndex: 3,
    },
    ring: {
        width: 180,
        height: 60,
        borderRadius: 90, // Ellipse
        borderWidth: 16,
        borderColor: colors.tertiary, // Teal ring
        borderTopColor: 'transparent', // Make the back half disappear behind the planet
    },
    // Rocket styles - very simplified flat vector shapes
    rocketContainer: {
        position: 'absolute',
        width: 30,
        height: 40,
        alignItems: 'center',
        zIndex: 4, // Lands on top of planet
    },
    rocketBody: {
        width: 16,
        height: 24,
        backgroundColor: colors.text, // Soft white
        borderTopLeftRadius: 8,
        borderTopRightRadius: 8,
        borderBottomLeftRadius: 2,
        borderBottomRightRadius: 2,
        alignItems: 'center',
        justifyContent: 'flex-start',
        paddingTop: 6,
        zIndex: 2,
    },
    rocketWindow: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: colors.secondary, // Blue window
    },
    rocketFins: {
        position: 'absolute',
        bottom: 8,
        width: 28,
        height: 12,
        backgroundColor: colors.danger, // Red fins
        borderTopLeftRadius: 6,
        borderTopRightRadius: 6,
        borderBottomLeftRadius: 2,
        borderBottomRightRadius: 2,
        zIndex: 1,
    },
    rocketFlame: {
        position: 'absolute',
        bottom: -6,
        width: 10,
        height: 14,
        backgroundColor: colors.primary, // Yellow flame
        borderBottomLeftRadius: 5,
        borderBottomRightRadius: 5,
        zIndex: 0,
    }
});
