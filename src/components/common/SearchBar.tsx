import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, TextInput, View, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Search, X } from 'lucide-react-native';
import { THEME } from '../../theme/theme';

interface SearchBarProps {
  placeholder: string;
  onSearch: (text: string) => void;
  isLoading?: boolean;
}

export const SearchBar: React.FC<SearchBarProps> = ({ placeholder, onSearch, isLoading = false }) => {
  const [value, setValue] = useState('');
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Debounced search trigger
  const handleChangeText = (text: string) => {
    // Basic Input Sanitization: strip leading/trailing spaces and special characters that PokeAPI doesn't accept.
    // PokeAPI name query accepts letters, numbers, and dashes.
    const sanitized = text.replace(/[^a-zA-Z0-9-]/g, '').toLowerCase();
    setValue(sanitized);

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      onSearch(sanitized);
    }, 450); // 450ms debounce
  };

  const handleClear = () => {
    setValue('');
    onSearch('');
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.searchSection}>
        <Search style={styles.searchIcon} color={THEME.colors.textSecondary} size={20} />
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          placeholderTextColor={THEME.colors.textSecondary}
          value={value}
          onChangeText={handleChangeText}
          underlineColorAndroid="transparent"
          autoCorrect={false}
          autoCapitalize="none"
          keyboardType="default"
          returnKeyType="search"
        />
        {isLoading ? (
          <ActivityIndicator size="small" color={THEME.colors.primary} style={styles.clearIcon} />
        ) : value.length > 0 ? (
          <TouchableOpacity onPress={handleClear} activeOpacity={0.7} style={styles.clearButton}>
            <X style={styles.clearIcon} color={THEME.colors.textSecondary} size={18} />
          </TouchableOpacity>
        ) : null}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: THEME.spacing.sm,
    paddingHorizontal: THEME.spacing.md,
  },
  searchSection: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: THEME.colors.cardBackground,
    borderWidth: 1,
    borderColor: THEME.colors.border,
    borderRadius: 16,
    height: 52,
    paddingHorizontal: THEME.spacing.md,
    ...THEME.shadows.light,
  },
  searchIcon: {
    marginRight: THEME.spacing.sm,
  },
  input: {
    flex: 1,
    height: '100%',
    color: THEME.colors.text,
    fontSize: THEME.typography.sizes.lg,
    paddingVertical: 0,
  },
  clearButton: {
    padding: THEME.spacing.xs,
  },
  clearIcon: {
    marginLeft: THEME.spacing.xs,
  },
});
