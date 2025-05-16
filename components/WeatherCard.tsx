import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface Props {
  city: string;
  temp: number;
  description: string;
}

export default function WeatherCard({ city, temp, description }: Props) {
  return (
    <View style={styles.card}>
      <Text style={styles.city}>{city}</Text>
      <Ionicons name="cloud-outline" size={48} color="#007aff" />
      <Text style={styles.temp}>{temp}°C</Text>
      <Text style={styles.desc}>{description}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#e0f7fa',
    padding: 24,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 5,
  },
  city: { fontSize: 28, fontWeight: 'bold' },
  temp: { fontSize: 40, marginVertical: 10 },
  desc: { fontSize: 20, fontStyle: 'italic' },
});