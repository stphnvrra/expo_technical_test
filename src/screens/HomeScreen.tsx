import React, { useCallback } from 'react';
import { 
  StyleSheet, 
  View, 
  FlatList, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  ActivityIndicator 
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { usePokemonList } from '../hooks/usePokemonList';
import { PokemonCard } from '../components/pokemon/PokemonCard';
import { SearchBar } from '../components/common/SearchBar';
import { SkeletonRect } from '../components/common/SkeletonLoader';
import { ErrorState, EmptyState } from '../components/common/FeedbackStates';
import { THEME } from '../theme/theme';
import { capitalize } from '../utils/utils';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

const TYPES_LIST = [
  'normal', 'fire', 'water', 'electric', 'grass', 'ice', 
  'fighting', 'poison', 'ground', 'flying', 'psychic', 
  'bug', 'rock', 'ghost', 'dragon', 'steel', 'fairy', 'dark'
];

export const HomeScreen: React.FC<Props> = ({ navigation }) => {
  const {
    pokemon,
    isLoading,
    isLoadingMore,
    isRefreshing,
    error,
    searchQuery,
    selectedType,
    isSearchingApi,
    loadMore,
    refresh,
    setSearch,
    setType,
  } = usePokemonList();

  const handleCardPress = useCallback((idOrName: string | number, name: string) => {
    navigation.navigate('PokemonDetail', { idOrName, name });
  }, [navigation]);

  // Optimized FlatList render function
  const renderItem = useCallback(
    ({ item }: { item: typeof pokemon[0] }) => (
      <PokemonCard
        pokemon={item}
        onPress={() => handleCardPress(item.id, item.name)}
      />
    ),
    [handleCardPress]
  );

  // Layout optimization for FlatList (prevents layout computation delays)
  const getItemLayout = useCallback(
    (_: unknown, index: number) => ({
      length: 136, // Card height (120) + margin (16 total vertical padding/margin)
      offset: 136 * index,
      index,
    }),
    []
  );

  const handleTypeSelect = (type: string) => {
    if (selectedType === type) {
      setType(null); // Deselect
    } else {
      setType(type); // Select
    }
  };

  // Skeleton placeholders during initial load
  const renderSkeletons = () => (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.skeletonContainer}>
        {Array.from({ length: 6 }).map((_, i) => (
          <View key={i} style={styles.skeletonCard}>
            <View style={{ flex: 1 }}>
              <SkeletonRect width="40%" height={16} style={{ marginBottom: THEME.spacing.sm }} />
              <SkeletonRect width="75%" height={24} style={{ marginBottom: THEME.spacing.md }} />
              <View style={{ flexDirection: 'row' }}>
                <SkeletonRect width={60} height={24} borderRadius={12} style={{ marginRight: THEME.spacing.xs }} />
                <SkeletonRect width={60} height={24} borderRadius={12} />
              </View>
            </View>
            <SkeletonRect width={80} height={80} borderRadius={40} />
          </View>
        ))}
      </View>
    </ScrollView>
  );

  return (
    <View style={styles.container}>
      {/* Search Input */}
      <SearchBar
        placeholder="Search Pokémon by Name or ID..."
        onSearch={setSearch}
        isLoading={isSearchingApi}
      />

      {/* Horizontal Category Chips */}
      <View style={styles.filterWrapper}>
        <FlatList
          horizontal
          data={TYPES_LIST}
          keyExtractor={(item) => item}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.typeListContainer}
          renderItem={({ item }) => {
            const isSelected = selectedType === item;
            const colors = THEME.typeColors[item] || THEME.typeColors.normal;
            return (
              <TouchableOpacity
                activeOpacity={0.8}
                style={[
                  styles.typeChip,
                  { 
                    backgroundColor: isSelected ? colors.bg : THEME.colors.cardBackground,
                    borderColor: isSelected ? colors.bg : THEME.colors.border,
                  }
                ]}
                onPress={() => handleTypeSelect(item)}
              >
                <Text 
                  style={[
                    styles.typeChipText,
                    { color: isSelected ? colors.text : THEME.colors.textSecondary }
                  ]}
                >
                  {capitalize(item)}
                </Text>
              </TouchableOpacity>
            );
          }}
        />
      </View>

      {/* Loading & Feedback States */}
      {isLoading ? (
        renderSkeletons()
      ) : error ? (
        <ErrorState message={error} onRetry={refresh} />
      ) : pokemon.length === 0 ? (
        <EmptyState 
          onClear={selectedType || searchQuery ? () => { setSearch(''); setType(null); } : undefined} 
        />
      ) : (
        <FlatList
          data={pokemon}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          onEndReached={loadMore}
          onEndReachedThreshold={0.5}
          refreshing={isRefreshing}
          onRefresh={refresh}
          getItemLayout={getItemLayout}
          maxToRenderPerBatch={10}
          initialNumToRender={8}
          windowSize={5}
          removeClippedSubviews={true}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListFooterComponent={
            isLoadingMore ? (
              <View style={styles.loaderFooter}>
                <ActivityIndicator size="small" color={THEME.colors.primary} />
              </View>
            ) : null
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.colors.background,
  },
  filterWrapper: {
    height: 48,
    marginVertical: THEME.spacing.sm,
  },
  typeListContainer: {
    paddingHorizontal: THEME.spacing.md,
    alignItems: 'center',
  },
  typeChip: {
    paddingHorizontal: THEME.spacing.lg,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    marginRight: THEME.spacing.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  typeChipText: {
    fontSize: THEME.typography.sizes.sm,
    fontWeight: '700',
  },
  listContent: {
    paddingBottom: THEME.spacing.xxl,
  },
  loaderFooter: {
    paddingVertical: THEME.spacing.lg,
    alignItems: 'center',
  },
  skeletonContainer: {
    paddingBottom: THEME.spacing.xxl,
  },
  skeletonCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: THEME.colors.cardBackground,
    borderRadius: 20,
    padding: THEME.spacing.lg,
    marginVertical: THEME.spacing.sm,
    marginHorizontal: THEME.spacing.md,
    height: 120,
    borderWidth: 1,
    borderColor: THEME.colors.border,
  },
});
