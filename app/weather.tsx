import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Button,
  ActivityIndicator,
  ScrollView,
  Keyboard,
} from 'react-native';

const API_KEY = 'f22fc8bf246203dc5fea6e0e3bdcc946'; // Твой API ключ

export default function WeatherScreen() {
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  const fetchWeatherByCity = () => {
    if (!city.trim()) {
      setErrorMsg('Моля, въведи град.');
      return;
    }

    setLoading(true);
    setErrorMsg(null);
    setWeather(null);
    Keyboard.dismiss();

    fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
        city.trim()
      )}&units=metric&lang=bg&appid=${API_KEY}`
    )
      .then(res => res.json())
      .then(data => {
        if (data.cod === 200) {
          setWeather(data);
          setErrorMsg(null);
        } else {
          setErrorMsg('Градът не е намерен. Провери изписването.');
        }
      })
      .catch(() => setErrorMsg('Грешка при свързване със сървъра.'))
      .finally(() => setLoading(false));
  };

  return (
    <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
      <TextInput
        placeholder="Въведи град"
        style={styles.input}
        value={city}
        onChangeText={setCity}
        onSubmitEditing={fetchWeatherByCity}
        returnKeyType="search"
        autoCapitalize="words"
      />
      <Button title="Търси" onPress={fetchWeatherByCity} />

      {loading && <ActivityIndicator size="large" color="#fff" style={{ marginTop: 20 }} />}

      {errorMsg && <Text style={styles.error}>{errorMsg}</Text>}

      {weather && (
        <View style={styles.weatherContainer}>
          <Text style={styles.city}>
            {weather.name}, {weather.sys?.country}
          </Text>
          <Text style={styles.temp}>
            {Math.round(weather.main.temp)}°C
          </Text>
          <Text style={styles.desc}>
            {weather.weather[0].description}
          </Text>
          <Text>Влажност: {weather.main.humidity}%</Text>
          <Text>Вятър: {weather.wind.speed} м/с</Text>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#4a90e2',
    padding: 20,
    justifyContent: 'center',
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 10,
    fontSize: 18,
    marginBottom: 12,
  },
  error: {
    color: '#ffdddd',
    marginTop: 15,
    fontSize: 16,
    textAlign: 'center',
  },
  weatherContainer: {
    marginTop: 30,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
  },
  city: {
    fontSize: 28,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 6,
  },
  temp: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#fff',
    marginVertical: 6,
  },
  desc: {
    fontSize: 22,
    fontStyle: 'italic',
    color: '#eee',
    marginBottom: 10,
    textTransform: 'capitalize',
  },
});