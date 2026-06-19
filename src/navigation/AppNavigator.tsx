import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { HomeScreen } from '../screens/HomeScreen';
import { PokemonDetailScreen } from '../screens/PokemonDetailScreen';
import { THEME } from '../theme/theme';
import { capitalize } from '../utils/utils';

export type RootStackParamList = {
  Home: undefined;
  PokemonDetail: { idOrName: string | number; name: string };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export const AppNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerStyle: {
          backgroundColor: THEME.colors.background,
        },
        headerShadowVisible: false,
        headerTintColor: THEME.colors.text,
        headerTitleStyle: {
          fontWeight: 'bold',
          fontSize: THEME.typography.sizes.xl,
        },
        contentStyle: {
          backgroundColor: THEME.colors.background,
        },
      }}
    >
      <Stack.Screen 
        name="Home" 
        component={HomeScreen} 
        options={{
          headerTitle: 'Pokédex Explorer',
        }}
      />
      <Stack.Screen 
        name="PokemonDetail" 
        component={PokemonDetailScreen} 
        options={({ route }) => ({
          headerTitle: capitalize(route.params.name),
          headerBackTitleVisible: false,
        })}
      />
    </Stack.Navigator>
  );
};
