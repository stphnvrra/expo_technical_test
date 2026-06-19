import React, { useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { AlertCircle, SearchCheck, RefreshCw } from 'lucide-react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withRepeat, 
  withTiming, 
  Easing
} from 'react-native-reanimated';
import { THEME } from '../../theme/theme';

interface ErrorStateProps {
  message: string;
  onRetry: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({ message, onRetry }) => {
  const rotation = useSharedValue(0);

  useEffect(() => {
    rotation.value = withRepeat(
      withTiming(360, { duration: 2500, easing: Easing.linear }),
      -1,
      false
    );
  }, [rotation]);

  const animatedIconStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  return (
    <View style={styles.cardContainer}>
      <View style={styles.content}>
        <Animated.View style={animatedIconStyle}>
          <AlertCircle color={THEME.colors.primary} size={50} style={styles.icon} />
        </Animated.View>
        <Text style={styles.title}>Something Went Wrong</Text>
        <Text style={styles.message}>{message}</Text>
        
        <TouchableOpacity 
          style={styles.retryButton} 
          onPress={onRetry} 
          activeOpacity={0.8}
        >
          <RefreshCw color={THEME.colors.white} size={16} style={styles.btnIcon} />
          <Text style={styles.retryText}>Try Again</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

interface EmptyStateProps {
  message?: string;
  onClear?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ 
  message = "No Pokémon match your search or filter options.", 
  onClear 
}) => {
  const scale = useSharedValue(1);

  useEffect(() => {
    scale.value = withRepeat(
      withTiming(1.1, { duration: 1500, easing: Easing.bezier(0.25, 0.1, 0.25, 1) }),
      -1,
      true
    );
  }, [scale]);

  const animatedIconStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <View style={styles.cardContainer}>
      <View style={styles.content}>
        <Animated.View style={animatedIconStyle}>
          <SearchCheck color={THEME.colors.textSecondary} size={50} style={styles.icon} />
        </Animated.View>
        <Text style={styles.title}>No Results Found</Text>
        <Text style={styles.message}>{message}</Text>
        
        {onClear && (
          <TouchableOpacity 
            style={styles.clearButton} 
            onPress={onClear} 
            activeOpacity={0.8}
          >
            <Text style={styles.clearText}>Clear Filters</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    margin: THEME.spacing.xl,
    padding: THEME.spacing.xl,
    borderRadius: 28,
    backgroundColor: 'rgba(30, 41, 59, 0.45)', // Premium Glassmorphism card
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.05)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 15,
    elevation: 5,
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: THEME.spacing.lg,
  },
  icon: {
    marginBottom: THEME.spacing.md,
  },
  title: {
    fontSize: 20,
    fontWeight: '900',
    color: THEME.colors.white,
    marginBottom: THEME.spacing.sm,
    textAlign: 'center',
    letterSpacing: -0.2,
  },
  message: {
    fontSize: THEME.typography.sizes.md,
    color: THEME.colors.textSecondary,
    textAlign: 'center',
    marginBottom: THEME.spacing.xl,
    lineHeight: 22,
    fontWeight: '500',
    paddingHorizontal: THEME.spacing.md,
  },
  retryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: THEME.colors.primary,
    paddingHorizontal: THEME.spacing.xl,
    paddingVertical: THEME.spacing.md,
    borderRadius: 16,
    shadowColor: THEME.colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  btnIcon: {
    marginRight: THEME.spacing.sm,
  },
  retryText: {
    color: THEME.colors.white,
    fontSize: THEME.typography.sizes.md,
    fontWeight: '800',
  },
  clearButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: THEME.spacing.xl,
    paddingVertical: THEME.spacing.md,
    borderRadius: 16,
  },
  clearText: {
    color: THEME.colors.white,
    fontSize: THEME.typography.sizes.md,
    fontWeight: '800',
  },
});
