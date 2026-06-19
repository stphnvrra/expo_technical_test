import React, { useCallback } from 'react';
import { 
  StyleSheet, 
  View, 
  FlatList, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  ActivityIndicator,
  Dimensions,
  SafeAreaView
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import Animated, { FadeInDown, FadeIn } from 'react-native-reanimated';
import { RootStackParamList } from '../navigation/AppNavigator';
import { usePokemonList } from '../hooks/usePokemonList';
import { PokemonCard } from '../components/pokemon/PokemonCard';
import { SearchBar } from '../components/common/SearchBar';
import { SkeletonRect } from '../components/common/SkeletonLoader';
import { ErrorState, EmptyState } from '../components/common/FeedbackStates';
import { THEME } from '../theme/theme';
import { capitalize } from '../utils/utils';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

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

  // Optimized FlatList render function with stagger animations
  const renderItem = useCallback(
    ({ item, index }: { item: typeof pokemon[0]; index: number }) => {
      // Limit delay to avoid animation lag on long lists
      const animationDelay = (index % 10) * 80;
      return (
        <Animated.View 
          entering={FadeInDown.delay(animationDelay).duration(450)}
        >
          <PokemonCard
            pokemon={item}
            onPress={() => handleCardPress(item.id, item.name)}
          />
        </Animated.View>
      );
    },
    [handleCardPress]
  );

  // Layout optimization for 2-column FlatList (card height is 175, margins/paddings make row height 195)
  const getItemLayout = useCallback(
    (_: unknown, index: number) => ({
      length: 195,
      offset: 195 * Math.floor(index / 2),
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

  // Skeleton placeholders during initial load (in a 2-column layout)
  const renderSkeletons = () => (
    <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
      <View style={styles.skeletonGrid}>
        {Array.from({ length: 6 }).map((_, i) => (
          <View key={i} style={styles.skeletonCard}>
            <View style={styles.skeletonTopRow}>
              <SkeletonRect width="40%" height={14} borderRadius={7} />
            </View>
            <View style={styles.skeletonMiddle}>
              <SkeletonRect width="70%" height={70} borderRadius={35} />
            </View>
            <View style={styles.skeletonBottom}>
              <SkeletonRect width="75%" height={16} style={{ marginBottom: THEME.spacing.sm }} />
              <View style={{ flexDirection: 'row' }}>
                <SkeletonRect width={55} height={18} borderRadius={9} style={{ marginRight: THEME.spacing.xs }} />
                <SkeletonRect width={55} height={18} borderRadius={9} />
              </View>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Absolute watermark Pokéball background */}
      <View style={styles.bgPokeball}>
        <View style={styles.pokeballRing} />
        <View style={styles.pokeballCenterCircle} />
      </View>

      {/* Custom Header Section */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Pokédex</Text>
        <Text style={styles.headerSubtitle}>
          Explore the world of Pokémon with details, stats, and elements.
        </Text>
      </View>

      {/* Search Input */}
      <SearchBar
        placeholder="Search by Name or ID..."
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
                    backgroundColor: isSelected ? colors.bg : 'rgba(30, 41, 59, 0.45)',
                    borderColor: isSelected ? colors.bg : THEME.colors.border,
                    shadowColor: isSelected ? colors.bg : 'transparent',
                    shadowOpacity: isSelected ? 0.35 : 0,
                    shadowRadius: isSelected ? 6 : 0,
                    elevation: isSelected ? 4 : 0,
                  }
                ]}
                onPress={() => handleTypeSelect(item)}
              >
                <Text 
                  style={[
                    styles.typeChipText,
                    { 
                      color: isSelected ? THEME.colors.white : THEME.colors.textSecondary,
                      fontWeight: isSelected ? '900' : '700'
                    }
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
        <View style={{ flex: 1 }}>
          <EmptyState 
            onClear={selectedType || searchQuery ? () => { setSearch(''); setType(null); } : undefined} 
          />
        </View>
      ) : (
        <FlatList
          data={pokemon}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          numColumns={2}
          columnWrapperStyle={styles.columnWrapper}
          onEndReached={loadMore}
          onEndReachedThreshold={0.4}
          refreshing={isRefreshing}
          onRefresh={refresh}
          getItemLayout={getItemLayout}
          maxToRenderPerBatch={10}
          initialNumToRender={8}
          windowSize={7}
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
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.colors.background,
  },
  scrollContainer: {
    flex: 1,
  },
  bgPokeball: {
    position: 'absolute',
    right: -70,
    top: -50,
    width: 250,
    height: 250,
    opacity: 0.02,
    pointerEvents: 'none',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pokeballRing: {
    width: 240,
    height: 240,
    borderRadius: 120,
    borderWidth: 20,
    borderColor: THEME.colors.white,
  },
  pokeballCenterCircle: {
    position: 'absolute',
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 15,
    borderColor: THEME.colors.white,
    backgroundColor: THEME.colors.background,
  },
  header: {
    paddingHorizontal: THEME.spacing.md,
    marginTop: THEME.spacing.lg,
    marginBottom: THEME.spacing.sm,
  },
  headerTitle: {
    fontSize: 38,
    fontWeight: '900',
    color: THEME.colors.text,
    letterSpacing: -0.5,
  },
  headerSubtitle: {
    fontSize: 14,
    color: THEME.colors.textSecondary,
    marginTop: 6,
    lineHeight: 20,
    fontWeight: '500',
  },
  filterWrapper: {
    height: 48,
    marginVertical: THEME.spacing.xs,
  },
  typeListContainer: {
    paddingHorizontal: THEME.spacing.md,
    alignItems: 'center',
  },
  typeChip: {
    paddingHorizontal: THEME.spacing.lg,
    paddingVertical: 7,
    borderRadius: 18,
    borderWidth: 1.5,
    marginRight: THEME.spacing.sm,
    alignItems: 'center',
    justifyContent: 'center',
    shadowOffset: { width: 0, height: 2 },
  },
  typeChipText: {
    fontSize: THEME.typography.sizes.sm,
    letterSpacing: 0.2,
  },
  listContent: {
    paddingHorizontal: 8,
    paddingTop: THEME.spacing.sm,
    paddingBottom: THEME.spacing.xxl,
  },
  columnWrapper: {
    justifyContent: 'space-between',
  },
  loaderFooter: {
    paddingVertical: THEME.spacing.lg,
    alignItems: 'center',
  },
  skeletonGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 8,
    paddingBottom: THEME.spacing.xxl,
  },
  skeletonCard: {
    width: (Dimensions.get('window').width - 40) / 2,
    height: 175,
    borderRadius: 24,
    backgroundColor: 'rgba(30, 41, 59, 0.4)',
    borderWidth: 1,
    borderColor: THEME.colors.border,
    padding: THEME.spacing.md,
    marginHorizontal: 8,
    marginVertical: 10,
    justifyContent: 'space-between',
  },
  skeletonTopRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  skeletonMiddle: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  skeletonBottom: {
    marginTop: 5,
  },
});
