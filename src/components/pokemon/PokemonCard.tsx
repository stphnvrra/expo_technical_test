import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { PokemonListItem } from '../../types/pokemon';
import { THEME } from '../../theme/theme';
import { capitalize, formatPokemonId } from '../../utils/utils';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 40) / 2; // Two columns with margins

interface PokemonCardProps {
  pokemon: PokemonListItem;
  onPress: () => void;
}

export const PokemonCard: React.FC<PokemonCardProps> = React.memo(({ pokemon, onPress }) => {
  // Get colors based on primary type
  const primaryType = pokemon.types[0] || 'normal';
  const typeStyle = THEME.typeColors[primaryType] || THEME.typeColors.normal;
  
  // Create a custom gradient: type color to a slightly darker or blended hue
  const gradientColors = typeStyle.gradient || [typeStyle.bg, THEME.colors.cardBackground];

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      style={styles.touchable}
      onPress={onPress}
    >
      <LinearGradient
        colors={gradientColors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[
          styles.card,
          {
            shadowColor: typeStyle.bg,
          }
        ]}
      >
        {/* Glassmorphism Overlay */}
        <View style={styles.glassOverlay} />

        {/* Decorative Pokéball background silhouette */}
        <View style={styles.pokeballWrapper}>
          <View style={[styles.pokeballRing, { borderColor: 'rgba(255, 255, 255, 0.08)' }]} />
          <View style={[styles.pokeballLine, { backgroundColor: 'rgba(255, 255, 255, 0.08)' }]} />
        </View>

        {/* Header Row: ID */}
        <View style={styles.headerRow}>
          <View style={styles.idBadge}>
            <Text style={styles.idText}>{formatPokemonId(pokemon.id)}</Text>
          </View>
        </View>

        {/* Image / Artwork Section (Floating) */}
        <View style={styles.imageContainer}>
          {pokemon.imageUrl ? (
            <Image
              source={{ uri: pokemon.imageUrl }}
              style={styles.image}
              resizeMode="contain"
            />
          ) : (
            <View style={styles.imagePlaceholder} />
          )}
        </View>

        {/* Info Footer */}
        <View style={styles.infoFooter}>
          <Text style={styles.nameText} numberOfLines={1}>
            {capitalize(pokemon.name)}
          </Text>
          
          {/* Compact type badges */}
          <View style={styles.typesRow}>
            {pokemon.types.slice(0, 2).map((type) => {
              return (
                <View 
                  key={type} 
                  style={[styles.typeBadge, { backgroundColor: 'rgba(255, 255, 255, 0.15)' }]}
                >
                  <Text style={styles.typeText}>
                    {capitalize(type)}
                  </Text>
                </View>
              );
            })}
          </View>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
});

PokemonCard.displayName = 'PokemonCard';

const styles = StyleSheet.create({
  touchable: {
    width: CARD_WIDTH,
    marginHorizontal: 8,
    marginVertical: 10,
  },
  card: {
    height: 175,
    borderRadius: 24,
    padding: THEME.spacing.md,
    justifyContent: 'space-between',
    position: 'relative',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 6,
  },
  glassOverlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(15, 23, 42, 0.25)',
  },
  pokeballWrapper: {
    position: 'absolute',
    right: -25,
    bottom: -25,
    width: 130,
    height: 130,
    opacity: 0.6,
    pointerEvents: 'none',
  },
  pokeballRing: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 12,
  },
  pokeballLine: {
    position: 'absolute',
    left: -20,
    top: 54,
    width: 160,
    height: 12,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    zIndex: 3,
  },
  idBadge: {
    backgroundColor: 'rgba(15, 23, 42, 0.4)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    borderWidth: 0.5,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  idText: {
    fontSize: 10,
    color: '#E2E8F0',
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  imageContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    top: 25,
    right: 12,
    left: 12,
    height: 90,
    zIndex: 4,
  },
  image: {
    width: 92,
    height: 92,
  },
  imagePlaceholder: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  infoFooter: {
    zIndex: 3,
    marginTop: 85, // Push name below the image center
  },
  nameText: {
    fontSize: 16,
    color: THEME.colors.white,
    fontWeight: '800',
    letterSpacing: 0.2,
    marginBottom: THEME.spacing.xs,
    textShadowColor: 'rgba(0, 0, 0, 0.25)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  typesRow: {
    flexDirection: 'row',
  },
  typeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    marginRight: 4,
  },
  typeText: {
    fontSize: 9,
    color: THEME.colors.white,
    fontWeight: '800',
    letterSpacing: 0.2,
  },
});
