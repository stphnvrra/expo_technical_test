# Expo Technical Test

A React Native mobile application built with Expo and TypeScript to browse and search Pokémon.

## Selected API
We are using the free public **PokéAPI** (https://pokeapi.co/).
* This API is public and **does not require an API key**.
* All endpoints are accessed via `https://pokeapi.co/api/v2/`.

---

## Getting Started

### Prerequisites
Make sure you have Node.js installed on your machine.

### Installation
Clone or navigate to the project directory and install the packages:
```bash
npm install
```

To install the specific dependency stack used:
```bash
npm install @react-navigation/native @react-navigation/native-stack react-native-screens react-native-safe-area-context zustand axios react-native-reanimated lucide-react-native expo-linear-gradient react-native-worklets
```

### Running the App
Start the Metro packager:
```bash
npx expo start
```

* To run on **iOS**: Press `i` to launch the iOS Simulator (macOS and Xcode required).
* To run on **Android**: Press `a` to launch the Android Emulator (Android Studio required).

Alternatively, you can run directly using:
```bash
# Run on iOS simulator
npx expo run:ios

# Run on Android emulator
npx expo run:android
```

---

## Folder Structure

* `src/api` - Axios client setup and API fetching logic.
* `src/components` - Reusable UI widgets (cards, skeletons, and feedback states).
* `src/hooks` - Custom hooks for listing and detail screens.
* `src/navigation` - Type-safe routing definition.
* `src/screens` - Main user screens (Home & Details).
* `src/store` - Zustand store for global application state.
* `src/theme` - Application-wide color definitions, typography, and styling tokens.
* `src/types` - Strict TypeScript type definitions for Pokémon objects.
* `src/utils` - Conversions (metric to imperial) and formatting helpers.
