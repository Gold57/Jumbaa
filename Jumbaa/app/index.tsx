import React, { useEffect, useRef } from 'react';
import { View, Animated, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

export default function SplashScreen() {
  const router = useRouter();
  const leftImageX = useRef(new Animated.Value(-200)).current;
  const rightImageX = useRef(new Animated.Value(200)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(leftImageX, {
        toValue: 0,
        duration: 1500,
        useNativeDriver: true,
      }),
      Animated.timing(rightImageX, {
        toValue: 0,
        duration: 1500,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setTimeout(() => {
        router.replace('/(auth)/login');
      }, 1000);
    });
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.wrapper}>
        <View style={styles.logoContainer}>
          <Animated.Image
            source={require('../assets/images/logo1.jpeg')}
            style={[
              styles.logo1,
              {
                transform: [{ translateX: leftImageX }],
              },
            ]}
          />
          <Animated.Image
            source={require('../assets/images/logo2.jpg')}
            style={[
              styles.logo2,
              {
                transform: [{ translateX: rightImageX }, { translateY: 20 }],
              },
            ]}
          />
        </View>
        <Text style={styles.jumbaaText}>Jumbaa</Text>
        <Text style={styles.taglineText}>Find your dream home</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    justifyContent: 'center',
    alignItems: 'center',
  },
  wrapper: {
    alignItems: 'center',
    marginTop: -120, // Moves the entire group up
  },
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo1: {
    width: 200,
    height: 200,
    resizeMode: 'contain',
  },
  logo2: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
    position: 'absolute',
  },
  jumbaaText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: 'white',
    marginTop: 20,
  },
  taglineText: {
    fontSize: 18,
    fontStyle: 'italic',
    color: '#BBBBBB',
    marginTop: 8,
    letterSpacing: 1,
  },
});
