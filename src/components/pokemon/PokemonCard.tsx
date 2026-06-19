import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';
import { PokemonListItem } from '../../types/pokemon';
import { THEME } from '../../theme/theme';
import { capitalize, formatPokemonId } from '../../utils/utils';

interface PokemonCardProps {
  pokemon: PokemonListItem;
  onPress: () => void;
}

export const PokemonCard: React.FC<PokemonCardProps> = React.memo(({ pokemon, onPress }) => {
  // Get colors based on primary type
  const primaryType = pokemon.types[0] || 'normal';
  const typeStyle = THEME.typeColors[primaryType] || THEME.typeColors.normal;

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      style={[
        styles.card,
        { backgroundColor: THEME.colors.cardBackground },
        styles.shadow,
      ]}
      onPress={onPress}
    >
      {/* Visual background indicator representing primary element */}
      <View 
        style={[
          styles.typePillBackground, 
          { backgroundColor: typeStyle.bg, opacity: 0.1 }
        ]} 
      />

      <View style={styles.infoContainer}>
        <Text style={styles.idText}>{formatPokemonId(pokemon.id)}</Text>
        <Text style={styles.nameText}>{capitalize(pokemon.name)}</Text>
        
        {/* Type badges */}
        <View style={styles.typesRow}>
          {pokemon.types.map((type) => {
            const badgeColors = THEME.typeColors[type] || THEME.typeColors.normal;
            return (
              <View 
                key={type} 
                style={[styles.typeBadge, { backgroundColor: badgeColors.bg }]}
              >
                <Text style={[styles.typeText, { color: badgeColors.text }]}>
                  {capitalize(type)}
                </Text>
              </View>
            );
          })}
        </View>
      </View>

      <View style={styles.imageContainer}>
        {/* Decorative Pokéball background silhouette */}
        <View style={[styles.pokeballBackground, { borderColor: typeStyle.bg }]} />
        
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
    </TouchableOpacity>
  );
});

PokemonCard.displayName = 'PokemonCard';

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    borderRadius: 20,
    padding: THEME.spacing.lg,
    marginVertical: THEME.spacing.sm,
    marginHorizontal: THEME.spacing.md,
    height: 120,
    alignItems: 'center',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: THEME.colors.border,
  },
  shadow: {
    ...THEME.shadows.medium,
  },
  typePillBackground: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
  infoContainer: {
    flex: 1.2,
    justifyContent: 'center',
    zIndex: 2,
  },
  idText: {
    fontSize: THEME.typography.sizes.sm,
    color: THEME.colors.textSecondary,
    fontWeight: '700',
    marginBottom: THEME.spacing.xs,
  },
  nameText: {
    fontSize: THEME.typography.sizes.xl,
    color: THEME.colors.text,
    fontWeight: 'bold',
    marginBottom: THEME.spacing.sm,
  },
  typesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  typeBadge: {
    paddingHorizontal: THEME.spacing.md,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: THEME.spacing.xs,
    marginBottom: THEME.spacing.xs,
  },
  typeText: {
    fontSize: THEME.typography.sizes.sm,
    fontWeight: '600',
  },
  imageContainer: {
    flex: 0.8,
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    position: 'relative',
  },
  pokeballBackground: {
    position: 'absolute',
    width: 90,
    height: 90,
    borderRadius: 45,
    borderWidth: 10,
    opacity: 0.08,
    right: -10,
    bottom: -15,
  },
  image: {
    width: 100,
    height: 100,
    zIndex: 2,
  },
  imagePlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
});
