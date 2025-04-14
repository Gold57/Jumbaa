import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity, Image, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '@/firebase/config';

export default function SignupScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSignup = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Save extra user data to Firestore, including the default userType 'tenant'
      await setDoc(doc(db, "users", user.uid), {
        firstName,
        lastName,
        email,
        userType: 'tenant',  // Default userType as 'tenant'
        createdAt: new Date(),
      });

      router.replace('/(tabs)/home');
    } catch (error: any) {
      // Enhanced error handling
      let errorMessage = 'Signup Failed';
      switch (error.code) {
        case 'auth/invalid-email':
          errorMessage = 'The email address is badly formatted.';
          break;
        case 'auth/email-already-in-use':
          errorMessage = 'The email address is already in use by another account.';
          break;
        case 'auth/weak-password':
          errorMessage = 'The password is too weak. It should be at least 6 characters.';
          break;
        
        default:
          errorMessage = error.message;
      }
      Alert.alert("Signup Failed", errorMessage);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image source={require('../../assets/images/logi.jpeg')} style={styles.logo} />
        <Text style={styles.headerText}>Jumbaa</Text>
      </View>
      <Text style={styles.subTitle}>Create an account with us!</Text>
      <TextInput placeholder="First Name" value={firstName} onChangeText={setFirstName} style={styles.input} />
      <TextInput placeholder="Last Name" value={lastName} onChangeText={setLastName} style={styles.input} />
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

      <Button title="Sign Up" onPress={handleSignup} />
      <Text style={styles.link} onPress={() => router.push('/(auth)/login')}>
        Already have an account? Log in
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
