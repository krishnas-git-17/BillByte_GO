import { Redirect } from 'expo-router';
import { useAuth } from '@/src/context/AuthContext';

export default function Index() {
  const { isLoggedIn } = useAuth();

  if (isLoggedIn) {
    return <Redirect href="/(tabs)/dashboard" />;
  }

  return <Redirect href="/login" />;
}
