import React, { useEffect, useMemo } from 'react';
import { StyleSheet, View, Dimensions } from 'react-native';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withRepeat,
    withTiming,
    withDelay,
    Easing,
    interpolate,
    withSequence
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '../theme/colors';

const { width, height } = Dimensions.get('window');

interface AnimatedBackgroundProps {
    children: React.ReactNode;
}

// Generate static stars
const NUM_STARS = 40;
const staticStars = Array.from({ length: NUM_STARS }).map((_, i) => ({
    id: i,
    x: Math.random() * width,
    y: Math.random() * height,
    size: Math.random() * 2 + 1,
    opacity: Math.random() * 0.5 + 0.1,
}));

export default function AnimatedBackground({ children }: AnimatedBackgroundProps) {
    // Twinkling stars
    const twinkle1 = useSharedValue(0.2);
    const twinkle2 = useSharedValue(0.2);

    // Shooting star
    const shootingStarProgress = useSharedValue(0);

    useEffect(() => {
        // Twinkle animations
        twinkle1.value = withRepeat(
            withTiming(0.8, { duration: 2000, easing: Easing.inOut(Easing.ease) }),
            -1,
            true
        );
        twinkle2.value = withRepeat(
            withDelay(1000, withTiming(0.9, { duration: 3000, easing: Easing.inOut(Easing.ease) })),
            -1,
            true
        );

        // Shooting star animation (every 8 seconds roughly)
        shootingStarProgress.value = withRepeat(
            withSequence(
                withTiming(1, { duration: 800, easing: Easing.out(Easing.quad) }),
                withTiming(1, { duration: 7000 }) // pause before next
            ),
            -1,
            false // don't reverse
        );
    }, []);

    const twinklingStyle1 = useAnimatedStyle(() => ({ opacity: twinkle1.value }));
    const twinklingStyle2 = useAnimatedStyle(() => ({ opacity: twinkle2.value }));

    const shootingStarStyle = useAnimatedStyle(() => {
        // Star starts top-right, shoots down-left
        const translateX = interpolate(shootingStarProgress.value, [0, 1], [width + 50, -100]);
        const translateY = interpolate(shootingStarProgress.value, [0, 1], [-50, height * 0.5]);

        // Hide during the pause phase
        const opacity = shootingStarProgress.value > 0.11 ? 0 : 1 - (shootingStarProgress.value * 9);

        return {
            transform: [{ translateX }, { translateY }, { rotate: '-45deg' }],
            opacity
        } as any;
    });

    return (
        <View style={styles.container}>
            {/* Base Gradient */}
            <LinearGradient
                colors={[colors.background, colors.surfaceLight, colors.background]}
                style={StyleSheet.absoluteFillObject}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
            />

            {/* Static Stars */}
            <View style={StyleSheet.absoluteFillObject} pointerEvents="none">
                {staticStars.map(star => (
                    <View
                        key={star.id}
                        style={[
                            styles.star,
                            {
                                left: star.x,
                                top: star.y,
                                width: star.size,
                                height: star.size,
                                borderRadius: star.size / 2,
                                opacity: star.opacity,
                            }
                        ]}
                    />
                ))}
            </View>

            {/* Twinkling Stars Group 1 */}
            <Animated.View style={[StyleSheet.absoluteFillObject, twinklingStyle1]} pointerEvents="none">
                <View style={[styles.star, { left: width * 0.2, top: height * 0.15, width: 3, height: 3 }]} />
                <View style={[styles.star, { left: width * 0.8, top: height * 0.4, width: 2, height: 2 }]} />
                <View style={[styles.star, { left: width * 0.4, top: height * 0.8, width: 4, height: 4 }]} />
            </Animated.View>

            {/* Twinkling Stars Group 2 */}
            <Animated.View style={[StyleSheet.absoluteFillObject, twinklingStyle2]} pointerEvents="none">
                <View style={[styles.star, { left: width * 0.7, top: height * 0.1, width: 2, height: 2 }]} />
                <View style={[styles.star, { left: width * 0.1, top: height * 0.6, width: 3, height: 3 }]} />
                <View style={[styles.star, { left: width * 0.6, top: height * 0.9, width: 2, height: 2 }]} />
            </Animated.View>

            {/* Shooting Star */}
            <Animated.View style={[styles.shootingStarContainer, shootingStarStyle]} pointerEvents="none">
                <LinearGradient
                    colors={['rgba(255, 255, 255, 1)', 'rgba(255, 255, 255, 0)']}
                    style={styles.shootingStarTail}
                    start={{ x: 0, y: 0.5 }}
                    end={{ x: 1, y: 0.5 }}
                />
                <View style={styles.shootingStarHead} />
            </Animated.View>

            {/* Content layered on top */}
            <View style={styles.content}>
                {children}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background, // Base dark color fallback
    },
    content: {
        flex: 1,
        zIndex: 1,
    },
    star: {
        position: 'absolute',
        backgroundColor: colors.text,
    },
    shootingStarContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        flexDirection: 'row',
        alignItems: 'center',
        width: 150,
        height: 2,
    },
    shootingStarTail: {
        flex: 1,
        height: 1,
    },
    shootingStarHead: {
        width: 4,
        height: 4,
        borderRadius: 2,
        backgroundColor: colors.text,
        shadowColor: colors.text,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 1,
        shadowRadius: 4,
        elevation: 5,
    }
});
