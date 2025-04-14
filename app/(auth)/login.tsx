import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity, Image, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/firebase/config';

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.replace('/(tabs)/home');
    } catch (error: any) {
      Alert.alert("Login Failed", error.message);
    }
  };


  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image source={require('../../assets/images/logi.jpeg')} style={styles.logo} />
        <Text style={styles.headerText}>Jumbaa</Text>
        
      </View>
      <Text style={styles.subTitle}>Welcome Back</Text>
      <TextInput placeholder="Email" value={email} onChangeText={setEmail} style={styles.input} />

      <View style={styles.passwordInputContainer}>
        <TextInput
          placeholder="Password"
          secureTextEntry={!showPassword}
          value={password}
          onChangeText={setPassword}
          style={styles.input}
        />
        <TouchableOpacity style={styles.passwordToggle} onPress={() => setShowPassword(!showPassword)}>
          <Text style={styles.showHideText}>{showPassword ? 'Hide' : 'Show'}</Text>
        </TouchableOpacity>
      </View>

      <Button title="Login" onPress={handleLogin} />
      <Text style={styles.link} onPress={() => router.push('/(auth)/signup')}>
        Don’t have an account? Sign up
      </Text>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#121212',
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  logo: {
    width: 200,
    height: 150,
    marginBottom: 10,
  },
  headerText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
  },
  subTitle: {
    fontSize: 18,
    fontWeight: '500',
    color: 'white',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderColor: '#555',
    backgroundColor: '#1e1e1e',
    color: 'white',
    borderWidth: 1,
    marginBottom: 15,
    padding: 10,
    borderRadius: 6,
  },
  passwordInputContainer: {
    position: 'relative',
  },
  passwordToggle: {
    position: 'absolute',
    right: 10,
    top: 10,
  },
  showHideText: {
    color: '#90caf9',
  },
  link: {
    marginTop: 15,
    color: '#90caf9',
    textAlign: 'center',
  },
});
