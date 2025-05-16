import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Button,
  ScrollView,
  Keyboard,
  ActivityIndicator,
  TouchableOpacity,
  useColorScheme,
} from 'react-native';
import * as Location from 'expo-location';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_KEY = '42b0b6815c929b25ec8f17e79612cab0';

export default function WeatherScreen() {
  const [location, setLocation] = useState(null);
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isDarkTheme, setIsDarkTheme] = useState(false);

  const colorScheme = useColorScheme();

  // Зареждане последния град от AsyncStorage
  useEffect(() => {
    (async () => {
      const lastCity = await AsyncStorage.getItem('lastCity');
      if (lastCity) setCity(lastCity);
    })();
  }, []);

  // Вземане на локация при стартиране (ако няма град)
  useEffect(() => {
    if (city.trim()) return;
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Нямаш достъп до локация.');
        return;
      }
      const loc = await Location.getCurrentPositionAsync({});
      setLocation(loc.coords);
    })();
  }, [city]);

  useEffect(() => {
    if (location) fetchWeatherByCoords();
  }, [location]);

  useEffect(() => {
    if (city.trim()) fetchWeatherByCity();
  }, []);

  const fetchWeatherByCoords = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${location.latitude}&lon=${location.longitude}&units=metric&lang=bg&appid=${API_KEY}`
      );
      const data = await res.json();
      if (data.cod === 200) {
        setWeather(data);
        setCity(data.name);
        await AsyncStorage.setItem('lastCity', data.name);
        setErrorMsg(null);
      } else {
        setErrorMsg('Не можем да намерим времето за твоята локация.');
      }
    } catch {
      setErrorMsg('Грешка при зареждане на времето.');
    } finally {
      setLoading(false);
    }
  };

  const fetchWeatherByCity = async () => {
    if (!city.trim()) {
      setErrorMsg('Моля, въведи град.');
      return;
    }
    setLoading(true);
    setErrorMsg(null);
    setWeather(null);
    Keyboard.dismiss();

    try {
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
          city.trim()
        )}&units=metric&lang=bg&appid=${API_KEY}`
      );
      const data = await res.json();
      if (data.cod === 200) {
        setWeather(data);
        await AsyncStorage.setItem('lastCity', city.trim());
        setErrorMsg(null);
      } else {
        setErrorMsg('Градът не е намерен. Провери изписването.');
      }
    } catch {
      setErrorMsg('Грешка при свързване със сървъра.');
    } finally {
      setLoading(false);
    }
  };

  // Автоматична смяна на тема спрямо device или бутон
  useEffect(() => {
    setIsDarkTheme(colorScheme === 'dark');
  }, [colorScheme]);

  const toggleTheme = () => {
    setIsDarkTheme(!isDarkTheme);
  };

  // Определяне на фон според ден/нощ
  const isDay =
    weather &&
    weather.sys &&
    weather.dt &&
    weather.sys.sunrise < weather.dt &&
    weather.dt < weather.sys.sunset;

  return (
    <ScrollView
      contentContainerStyle={[
        styles.container,
        isDarkTheme ? styles.darkContainer : styles.lightContainer,
      ]}
      keyboardShouldPersistTaps="handled"
    >
      <TextInput
        placeholder="Въведи град"
        placeholderTextColor={isDarkTheme ? '#aaa' : '#555'}
        style={[styles.input, isDarkTheme ? styles.inputDark : styles.inputLight]}
        value={city}
        onChangeText={setCity}
        onSubmitEditing={fetchWeatherByCity}
        returnKeyType="search"
        autoCapitalize="words"
      />
      <Button title="Търси" onPress={fetchWeatherByCity} color={isDarkTheme ? '#f0a500' : '#007aff'} />

      <TouchableOpacity onPress={toggleTheme} style={styles.themeButton}>
        <Text style={{ color: isDarkTheme ? '#f0a500' : '#007aff' }}>
          Смени тема: {isDarkTheme ? 'Тъмна' : 'Светла'}
        </Text>
      </TouchableOpacity>

      {loading && <ActivityIndicator size="large" color={isDarkTheme ? '#f0a500' : '#007aff'} style={{ marginTop: 20 }} />}

      {errorMsg && <Text style={[styles.error, isDarkTheme && styles.errorDark]}>{errorMsg}</Text>}

      {weather && (
        <View style={styles.weatherContainer}>
          <Text style={[styles.city, isDarkTheme && styles.cityDark]}>
            {weather.name}, {weather.sys?.country}
          </Text>
          <Text style={[styles.temp, isDarkTheme && styles.tempDark]}>
            {Math.round(weather.main.temp)}°C
          </Text>
          <Text style={[styles.desc, isDarkTheme && styles.descDark]}>
            {weather.weather[0].description}
          </Text>

          <View style={styles.details}>
            <Text style={isDarkTheme && styles.textDark}>Влажност: {weather.main.humidity}%</Text>
            <Text style={isDarkTheme && styles.textDark}>Вятър: {weather.wind.speed} м/с</Text>
            <Text style={isDarkTheme && styles.textDark}>
              Видимост: {weather.visibility / 1000} км
            </Text>
            <Text style={isDarkTheme && styles.textDark}>
              Изгрев: {new Date(weather.sys.sunrise * 1000).toLocaleTimeString('bg-BG')}
            </Text>
            <Text style={isDarkTheme && styles.textDark}>
              Залез: {new Date(weather.sys.sunset * 1000).toLocaleTimeString('bg-BG')}
            </Text>
          </View>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    paddingTop: 50,
    alignItems: 'center',
  },
  lightContainer: {
    backgroundColor: '#cce7ff',
  },
  darkContainer: {
    backgroundColor: '#222831',
  },
  input: {
    width: '100%',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 10,
    fontSize: 18,
    marginBottom: 12,
    borderWidth: 1,
  },
  inputLight: {
    borderColor: '#007aff',
    color: '#000',
  },
  inputDark: {
    borderColor: '#f0a500',
    color: '#fff',
  },
  error: {
    marginTop: 15,
    fontSize: 16,
    color: 'red',
  },
  errorDark: {
    color: '#ff8c00',
  },
  weatherContainer: {
    marginTop: 30,
    alignItems: 'center',
  },
  city: {
    fontSize: 32,
    fontWeight: '700',
    color: '#004085',
  },
  cityDark: {
    color: '#f0a500',
  },
  temp: {
    fontSize: 48,
    fontWeight: '600',
    marginVertical: 10,
    color: '#003366',
  },
  tempDark: {
    color: '#ffd369',
  },
  desc: {
    fontSize: 22,
    fontStyle: 'italic',
    marginBottom: 10,
    textTransform: 'capitalize',
    color: '#002752',
  },
  descDark: {
    color: '#f0c75e',
  },
  details: {
    marginTop: 10,
  },
  textDark: {
    color: '#e0c979',
    fontSize: 16,
    marginBottom: 4,
  },
  themeButton: {
    marginTop: 15,
    marginBottom: 10,
  },
});
