import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  TextInput,
  TouchableOpacity,
  Switch,
  useColorScheme,
  Keyboard,
} from 'react-native';
import * as Location from 'expo-location';

const API_KEY = '42b0b6815c929b25ec8f17e79612cab0'; // Твой API ключ

const weatherIcons = {
  Clear: '☀️',
  Clouds: '☁️',
  Rain: '🌧️',
  Snow: '❄️',
  Thunderstorm: '⛈️',
  Drizzle: '🌦️',
  Mist: '🌫️',
  Default: '❓',
};

function getIcon(main) {
  return weatherIcons[main] || weatherIcons.Default;
}

export default function Weather() {
  const scheme = useColorScheme();
  const [location, setLocation] = useState(null);
  const [city, setCity] = useState('');
  const [weatherNow, setWeatherNow] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isCelsius, setIsCelsius] = useState(true);

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Нямаш достъп до локация');
        return;
      }
      const loc = await Location.getCurrentPositionAsync({});
      setLocation(loc.coords);
    })();
  }, []);

  const fetchWeather = useCallback(async () => {
    if (!city && !location) return;

    setLoading(true);
    setErrorMsg('');

    try {
      let baseUrlNow = '';
      let baseUrlForecast = '';
      if (city) {
        baseUrlNow = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${API_KEY}`;
        baseUrlForecast = `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(city)}&appid=${API_KEY}`;
      } else if (location) {
        baseUrlNow = `https://api.openweathermap.org/data/2.5/weather?lat=${location.latitude}&lon=${location.longitude}&appid=${API_KEY}`;
        baseUrlForecast = `https://api.openweathermap.org/data/2.5/forecast?lat=${location.latitude}&lon=${location.longitude}&appid=${API_KEY}`;
      }

      const units = isCelsius ? 'metric' : 'imperial';

      const resNow = await fetch(baseUrlNow + `&units=${units}&lang=bg`);
      const dataNow = await resNow.json();
      if (dataNow.cod !== 200) {
        setErrorMsg('Градът не е намерен или има проблем с API.');
        setLoading(false);
        return;
      }
      setWeatherNow(dataNow);
      setCity(dataNow.name);

      const resForecast = await fetch(baseUrlForecast + `&units=${units}&lang=bg`);
      const dataForecast = await resForecast.json();
      if (dataForecast.cod !== '200') {
        setErrorMsg('Не може да се зареди прогнозата.');
        setLoading(false);
        return;
      }
      setForecast(dataForecast);

    } catch (error) {
      setErrorMsg('Грешка при зареждане на данните.');
    } finally {
      setLoading(false);
      Keyboard.dismiss();
    }
  }, [city, location, isCelsius]);

  useEffect(() => {
    fetchWeather();
    const interval = setInterval(() => {
      fetchWeather();
    }, 900000);
    return () => clearInterval(interval);
  }, [fetchWeather]);

  function formatDate(dateStr) {
    const date = new Date(dateStr);
    return date.toLocaleDateString('bg-BG', { weekday: 'long', day: 'numeric', month: 'short' });
  }

  const dailyForecast = forecast?.list
    .filter(item => item.dt_txt.includes('12:00:00'))
    .slice(0, 5);

  function getBackgroundColor() {
    if (!weatherNow) return scheme === 'dark' ? '#000' : '#87ceeb';
    const main = weatherNow.weather?.[0]?.main.toLowerCase() || '';
    if (main.includes('clear')) return '#f7b733';
    if (main.includes('cloud')) return '#636e72';
    if (main.includes('rain') || main.includes('drizzle')) return '#74b9ff';
    if (main.includes('thunderstorm')) return '#2d3436';
    if (main.includes('snow')) return '#dfe6e9';
    return scheme === 'dark' ? '#000' : '#87ceeb';
  }

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: getBackgroundColor() }]}
      keyboardShouldPersistTaps="handled"
      contentContainerStyle={{ paddingBottom: 30 }}
    >
      <View style={styles.topContainer}>
        <TextInput
          placeholder="Въведи град"
          style={styles.input}
          value={city}
          onChangeText={setCity}
          onSubmitEditing={fetchWeather}
          returnKeyType="search"
          autoCapitalize="words"
        />
        <TouchableOpacity style={styles.button} onPress={fetchWeather}>
          <Text style={styles.buttonText}>Търси</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.switchContainer}>
        <Text style={[styles.unitText, { color: scheme === 'dark' ? '#fff' : '#000' }]}>
          {isCelsius ? '°C' : '°F'}
        </Text>
        <Switch
          value={isCelsius}
          onValueChange={setIsCelsius}
          trackColor={{ true: '#4a90e2', false: '#bbb' }}
          thumbColor={isCelsius ? '#0057e7' : '#888'}
        />
      </View>

      {loading && <ActivityIndicator size="large" color="#007aff" style={{ marginTop: 20 }} />}

      {errorMsg ? (
        <Text style={styles.error}>{errorMsg}</Text>
      ) : (
        <>
          {weatherNow && (
            <View style={styles.currentWeather}>
              <Text style={styles.cityName}>
                {weatherNow.name}, {weatherNow.sys?.country}
              </Text>
              <Text style={styles.icon}>{getIcon(weatherNow.weather?.[0]?.main)}</Text>
              <Text style={styles.temp}>
                {Math.round(weatherNow.main.temp)}°{isCelsius ? 'C' : 'F'}
              </Text>
              <Text style={styles.description}>{weatherNow.weather?.[0]?.description}</Text>
              <Text style={styles.details}>
                Влажност: {weatherNow.main.humidity}% | Вятър: {weatherNow.wind.speed} м/с | Налягане: {weatherNow.main.pressure} hPa
              </Text>
            </View>
          )}

          {dailyForecast && (
            <View style={styles.forecastContainer}>
              <Text style={styles.forecastTitle}>Прогноза за следващите 5 дни</Text>
              {dailyForecast.map((day) => (
                <View key={day.dt} style={styles.forecastDay}>
                  <Text style={styles.forecastDate}>{formatDate(day.dt_txt)}</Text>
                  <Text style={styles.icon}>{getIcon(day.weather[0].main)}</Text>
                  <Text style={styles.forecastTemp}>
                    {Math.round(day.main.temp)}°{isCelsius ? 'C' : 'F'}
                  </Text>
                  <Text style={styles.forecastDesc}>{day.weather[0].description}</Text>
                </View>
              ))}
            </View>
          )}
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topContainer: {
    flexDirection: 'row',
    padding: 15,
    justifyContent: 'space-between',
  },
  input: {
    flex: 1,
    borderColor: '#aaa',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    fontSize: 18,
    backgroundColor: '#fff',
    marginRight: 10,
    height: 45,
  },
  button: {
    backgroundColor: '#4a90e2',
    paddingHorizontal: 20,
    borderRadius: 8,
    justifyContent: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  unitText: {
    fontSize: 20,
    marginRight: 10,
  },
  currentWeather: {
    alignItems: 'center',
    marginTop: 20,
  },
  cityName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
  },
  icon: {
    fontSize: 60,
    marginVertical: 5,
},
temp: {
fontSize: 48,
fontWeight: '700',
color: '#fff',
},
description: {
fontSize: 22,
fontStyle: 'italic',
color: '#fff',
marginBottom: 10,
},
details: {
fontSize: 16,
color: '#fff',
},
forecastContainer: {
marginTop: 30,
paddingHorizontal: 20,
},
forecastTitle: {
fontSize: 22,
fontWeight: '600',
color: '#fff',
marginBottom: 15,
},
forecastDay: {
flexDirection: 'row',
justifyContent: 'space-between',
backgroundColor: 'rgba(255,255,255,0.2)',
padding: 12,
borderRadius: 10,
marginBottom: 10,
},
forecastDate: {
fontSize: 16,
color: '#fff',
flex: 2,
},
forecastTemp: {
fontSize: 16,
fontWeight: '600',
color: '#fff',
flex: 1,
textAlign: 'right',
},
forecastDesc: {
fontSize: 16,
color: '#fff',
flex: 2,
textAlign: 'right',
},
error: {
color: '#ff6b6b',
fontSize: 18,
textAlign: 'center',
marginTop: 20,
},
});
