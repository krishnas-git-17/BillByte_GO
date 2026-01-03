import { View, Text, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { useAuth } from '@/src/context/AuthContext';

export default function LoginScreen() {
  const { login } = useAuth();
  const router = useRouter();

const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const onLogin = async () => {
  if (!username || !password) {
    setError('Employee ID / Email and password required');
    return;
  }

  try {
    setLoading(true);
    setError('');

    await login(username, password);
    router.replace('/(tabs)/dashboard');

  } catch {
    setError('Invalid credentials');
  } finally {
    setLoading(false);
  }
};


  return (
    <View style={{ flex: 1, justifyContent: 'center', padding: 24 }}>
      <Text style={{ fontSize: 26, fontWeight: '700', marginBottom: 20 }}>
        Bill Byte Go
      </Text>

      {error ? <Text style={{ color: 'red' }}>{error}</Text> : null}

      <TextInput
  placeholder="Employee ID or Email"
  value={username}
  onChangeText={setUsername}
  autoCapitalize="none"
  style={{ borderWidth: 1, padding: 12, marginTop: 10 }}
/>


      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={{ borderWidth: 1, padding: 12, marginTop: 10 }}
      />

      <TouchableOpacity
        onPress={onLogin}
        style={{ backgroundColor: '#16a34a', padding: 14, marginTop: 20 }}
      >
        {loading
          ? <ActivityIndicator color="#fff" />
          : <Text style={{ color: '#fff', textAlign: 'center' }}>LOGIN</Text>}
      </TouchableOpacity>
    </View>
  );
}