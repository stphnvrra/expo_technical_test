export const THEME = {
  colors: {
    background: '#0F172A', // Sleek dark slate
    cardBackground: '#1E293B', // Premium dark card background
    cardBackgroundGlass: 'rgba(30, 41, 59, 0.75)', // Glassmorphic card
    text: '#F8FAFC', // Slate-50 main text
    textSecondary: '#94A3B8', // Slate-400 secondary text
    primary: '#EF4444', // Pokeball Red
    accent: '#3B82F6', // Poké Blue
    border: '#334155', // Slate-700 border
    shadow: '#000000',
    white: '#FFFFFF',
    overlay: 'rgba(15, 23, 42, 0.5)',
  },
  
  // Custom HSL/HEX colors for each Pokémon type
  typeColors: {
    normal: { bg: '#A8A77A', text: '#FFFFFF', lightBg: 'rgba(168, 167, 122, 0.2)' },
    fire: { bg: '#EE8130', text: '#FFFFFF', lightBg: 'rgba(238, 129, 48, 0.2)' },
    water: { bg: '#6390F0', text: '#FFFFFF', lightBg: 'rgba(99, 144, 240, 0.2)' },
    electric: { bg: '#F7D02C', text: '#000000', lightBg: 'rgba(247, 208, 44, 0.25)' },
    grass: { bg: '#7AC74C', text: '#FFFFFF', lightBg: 'rgba(122, 199, 76, 0.2)' },
    ice: { bg: '#96D9D6', text: '#000000', lightBg: 'rgba(150, 217, 214, 0.25)' },
    fighting: { bg: '#C22E28', text: '#FFFFFF', lightBg: 'rgba(194, 46, 40, 0.2)' },
    poison: { bg: '#A33EA1', text: '#FFFFFF', lightBg: 'rgba(163, 62, 161, 0.2)' },
    ground: { bg: '#E2BF65', text: '#000000', lightBg: 'rgba(226, 191, 101, 0.25)' },
    flying: { bg: '#A98FF3', text: '#FFFFFF', lightBg: 'rgba(169, 143, 243, 0.2)' },
    psychic: { bg: '#F95587', text: '#FFFFFF', lightBg: 'rgba(249, 85, 135, 0.2)' },
    bug: { bg: '#A6B91A', text: '#FFFFFF', lightBg: 'rgba(166, 185, 26, 0.2)' },
    rock: { bg: '#B6A136', text: '#FFFFFF', lightBg: 'rgba(182, 161, 54, 0.2)' },
    ghost: { bg: '#705746', text: '#FFFFFF', lightBg: 'rgba(112, 87, 70, 0.2)' },
    dragon: { bg: '#6F35FC', text: '#FFFFFF', lightBg: 'rgba(111, 53, 252, 0.2)' },
    steel: { bg: '#B7B7CE', text: '#000000', lightBg: 'rgba(183, 183, 206, 0.25)' },
    fairy: { bg: '#D685AD', text: '#FFFFFF', lightBg: 'rgba(214, 133, 173, 0.2)' },
    dark: { bg: '#705746', text: '#FFFFFF', lightBg: 'rgba(112, 87, 70, 0.2)' },
    shadow: { bg: '#334155', text: '#FFFFFF', lightBg: 'rgba(51, 65, 85, 0.2)' },
    unknown: { bg: '#64748B', text: '#FFFFFF', lightBg: 'rgba(100, 116, 139, 0.2)' },
  } as Record<string, { bg: string; text: string; lightBg: string }>,

  spacing: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
    xxl: 32,
  },

  typography: {
    fontFamilies: {
      regular: 'System',
      bold: 'System',
    },
    sizes: {
      xs: 10,
      sm: 12,
      md: 14,
      lg: 16,
      xl: 18,
      xxl: 24,
      title: 32,
    },
  },

  shadows: {
    light: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    },
    medium: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.2,
      shadowRadius: 8,
      elevation: 4,
    },
    glowing: (color: string) => ({
      shadowColor: color,
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.4,
      shadowRadius: 12,
      elevation: 6,
    }),
  },
};
