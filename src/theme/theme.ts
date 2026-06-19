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
    normal: { bg: '#A8A77A', text: '#FFFFFF', lightBg: 'rgba(168, 167, 122, 0.2)', gradient: ['#A8A77A', '#C6C5A9'] },
    fire: { bg: '#EE8130', text: '#FFFFFF', lightBg: 'rgba(238, 129, 48, 0.2)', gradient: ['#FF5E3A', '#FF2A68'] },
    water: { bg: '#6390F0', text: '#FFFFFF', lightBg: 'rgba(99, 144, 240, 0.2)', gradient: ['#00B4DB', '#0083B0'] },
    electric: { bg: '#F7D02C', text: '#000000', lightBg: 'rgba(247, 208, 44, 0.25)', gradient: ['#FFD200', '#F7971E'] },
    grass: { bg: '#7AC74C', text: '#FFFFFF', lightBg: 'rgba(122, 199, 76, 0.2)', gradient: ['#11998e', '#38ef7d'] },
    ice: { bg: '#96D9D6', text: '#000000', lightBg: 'rgba(150, 217, 214, 0.25)', gradient: ['#4CA1AF', '#C4E0E5'] },
    fighting: { bg: '#C22E28', text: '#FFFFFF', lightBg: 'rgba(194, 46, 40, 0.2)', gradient: ['#f857a6', '#ff5858'] },
    poison: { bg: '#A33EA1', text: '#FFFFFF', lightBg: 'rgba(163, 62, 161, 0.2)', gradient: ['#B721FF', '#21D4FD'] },
    ground: { bg: '#E2BF65', text: '#000000', lightBg: 'rgba(226, 191, 101, 0.25)', gradient: ['#E65C00', '#F9D423'] },
    flying: { bg: '#A98FF3', text: '#FFFFFF', lightBg: 'rgba(169, 143, 243, 0.2)', gradient: ['#6A11CB', '#2575FC'] },
    psychic: { bg: '#F95587', text: '#FFFFFF', lightBg: 'rgba(249, 85, 135, 0.2)', gradient: ['#f107a3', '#7b2ff7'] },
    bug: { bg: '#A6B91A', text: '#FFFFFF', lightBg: 'rgba(166, 185, 26, 0.2)', gradient: ['#A8FF78', '#78ffd6'] },
    rock: { bg: '#B6A136', text: '#FFFFFF', lightBg: 'rgba(182, 161, 54, 0.2)', gradient: ['#8E9EAB', '#eef2f3'] },
    ghost: { bg: '#705746', text: '#FFFFFF', lightBg: 'rgba(112, 87, 70, 0.2)', gradient: ['#4A00E0', '#8E2DE2'] },
    dragon: { bg: '#6F35FC', text: '#FFFFFF', lightBg: 'rgba(111, 53, 252, 0.2)', gradient: ['#1A2980', '#26D0CE'] },
    steel: { bg: '#B7B7CE', text: '#000000', lightBg: 'rgba(183, 183, 206, 0.25)', gradient: ['#ADA996', '#F2F2F2'] },
    fairy: { bg: '#D685AD', text: '#FFFFFF', lightBg: 'rgba(214, 133, 173, 0.2)', gradient: ['#ffc3a0', '#ffafbd'] },
    dark: { bg: '#705746', text: '#FFFFFF', lightBg: 'rgba(112, 87, 70, 0.2)', gradient: ['#232526', '#414345'] },
    shadow: { bg: '#334155', text: '#FFFFFF', lightBg: 'rgba(51, 65, 85, 0.2)', gradient: ['#141E30', '#243B55'] },
    unknown: { bg: '#64748B', text: '#FFFFFF', lightBg: 'rgba(100, 116, 139, 0.2)', gradient: ['#606c88', '#3f4c6b'] },
  } as Record<string, { bg: string; text: string; lightBg: string; gradient: [string, string] }>,

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
