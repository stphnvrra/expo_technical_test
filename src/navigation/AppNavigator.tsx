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
        headerTransparent: true,
        headerShadowVisible: false,
        headerTintColor: THEME.colors.text,
        headerTitleStyle: {
          fontWeight: '900',
          fontSize: THEME.typography.sizes.xxl,
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
          headerShown: false,
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
