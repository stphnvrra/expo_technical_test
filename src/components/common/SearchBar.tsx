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
  const [isFocused, setIsFocused] = useState(false);
  const timeoutRef = useRef<any | null>(null);

  // Debounced search trigger
  const handleChangeText = (text: string) => {
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
      <View 
        style={[
          styles.searchSection,
          isFocused && styles.searchSectionFocused,
        ]}
      >
        <Search 
          style={styles.searchIcon} 
          color={isFocused ? THEME.colors.primary : THEME.colors.textSecondary} 
          size={20} 
        />
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          placeholderTextColor="rgba(148, 163, 184, 0.6)"
          value={value}
          onChangeText={handleChangeText}
          underlineColorAndroid="transparent"
          autoCorrect={false}
          autoCapitalize="none"
          keyboardType="default"
          returnKeyType="search"
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
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
    marginVertical: THEME.spacing.md,
    paddingHorizontal: THEME.spacing.md,
  },
  searchSection: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(30, 41, 59, 0.45)',
    borderWidth: 1.5,
    borderColor: THEME.colors.border,
    borderRadius: 20,
    height: 54,
    paddingHorizontal: THEME.spacing.lg,
    ...THEME.shadows.light,
  },
  searchSectionFocused: {
    borderColor: THEME.colors.primary,
    backgroundColor: 'rgba(30, 41, 59, 0.75)',
    shadowColor: THEME.colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
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
    fontWeight: '600',
  },
  clearButton: {
    padding: THEME.spacing.xs,
  },
  clearIcon: {
    marginLeft: THEME.spacing.xs,
  },
});
