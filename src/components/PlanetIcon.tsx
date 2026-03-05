import React from 'react';
import { View, StyleSheet } from 'react-native';
import { colors } from '../theme/colors';

interface PlanetIconProps {
    size?: number;
    color?: string;
    ringColor?: string;
}

export default function PlanetIcon({
    size = 32,
    color = colors.primary,
    ringColor = colors.tertiary
}: PlanetIconProps) {
    const planetSize = size * 0.85;
    const ringWidth = size * 1.3;
    const ringHeight = size * 0.45;

    return (
        <View style={[styles.container, { width: size, height: size }]}>
            {/* Planet Body */}
            <View style={[
                styles.planet,
                {
                    width: planetSize,
                    height: planetSize,
                    borderRadius: planetSize / 2,
                    backgroundColor: color
                }
            ]}>
                {/* Craters */}
                <View style={[styles.crater, { top: '20%', left: '20%', width: '25%', height: '25%', borderRadius: 100 }]} />
                <View style={[styles.crater, { top: '55%', left: '60%', width: '15%', height: '15%', borderRadius: 100 }]} />
            </View>

            {/* Planet Ring */}
            <View style={[
                styles.ringWrapper,
                {
                    width: ringWidth,
                    height: ringHeight,
                    transform: [{ rotate: '-30deg' }]
                }
            ]}>
                <View style={[
                    styles.ring,
                    {
                        width: ringWidth,
                        height: ringHeight,
                        borderRadius: ringWidth / 2,
                        borderColor: ringColor,
                        borderWidth: size * 0.12,
                    }
                ]} />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    planet: {
        overflow: 'hidden',
        zIndex: 2,
        position: 'relative',
    },
    crater: {
        position: 'absolute',
        backgroundColor: 'rgba(0, 0, 0, 0.1)',
    },
    ringWrapper: {
        position: 'absolute',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 3,
    },
    ring: {
        borderTopColor: 'transparent', // Partial ring for layering
    }
});
