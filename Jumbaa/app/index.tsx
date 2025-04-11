import React, { useEffect, useRef } from 'react';
import { View, Animated, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

export default function SplashScreen() {
  const router = useRouter();
  const leftImageX = useRef(new Animated.Value(-200)).current;
  const rightImageX = useRef(new Animated.Value(200)).current;
  const textOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Slide in logos first
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
      // Then fade in the text
      Animated.timing(textOpacity, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }).start();

      // Navigate after 1 second
      setTimeout(() => {
        router.replace('/(auth)/login');
      }, 1500);
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

        {/* Animated Text Appearance */}
        <Animated.View style={[styles.textContainer, { opacity: textOpacity }]}>
           <Text style={styles.jumbaaText}>Jumbaa</Text>
            <Text style={styles.taglineText}>Find your dream home</Text>
        </Animated.View>
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
  textContainer: {
    alignItems: 'center',
    justifyContent: 'center',
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
