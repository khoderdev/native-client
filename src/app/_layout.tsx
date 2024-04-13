import React, { useState } from 'react';

import FontAwesome from '@expo/vector-icons/FontAwesome';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import AppManifest from 'expo-constants';
import { useColorScheme } from '../components/useColorScheme';
import  {DonationProvider}  from './contexts/DonationContext';
import '../global.css'
import { Provider as PaperProvider } from 'react-native-paper';
// import { AutocompleteDropdownContextProvider } from 'react-native-autocomplete-dropdown';


export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: '(tabs)',
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    // RobotoCondensed: require('../assets/fonts/RobotoCondensed-Medium.ttf'),
    ...FontAwesome.font,
  });

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    // Wrap RootLayoutNav with DonationProvider
    <PaperProvider>
      {/* <AutocompleteDropdownContextProvider> */}
        <DonationProvider>
          <RootLayoutNav />
        </DonationProvider>
      {/* </AutocompleteDropdownContextProvider> */}
    </PaperProvider>

  );
}

function RootLayoutNav() {
  const colorScheme = useColorScheme();
  const appName = AppManifest.name; // Access the app's name from AppManifest

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen
          name="(tabs)"
          options={{
            headerShown: false,
            title: appName, // Set the status bar name dynamically
          }}
        />
        {/* <Stack.Screen name="modal" options={{ presentation: 'modal' }} /> */}
      </Stack>
    </ThemeProvider>
  );
}