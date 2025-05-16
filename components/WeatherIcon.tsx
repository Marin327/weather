import React from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface WeatherIconProps {
  weatherMain: string;
}

export function WeatherIcon({ weatherMain }: WeatherIconProps) {
  switch (weatherMain.toLowerCase()) {
    case 'clear':
      return <MaterialCommunityIcons name="weather-sunny" size={64} color="orange" />;
    case 'clouds':
      return <MaterialCommunityIcons name="weather-cloudy" size={64} color="gray" />;
    case 'rain':
    case 'drizzle':
      return <MaterialCommunityIcons name="weather-rainy" size={64} color="blue" />;
    case 'thunderstorm':
      return <MaterialCommunityIcons name="weather-lightning" size={64} color="yellow" />;
    case 'snow':
      return <MaterialCommunityIcons name="weather-snowy" size={64} color="lightblue" />;
    default:
      return <MaterialCommunityIcons name="weather-partly-cloudy" size={64} color="gray" />;
  }
}