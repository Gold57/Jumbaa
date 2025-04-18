import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';
import { HapticTab } from '@/components/HapticTab';
import { IconSymbol } from '@/components/ui/IconSymbol';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Ionicons } from '@expo/vector-icons';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: isDark ? '#4FC3F7' : '#1976D2',
        tabBarInactiveTintColor: isDark ? '#aaa' : '#666',
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: {
          position: 'absolute',
          bottom: 16,
          left: 16,
          right: 16,
          height: 80,
          borderRadius: 30,
          backgroundColor: isDark ? '#1e1e1e' : '#ffffff',
          elevation: 10,
          paddingBottom: Platform.OS === 'ios' ? 20 : 10,
          paddingTop: 10,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 6 },
          shadowOpacity: 0.1,
          shadowRadius: 8,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
          paddingBottom: 4,
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => (
            <IconSymbol size={24} name="house.fill" color={color} />
          ),
        }}
      />
      {/* <Tabs.Screen
        name="addhouse"
        options={{
          title: 'Add House',
          tabBarIcon: ({ color }) => (
            <IconSymbol size={24} name="house.fill" color={color} />
          ),
        }}
      /> */}
      <Tabs.Screen
  name="favorites"
  options={{
    title: "Favorites",
    tabBarIcon: ({ color, focused }) => (
      <Ionicons
        name={focused ? "heart" : "heart-outline"}
        size={24}
        color={color}
      />
    ),
  }}
/>
    </Tabs>
  );
}
