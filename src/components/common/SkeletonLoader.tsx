import React, { useEffect } from 'react';
import { View, StyleSheet, StyleProp, ViewStyle, DimensionValue } from 'react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withRepeat, 
  withTiming, 
  withSequence
} from 'react-native-reanimated';
import { THEME } from '../../theme/theme';

interface SkeletonProps {
  style?: StyleProp<ViewStyle>;
}

export const SkeletonRect: React.FC<SkeletonProps & { width?: DimensionValue; height?: DimensionValue; borderRadius?: number }> = ({ 
  style, 
  width = '100%', 
  height = 20, 
  borderRadius = 8 
}) => {
  const opacity = useSharedValue(0.3);

  useEffect(() => {
    opacity.value = withRepeat(
      withSequence(
        withTiming(0.8, { duration: 800 }),
        withTiming(0.3, { duration: 800 })
      ),
      -1, // infinite repeat
      true // reverse on repeat
    );
  }, [opacity]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <Animated.View 
      style={[
        styles.skeleton, 
        { width, height, borderRadius }, 
        style, 
        animatedStyle
      ]} 
    />
  );
};

export const SkeletonCircle: React.FC<SkeletonProps & { size?: number }> = ({ 
  style, 
  size = 50 
}) => {
  return (
    <SkeletonRect 
      style={style} 
      width={size} 
      height={size} 
      borderRadius={size / 2} 
    />
  );
};

const styles = StyleSheet.create({
  skeleton: {
    backgroundColor: THEME.colors.border,
  },
});
