import React from "react";
import { Stack } from "expo-router";

import TabOneScreen from "./screens/TabOneScreen";
import DonateScreen from "./screens/DonateScreen";
import ListScreen from "./screens/ListScreen";

export default function AppNavigator() {
  return (
    <Stack>
      {/* <Stack.Screen
        name="index"
        component={TabOneScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="donate"
        component={DonateScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="list"
        component={ListScreen}
        options={{ headerShown: false }}
      /> */}
    </Stack>
  );
}
