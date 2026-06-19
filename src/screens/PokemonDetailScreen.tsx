import React, { useEffect } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  ScrollView, 
  Image, 
  TouchableOpacity, 
  SafeAreaView 
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming, 
  Easing 
} from 'react-native-reanimated';
import { RootStackParamList } from '../navigation/AppNavigator';
import { usePokemonDetails } from '../hooks/usePokemonDetails';
import { SkeletonRect, SkeletonCircle } from '../components/common/SkeletonLoader';
import { ErrorState } from '../components/common/FeedbackStates';
import { THEME } from '../theme/theme';
import { capitalize, formatPokemonId, convertHeight, convertWeight } from '../utils/utils';

type Props = NativeStackScreenProps<RootStackParamList, 'PokemonDetail'>;

// Stat names mapping to short reader-friendly text
const STAT_NAMES: Record<string, string> = {
  hp: 'HP',
  attack: 'ATK',
  defense: 'DEF',
  'special-attack': 'SATK',
  'special-defense': 'SDEF',
  speed: 'SPD',
};

// Component for a single animated stat bar
const StatBar: React.FC<{ name: string; value: number; color: string }> = ({ name, value, color }) => {
  const animatedWidth = useSharedValue(0);
  const maxStatVal = 200; // Normalizing value (usually stats are <= 255)
  const percentage = Math.min((value / maxStatVal) * 100, 100);

  useEffect(() => {
    animatedWidth.value = withTiming(percentage, {
      duration: 1000,
      easing: Easing.bezier(0.25, 0.1, 0.25, 1),
    });
  }, [percentage, animatedWidth]);

  const animatedStyle = useAnimatedStyle(() => ({
    width: `${animatedWidth.value}%`,
  }));

  return (
    <View style={styles.statRow}>
      <Text style={styles.statNameLabel}>{STAT_NAMES[name] || name.toUpperCase()}</Text>
      <Text style={styles.statValueLabel}>{value}</Text>
      <View style={styles.statTrack}>
        <Animated.View style={[styles.statFill, { backgroundColor: color }, animatedStyle]} />
      </View>
    </View>
  );
};

export const PokemonDetailScreen: React.FC<Props> = ({ route, navigation }) => {
  const { idOrName } = route.params;
  const { detail, description, isLoading, error, retry } = usePokemonDetails(idOrName);

  // Fallback styling setup
  const primaryType = detail?.types[0]?.type.name || 'normal';
  const elementColors = THEME.typeColors[primaryType] || THEME.typeColors.normal;

  // Render Skeletons for detailed view loading
  const renderSkeletons = () => (
    <SafeAreaView style={styles.safeContainer}>
      <View style={styles.skeletonTop}>
        <SkeletonCircle size={200} style={{ marginBottom: THEME.spacing.lg }} />
        <SkeletonRect width="60%" height={32} style={{ marginBottom: THEME.spacing.sm }} />
        <View style={{ flexDirection: 'row', marginBottom: THEME.spacing.xl }}>
          <SkeletonRect width={80} height={28} borderRadius={14} style={{ marginRight: THEME.spacing.sm }} />
          <SkeletonRect width={80} height={28} borderRadius={14} />
        </View>
      </View>
      <View style={styles.skeletonCardDetails}>
        <SkeletonRect width="90%" height={16} style={{ marginBottom: THEME.spacing.sm, alignSelf: 'center' }} />
        <SkeletonRect width="80%" height={16} style={{ marginBottom: THEME.spacing.xl, alignSelf: 'center' }} />
        
        <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginBottom: THEME.spacing.xl }}>
          <View style={{ alignItems: 'center' }}>
            <SkeletonRect width={60} height={16} style={{ marginBottom: THEME.spacing.sm }} />
            <SkeletonRect width={80} height={24} />
          </View>
          <View style={{ alignItems: 'center' }}>
            <SkeletonRect width={60} height={16} style={{ marginBottom: THEME.spacing.sm }} />
            <SkeletonRect width={80} height={24} />
          </View>
        </View>
        
        <SkeletonRect width="40%" height={24} style={{ marginBottom: THEME.spacing.md }} />
        {Array.from({ length: 4 }).map((_, idx) => (
          <View key={idx} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: THEME.spacing.sm }}>
            <SkeletonRect width="15%" height={14} style={{ marginRight: THEME.spacing.sm }} />
            <SkeletonRect width="10%" height={14} style={{ marginRight: THEME.spacing.sm }} />
            <SkeletonRect width="65%" height={10} />
          </View>
        ))}
      </View>
    </SafeAreaView>
  );

  if (isLoading) {
    return renderSkeletons();
  }

  if (error || !detail) {
    return (
      <View style={styles.errorWrapper}>
        <ErrorState message={error || 'Pokemon detail is unavailable.'} onRetry={retry} />
      </View>
    );
  }

  const { meters, imperial } = convertHeight(detail.height);
  const { kilograms, pounds } = convertWeight(detail.weight);
  const imageUrl = detail.sprites.other?.['official-artwork']?.front_default || detail.sprites.front_default || '';

  return (
    <SafeAreaView style={styles.safeContainer}>
      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {/* Header/Artwork Section */}
        <View style={styles.headerSection}>
          {/* Subtle glowing halo base */}
          <View 
            style={[
              styles.artworkHalo, 
              { backgroundColor: elementColors.bg, shadowColor: elementColors.bg }
            ]} 
          />

          {imageUrl ? (
            <Image 
              source={{ uri: imageUrl }} 
              style={styles.artworkImage}
              resizeMode="contain"
            />
          ) : (
            <View style={styles.imagePlaceholder} />
          )}

          <Text style={styles.pokemonId}>{formatPokemonId(detail.id)}</Text>
          <Text style={styles.pokemonName}>{capitalize(detail.name)}</Text>

          {/* Element Type Capsule Badges */}
          <View style={styles.badgeRow}>
            {detail.types.map((t) => {
              const badgeColors = THEME.typeColors[t.type.name] || THEME.typeColors.normal;
              return (
                <View 
                  key={t.type.name} 
                  style={[styles.typeBadge, { backgroundColor: badgeColors.bg }]}
                >
                  <Text style={[styles.typeBadgeText, { color: badgeColors.text }]}>
                    {capitalize(t.type.name)}
                  </Text>
                </View>
              );
            })}
          </View>
        </View>

        {/* Detailed Information Deck */}
        <View style={styles.detailsDeck}>
          {/* Summary / Description */}
          {description ? (
            <Text style={styles.descriptionText}>{description}</Text>
          ) : null}

          {/* Physical Attributes Metrics Card */}
          <View style={styles.metricsContainer}>
            <View style={styles.metricItem}>
              <Text style={styles.metricLabel}>HEIGHT</Text>
              <Text style={styles.metricValue}>{meters}</Text>
              <Text style={styles.metricSubvalue}>{imperial}</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.metricItem}>
              <Text style={styles.metricLabel}>WEIGHT</Text>
              <Text style={styles.metricValue}>{kilograms}</Text>
              <Text style={styles.metricSubvalue}>{pounds}</Text>
            </View>
          </View>

          {/* Abilities capsules */}
          <Text style={styles.sectionHeader}>Abilities</Text>
          <View style={styles.abilitiesWrapper}>
            {detail.abilities.map((a) => (
              <View 
                key={a.ability.name} 
                style={[
                  styles.abilityBadge, 
                  { borderColor: a.is_hidden ? THEME.colors.primary : THEME.colors.border }
                ]}
              >
                <Text style={styles.abilityText}>{capitalize(a.ability.name)}</Text>
                {a.is_hidden && (
                  <View style={styles.hiddenIndicator}>
                    <Text style={styles.hiddenText}>HIDDEN</Text>
                  </View>
                )}
              </View>
            ))}
          </View>

          {/* Base Stats Dashboard */}
          <Text style={styles.sectionHeader}>Base Stats</Text>
          <View style={styles.statsCard}>
            {detail.stats.map((s) => (
              <StatBar
                key={s.stat.name}
                name={s.stat.name}
                value={s.base_stat}
                color={elementColors.bg}
              />
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: THEME.colors.background,
  },
  scrollContainer: {
    paddingBottom: THEME.spacing.xxl,
  },
  errorWrapper: {
    flex: 1,
    backgroundColor: THEME.colors.background,
    justifyContent: 'center',
  },
  headerSection: {
    alignItems: 'center',
    paddingVertical: THEME.spacing.xl,
    position: 'relative',
  },
  artworkHalo: {
    position: 'absolute',
    width: 220,
    height: 220,
    borderRadius: 110,
    opacity: 0.15,
    top: THEME.spacing.xl,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.6,
    shadowRadius: 25,
    elevation: 10,
  },
  artworkImage: {
    width: 200,
    height: 200,
    zIndex: 3,
    marginBottom: THEME.spacing.md,
  },
  imagePlaceholder: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'rgba(255,255,255,0.03)',
    marginBottom: THEME.spacing.md,
  },
  pokemonId: {
    fontSize: THEME.typography.sizes.md,
    fontWeight: 'bold',
    color: THEME.colors.textSecondary,
    marginBottom: THEME.spacing.xs,
  },
  pokemonName: {
    fontSize: THEME.typography.sizes.title,
    fontWeight: 'bold',
    color: THEME.colors.text,
    marginBottom: THEME.spacing.sm,
  },
  badgeRow: {
    flexDirection: 'row',
    marginTop: THEME.spacing.xs,
  },
  typeBadge: {
    paddingHorizontal: THEME.spacing.xl,
    paddingVertical: 6,
    borderRadius: 16,
    marginHorizontal: THEME.spacing.xs,
  },
  typeBadgeText: {
    fontSize: THEME.typography.sizes.md,
    fontWeight: 'bold',
  },
  detailsDeck: {
    backgroundColor: THEME.colors.cardBackground,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    paddingHorizontal: THEME.spacing.xl,
    paddingTop: THEME.spacing.xl,
    paddingBottom: THEME.spacing.xxl,
    minHeight: 400,
    borderTopWidth: 1,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: THEME.colors.border,
  },
  descriptionText: {
    fontSize: THEME.typography.sizes.md,
    color: THEME.colors.textSecondary,
    lineHeight: 22,
    textAlign: 'center',
    marginBottom: THEME.spacing.xl,
  },
  metricsContainer: {
    flexDirection: 'row',
    backgroundColor: 'rgba(15, 23, 42, 0.4)',
    borderRadius: 20,
    paddingVertical: THEME.spacing.md,
    marginBottom: THEME.spacing.xl,
    borderWidth: 1,
    borderColor: THEME.colors.border,
  },
  metricItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  divider: {
    width: 1,
    backgroundColor: THEME.colors.border,
    height: '60%',
    alignSelf: 'center',
  },
  metricLabel: {
    fontSize: THEME.typography.sizes.xs,
    fontWeight: '800',
    color: THEME.colors.textSecondary,
    marginBottom: THEME.spacing.xs,
    letterSpacing: 1.5,
  },
  metricValue: {
    fontSize: THEME.typography.sizes.lg,
    fontWeight: 'bold',
    color: THEME.colors.text,
  },
  metricSubvalue: {
    fontSize: THEME.typography.sizes.sm,
    color: THEME.colors.textSecondary,
    marginTop: 2,
  },
  sectionHeader: {
    fontSize: THEME.typography.sizes.lg,
    fontWeight: 'bold',
    color: THEME.colors.text,
    marginBottom: THEME.spacing.md,
    marginTop: THEME.spacing.sm,
  },
  abilitiesWrapper: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: THEME.spacing.xl,
  },
  abilityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: THEME.spacing.md,
    paddingVertical: 6,
    marginRight: THEME.spacing.sm,
    marginBottom: THEME.spacing.sm,
  },
  abilityText: {
    color: THEME.colors.text,
    fontSize: THEME.typography.sizes.md,
    fontWeight: '600',
  },
  hiddenIndicator: {
    backgroundColor: THEME.colors.primary,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    marginLeft: THEME.spacing.xs,
  },
  hiddenText: {
    color: THEME.colors.white,
    fontSize: 9,
    fontWeight: '900',
  },
  statsCard: {
    backgroundColor: 'rgba(15, 23, 42, 0.2)',
    borderRadius: 20,
    padding: THEME.spacing.md,
    borderWidth: 1,
    borderColor: THEME.colors.border,
  },
  statRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 6,
  },
  statNameLabel: {
    width: 45,
    fontSize: THEME.typography.sizes.sm,
    fontWeight: 'bold',
    color: THEME.colors.textSecondary,
  },
  statValueLabel: {
    width: 35,
    fontSize: THEME.typography.sizes.sm,
    fontWeight: '700',
    color: THEME.colors.text,
    textAlign: 'right',
    marginRight: THEME.spacing.sm,
  },
  statTrack: {
    flex: 1,
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 4,
    overflow: 'hidden',
  },
  statFill: {
    height: '100%',
    borderRadius: 4,
  },
  // Skeletons styles
  skeletonTop: {
    alignItems: 'center',
    paddingVertical: THEME.spacing.xl,
  },
  skeletonCardDetails: {
    backgroundColor: THEME.colors.cardBackground,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    paddingHorizontal: THEME.spacing.xl,
    paddingTop: THEME.spacing.xl,
    flex: 1,
    borderTopWidth: 1,
    borderColor: THEME.colors.border,
  },
});
