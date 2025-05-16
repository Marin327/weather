import React, { useEffect, useRef } from 'react';
import { StyleSheet, Text, View, Animated, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

export const unstable_settings = {
  title: 'Страница не е намерена',
};

export default function NotFoundScreen() {
  const router = useRouter();
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1500,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <Text style={styles.title}>😕 Страницата не е намерена!</Text>
      <Text style={styles.subtitle}>
        Изглежда, че този адрес е в празна зона. Но няма страшно.
      </Text>
      <TouchableOpacity style={styles.button} onPress={() => router.push('/')}>
        <Text style={styles.buttonText}>Върни ме у дома</Text>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#20232a',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#61dafb',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: '#abb2bf',
    textAlign: 'center',
    marginBottom: 25,
  },
  button: {
    backgroundColor: '#61dafb',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 8,
  },
  buttonText: {
    color: '#20232a',
    fontWeight: '600',
    fontSize: 16,
  },
});