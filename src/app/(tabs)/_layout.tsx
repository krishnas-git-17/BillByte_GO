import { Tabs } from 'expo-router';

export default function TabsLayout() {
  return (
    <Tabs screenOptions={{ headerShown: false }}>
      {/* ✅ MAIN TAB */}
      <Tabs.Screen
        name="dashboard"
        options={{ title: 'Dashboard' }}
      />

      {/* ❌ NOT A TAB (navigation only) */}
      <Tabs.Screen
        name="orders"
        options={{ href: null }}
      />
    </Tabs>
  );
}
