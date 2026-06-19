export const capitalize = (str: string): string => {
  if (!str) return '';
  return str
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

export const formatPokemonId = (id: number): string => {
  if (!id) return '#000';
  return `#${String(id).padStart(3, '0')}`;
};

export const convertHeight = (decimeters: number): { meters: string; imperial: string } => {
  const meters = (decimeters / 10).toFixed(1);
  const totalInches = (decimeters * 10) / 2.54;
  const feet = Math.floor(totalInches / 12);
  const inches = Math.round(totalInches % 12);
  return {
    meters: `${meters} m`,
    imperial: `${feet}'${inches}"`,
  };
};

export const convertWeight = (hectograms: number): { kilograms: string; pounds: string } => {
  const kgNum = hectograms / 10;
  const lbNum = kgNum * 2.20462;
  return {
    kilograms: `${kgNum.toFixed(1)} kg`,
    pounds: `${lbNum.toFixed(1)} lbs`,
  };
};

// Safe parse integer from URL (e.g., https://pokeapi.co/api/v2/pokemon/25/ -> 25)
export const extractIdFromUrl = (url: string): number => {
  const parts = url.replace(/\/$/, '').split('/');
  const idStr = parts[parts.length - 1];
  const id = parseInt(idStr, 10);
  return isNaN(id) ? 0 : id;
};
