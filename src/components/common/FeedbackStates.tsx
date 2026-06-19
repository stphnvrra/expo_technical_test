import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { AlertCircle, SearchCheck, RefreshCw } from 'lucide-react-native';
import { THEME } from '../../theme/theme';

interface ErrorStateProps {
  message: string;
  onRetry: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({ message, onRetry }) => {
  return (
    <View style={styles.container}>
      <AlertCircle color={THEME.colors.primary} size={48} style={styles.icon} />
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
  return (
    <View style={styles.container}>
      <SearchCheck color={THEME.colors.textSecondary} size={48} style={styles.icon} />
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
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: THEME.spacing.xxl,
    marginVertical: THEME.spacing.xxl,
  },
  icon: {
    marginBottom: THEME.spacing.md,
  },
  title: {
    fontSize: THEME.typography.sizes.xl,
    fontWeight: 'bold',
    color: THEME.colors.text,
    marginBottom: THEME.spacing.sm,
    textAlign: 'center',
  },
  message: {
    fontSize: THEME.typography.sizes.md,
    color: THEME.colors.textSecondary,
    textAlign: 'center',
    marginBottom: THEME.spacing.xl,
    lineHeight: 20,
  },
  retryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: THEME.colors.primary,
    paddingHorizontal: THEME.spacing.xl,
    paddingVertical: THEME.spacing.md,
    borderRadius: 12,
    ...THEME.shadows.medium,
  },
  btnIcon: {
    marginRight: THEME.spacing.sm,
  },
  retryText: {
    color: THEME.colors.white,
    fontSize: THEME.typography.sizes.md,
    fontWeight: '600',
  },
  clearButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: THEME.colors.border,
    paddingHorizontal: THEME.spacing.xl,
    paddingVertical: THEME.spacing.md,
    borderRadius: 12,
  },
  clearText: {
    color: THEME.colors.text,
    fontSize: THEME.typography.sizes.md,
    fontWeight: '600',
  },
});
