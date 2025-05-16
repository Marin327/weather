import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

export default function HomeScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Времето на живо</Text>
      <Text style={styles.subtitle}>
        Проверете времето в своя град или където пожелаете.
      </Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push('/weather')}
        activeOpacity={0.7}
      >
        <Text style={styles.buttonText}>Виж времето</Text>
      </TouchableOpacity>

      {/* Можеш да добавиш още бутони тук за други екрани, ако искаш */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#4a90e2',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    color: '#dbe9ff',
    marginBottom: 40,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#fff',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 6,
  },
  buttonText: {
    color: '#4a90e2',
    fontWeight: '600',
    fontSize: 18,
  },
});