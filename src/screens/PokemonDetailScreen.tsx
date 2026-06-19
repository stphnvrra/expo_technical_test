import React, { useEffect } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  ScrollView, 
  Image, 
  SafeAreaView,
  Dimensions
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withRepeat, 
  withTiming, 
  withSequence,
  FadeInDown,
  FadeInUp
} from 'react-native-reanimated';
import { Ruler, Weight as WeightIcon, Zap, Sparkles } from 'lucide-react-native';
import { RootStackParamList } from '../navigation/AppNavigator';
import { usePokemonDetails } from '../hooks/usePokemonDetails';
import { SkeletonRect, SkeletonCircle } from '../components/common/SkeletonLoader';
import { ErrorState } from '../components/common/FeedbackStates';
import { THEME } from '../theme/theme';
import { capitalize, formatPokemonId, convertHeight, convertWeight } from '../utils/utils';

type Props = NativeStackScreenProps<RootStackParamList, 'PokemonDetail'>;

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const STAT_NAMES: Record<string, string> = {
  hp: 'HP',
  attack: 'ATK',
  defense: 'DEF',
  'special-attack': 'SATK',
  'special-defense': 'SDEF',
  speed: 'SPD',
};

const STAT_MAX_VALUES: Record<string, number> = {
  hp: 255,
  attack: 190,
  defense: 230,
  'special-attack': 194,
  'special-defense': 230,
  speed: 180,
};

// StatBar with double-gradient animation
const StatBar: React.FC<{ name: string; value: number; colors: [string, string] }> = ({ name, value, colors }) => {
  const animatedWidth = useSharedValue(0);
  const maxVal = STAT_MAX_VALUES[name] || 200;
  const percentage = Math.min((value / maxVal) * 100, 100);

  useEffect(() => {
    animatedWidth.value = withTiming(percentage, {
      duration: 1000,
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
        <Animated.View style={[styles.statFillWrapper, animatedStyle]}>
          <LinearGradient
            colors={colors}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.statFillGradient}
          />
        </Animated.View>
      </View>
    </View>
  );
};

export const PokemonDetailScreen: React.FC<Props> = ({ route, navigation }) => {
  const { idOrName } = route.params;
  const { detail, description, isLoading, error, retry } = usePokemonDetails(idOrName);

  // Pulsating animation for the glowing backdrop ring
  const ringScale = useSharedValue(1);
  const ringOpacity = useSharedValue(0.45);

  useEffect(() => {
    if (detail) {
      ringScale.value = withRepeat(
        withSequence(
          withTiming(1.1, { duration: 1500 }),
          withTiming(1.0, { duration: 1500 })
        ),
        -1,
        true
      );
      ringOpacity.value = withRepeat(
        withSequence(
          withTiming(0.7, { duration: 1500 }),
          withTiming(0.45, { duration: 1500 })
        ),
        -1,
        true
      );
    }
  }, [detail, ringScale, ringOpacity]);

  const animatedRingStyle = useAnimatedStyle(() => ({
    transform: [{ scale: ringScale.value }],
    opacity: ringOpacity.value,
  }));

  // Fallback styling setup
  const primaryType = detail?.types[0]?.type.name || 'normal';
  const elementColors = THEME.typeColors[primaryType] || THEME.typeColors.normal;
  const typeGradient = elementColors.gradient || [elementColors.bg, THEME.colors.cardBackground];

  // Render Skeletons for detailed view loading
  const renderSkeletons = () => (
    <SafeAreaView style={styles.safeContainer}>
      <View style={styles.skeletonTop}>
        <SkeletonCircle size={180} style={{ marginBottom: THEME.spacing.lg }} />
        <SkeletonRect width="50%" height={32} style={{ marginBottom: THEME.spacing.sm }} />
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

  // Calculate total base stats
  const totalStats = detail.stats.reduce((acc, curr) => acc + curr.base_stat, 0);

  return (
    <View style={styles.container}>
      {/* Background Gradient */}
      <LinearGradient
        colors={[elementColors.bg + '35', '#0F172A']}
        style={StyleSheet.absoluteFill}
      />

      <SafeAreaView style={styles.safeContainer}>
        <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
          {/* Header/Artwork Section */}
          <View style={styles.headerSection}>
            {/* Pulsating glowing ring behind artwork */}
            <Animated.View 
              style={[
                styles.artworkRing, 
                { borderColor: elementColors.bg, shadowColor: elementColors.bg },
                animatedRingStyle
              ]} 
            />

            {imageUrl ? (
              <Animated.Image 
                entering={FadeInUp.delay(200).duration(500)}
                source={{ uri: imageUrl }} 
                style={styles.artworkImage as any}
                resizeMode="contain"
              />
            ) : (
              <View style={styles.imagePlaceholder} />
            )}

            <Animated.View entering={FadeInDown.delay(300).duration(450)} style={styles.titleInfo}>
              <Text style={styles.pokemonId}>{formatPokemonId(detail.id)}</Text>
              <Text style={styles.pokemonName}>{capitalize(detail.name)}</Text>

              {/* Element Type Badges with LinearGradients */}
              <View style={styles.badgeRow}>
                {detail.types.map((t) => {
                  const badgeColors = THEME.typeColors[t.type.name] || THEME.typeColors.normal;
                  const colors = badgeColors.gradient || [badgeColors.bg, badgeColors.bg];
                  return (
                    <LinearGradient
                      key={t.type.name} 
                      colors={colors}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      style={styles.typeBadge}
                    >
                      <Text style={styles.typeBadgeText}>
                        {capitalize(t.type.name)}
                      </Text>
                    </LinearGradient>
                  );
                })}
              </View>
            </Animated.View>
          </View>

          {/* Detailed Information Deck */}
          <Animated.View entering={FadeInDown.delay(400).duration(500)} style={styles.detailsDeck}>
            
            {/* Summary / Description */}
            {description ? (
              <Text style={styles.descriptionText}>{description}</Text>
            ) : null}

            {/* Physical Attributes Metrics Card */}
            <View style={styles.metricsContainer}>
              <View style={styles.metricItem}>
                <View style={styles.metricHeader}>
                  <Ruler size={16} color={elementColors.bg} style={styles.metricIcon} />
                  <Text style={styles.metricLabel}>HEIGHT</Text>
                </View>
                <Text style={styles.metricValue}>{meters}</Text>
                <Text style={styles.metricSubvalue}>{imperial}</Text>
              </View>
              
              <View style={styles.divider} />
              
              <View style={styles.metricItem}>
                <View style={styles.metricHeader}>
                  <WeightIcon size={16} color={elementColors.bg} style={styles.metricIcon} />
                  <Text style={styles.metricLabel}>WEIGHT</Text>
                </View>
                <Text style={styles.metricValue}>{kilograms}</Text>
                <Text style={styles.metricSubvalue}>{pounds}</Text>
              </View>
            </View>

            {/* Abilities */}
            <Text style={styles.sectionHeader}>Abilities</Text>
            <View style={styles.abilitiesWrapper}>
              {detail.abilities.map((a) => (
                <View 
                  key={a.ability.name} 
                  style={[
                    styles.abilityBadge, 
                    { 
                      borderColor: a.is_hidden ? elementColors.bg : THEME.colors.border,
                      backgroundColor: a.is_hidden ? elementColors.bg + '10' : 'rgba(30, 41, 59, 0.4)'
                    }
                  ]}
                >
                  <Zap size={14} color={a.is_hidden ? elementColors.bg : THEME.colors.textSecondary} style={{ marginRight: 6 }} />
                  <Text style={styles.abilityText}>{capitalize(a.ability.name)}</Text>
                  {a.is_hidden && (
                    <View style={[styles.hiddenIndicator, { backgroundColor: elementColors.bg }]}>
                      <Text style={styles.hiddenText}>HIDDEN</Text>
                    </View>
                  )}
                </View>
              ))}
            </View>

            {/* Base Stats Dashboard */}
            <View style={styles.statsHeaderRow}>
              <Text style={styles.sectionHeader}>Base Stats</Text>
              <View style={[styles.totalStatsBadge, { backgroundColor: elementColors.bg + '20', borderColor: elementColors.bg + '40' }]}>
                <Sparkles size={12} color={elementColors.bg} style={{ marginRight: 4 }} />
                <Text style={[styles.totalStatsText, { color: elementColors.bg }]}>TOTAL: {totalStats}</Text>
              </View>
            </View>
            
            <View style={styles.statsCard}>
              {detail.stats.map((s) => (
                <StatBar
                  key={s.stat.name}
                  name={s.stat.name}
                  value={s.base_stat}
                  colors={typeGradient}
                />
              ))}
            </View>
          </Animated.View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.colors.background,
  },
  safeContainer: {
    flex: 1,
  },
  scrollContainer: {
    paddingTop: 80, // Clear the transparent stack header
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
  artworkRing: {
    position: 'absolute',
    width: 190,
    height: 190,
    borderRadius: 95,
    borderWidth: 2,
    borderStyle: 'dashed',
    top: THEME.spacing.xl + 5,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 15,
    elevation: 8,
  },
  artworkImage: {
    width: 180,
    height: 180,
    zIndex: 3,
    marginBottom: THEME.spacing.lg,
  },
  imagePlaceholder: {
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: 'rgba(255,255,255,0.03)',
    marginBottom: THEME.spacing.lg,
  },
  titleInfo: {
    alignItems: 'center',
    marginTop: THEME.spacing.sm,
  },
  pokemonId: {
    fontSize: 14,
    fontWeight: '900',
    color: THEME.colors.textSecondary,
    marginBottom: THEME.spacing.xs,
    letterSpacing: 1,
  },
  pokemonName: {
    fontSize: 34,
    fontWeight: '900',
    color: THEME.colors.white,
    letterSpacing: -0.5,
    marginBottom: THEME.spacing.sm,
  },
  badgeRow: {
    flexDirection: 'row',
    marginTop: THEME.spacing.xs,
  },
  typeBadge: {
    paddingHorizontal: 18,
    paddingVertical: 6,
    borderRadius: 14,
    marginHorizontal: THEME.spacing.xs,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  typeBadgeText: {
    fontSize: THEME.typography.sizes.md,
    fontWeight: '900',
    color: THEME.colors.white,
    letterSpacing: 0.2,
  },
  detailsDeck: {
    backgroundColor: 'rgba(30, 41, 59, 0.45)', // Translucent glassmorphism
    borderTopLeftRadius: 36,
    borderTopRightRadius: 36,
    paddingHorizontal: THEME.spacing.xl,
    paddingTop: THEME.spacing.xl,
    paddingBottom: THEME.spacing.xxl,
    marginTop: THEME.spacing.md,
    minHeight: 400,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  descriptionText: {
    fontSize: 15,
    color: '#CBD5E1', // Slate 300
    lineHeight: 24,
    textAlign: 'center',
    marginBottom: THEME.spacing.xl,
    fontWeight: '500',
  },
  metricsContainer: {
    flexDirection: 'row',
    backgroundColor: 'rgba(15, 23, 42, 0.45)',
    borderRadius: 24,
    paddingVertical: THEME.spacing.lg,
    marginBottom: THEME.spacing.xl,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  metricItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  metricHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: THEME.spacing.xs,
  },
  metricIcon: {
    marginRight: 6,
    opacity: 0.85,
  },
  divider: {
    width: 1.5,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    height: '60%',
    alignSelf: 'center',
  },
  metricLabel: {
    fontSize: 10,
    fontWeight: '900',
    color: THEME.colors.textSecondary,
    letterSpacing: 1.5,
  },
  metricValue: {
    fontSize: 20,
    fontWeight: '900',
    color: THEME.colors.white,
    marginTop: 2,
  },
  metricSubvalue: {
    fontSize: 12,
    color: THEME.colors.textSecondary,
    marginTop: 2,
    fontWeight: '600',
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: '900',
    color: THEME.colors.white,
    marginBottom: THEME.spacing.md,
    letterSpacing: -0.2,
  },
  abilitiesWrapper: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: THEME.spacing.xl,
  },
  abilityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderRadius: 16,
    paddingHorizontal: THEME.spacing.md,
    paddingVertical: 7,
    marginRight: THEME.spacing.sm,
    marginBottom: THEME.spacing.sm,
  },
  abilityText: {
    color: THEME.colors.text,
    fontSize: THEME.typography.sizes.md,
    fontWeight: '700',
  },
  hiddenIndicator: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    marginLeft: THEME.spacing.xs,
  },
  hiddenText: {
    color: THEME.colors.white,
    fontSize: 8,
    fontWeight: '900',
  },
  statsHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: THEME.spacing.md,
  },
  totalStatsBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
  },
  totalStatsText: {
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  statsCard: {
    backgroundColor: 'rgba(15, 23, 42, 0.35)',
    borderRadius: 24,
    padding: THEME.spacing.lg,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  statRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: THEME.spacing.sm,
  },
  statNameLabel: {
    width: 48,
    fontSize: 11,
    fontWeight: '900',
    color: THEME.colors.textSecondary,
  },
  statValueLabel: {
    width: 35,
    fontSize: 13,
    fontWeight: '900',
    color: THEME.colors.white,
    textAlign: 'right',
    marginRight: THEME.spacing.md,
  },
  statTrack: {
    flex: 1,
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    borderRadius: 4,
    overflow: 'hidden',
  },
  statFillWrapper: {
    height: '100%',
  },
  statFillGradient: {
    height: '100%',
    width: '100%',
    borderRadius: 4,
  },
  // Skeletons styles
  skeletonTop: {
    alignItems: 'center',
    paddingVertical: THEME.spacing.xl,
    paddingTop: 100,
  },
  skeletonCardDetails: {
    backgroundColor: THEME.colors.cardBackground,
    borderTopLeftRadius: 36,
    borderTopRightRadius: 36,
    paddingHorizontal: THEME.spacing.xl,
    paddingTop: THEME.spacing.xl,
    flex: 1,
    borderTopWidth: 1,
    borderColor: THEME.colors.border,
  },
});
