import React from 'react';
import { View, ActivityIndicator, Text, StyleSheet } from 'react-native';

interface Props {
  message?: string;
}

export default function LoadingSpinner({ message = 'Зареждане...' }: Props) {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#007aff" />
      <Text style={styles.text}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  text: { marginTop: 12, fontSize: 16, color: '#007aff' },
});
