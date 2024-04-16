import React from 'react';
import { View, Image } from 'react-native';
import { Tabs } from 'expo-router';
import { DonationProvider, useDonationContext } from "../contexts/DonationContext";
import { ListProvider } from "../contexts/ListContext";

export default function TabLayout() {
  const { donations } = useDonationContext();

  return (
    <>
      <DonationProvider>
        <ListProvider donations={donations}>
          <View className='h-full'>
            <Tabs screenOptions={{
              tabBarActiveTintColor: "#00a651",
              tabBarStyle: {
                height: 70,
                padding: 8
              },
              tabBarLabelStyle: {
                fontSize: 12,
                marginBottom: 16,
              },
            }}>
              <Tabs.Screen
                name="index"
                options={{
                  title: 'Home',
                  tabBarIcon: ({ color }) => (
                    <Image source={require("../../../assets/home.png")} style={{ width: 26, height: 26, tintColor: color, objectFit: "contain" }} />
                  ),
                }}
              />

              <Tabs.Screen
                name="donate"
                options={{
                  title: 'Donate',
                  tabBarIcon: ({ color }) => (
                    <Image source={require("../../../assets/donate.png")} style={{ width: 32, height: 30, tintColor: color, objectFit: "contain" }} />
                  ),
                }}
              />

              <Tabs.Screen
                name="list"
                options={{
                  title: 'List',
                  tabBarIcon: ({ color }) => (
                    <Image source={require("../../../assets/list.png")} style={{ width: 26, height: 34, tintColor: color, objectFit: "contain" }} />
                  ),
                }}
              />
            </Tabs>
          </View>
        </ListProvider>
      </DonationProvider>
    </>
  );
}