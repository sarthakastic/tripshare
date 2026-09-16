const WEATHER_CONDITIONS: Record<number, { condition: string; icon: string }> = {
  0: { condition: 'Clear sky', icon: 'wb_sunny' },
  1: { condition: 'Mainly clear', icon: 'wb_sunny' },
  2: { condition: 'Partly cloudy', icon: 'partly_cloudy_day' },
  3: { condition: 'Overcast', icon: 'cloud' },
  45: { condition: 'Fog', icon: 'foggy' },
  48: { condition: 'Rime fog', icon: 'foggy' },
  51: { condition: 'Light drizzle', icon: 'grain' },
  53: { condition: 'Drizzle', icon: 'grain' },
  55: { condition: 'Dense drizzle', icon: 'grain' },
  56: { condition: 'Freezing drizzle', icon: 'ac_unit' },
  57: { condition: 'Dense freezing drizzle', icon: 'ac_unit' },
  61: { condition: 'Slight rain', icon: 'rainy' },
  63: { condition: 'Rain', icon: 'rainy' },
  65: { condition: 'Heavy rain', icon: 'rainy' },
  66: { condition: 'Freezing rain', icon: 'ac_unit' },
  67: { condition: 'Heavy freezing rain', icon: 'ac_unit' },
  71: { condition: 'Slight snow', icon: 'weather_snowy' },
  73: { condition: 'Snow', icon: 'weather_snowy' },
  75: { condition: 'Heavy snow', icon: 'weather_snowy' },
  77: { condition: 'Snow grains', icon: 'weather_snowy' },
  80: { condition: 'Slight showers', icon: 'rainy' },
  81: { condition: 'Showers', icon: 'rainy' },
  82: { condition: 'Violent showers', icon: 'thunderstorm' },
  85: { condition: 'Snow showers', icon: 'weather_snowy' },
  86: { condition: 'Heavy snow showers', icon: 'weather_snowy' },
  95: { condition: 'Thunderstorm', icon: 'thunderstorm' },
  96: { condition: 'Thunderstorm with hail', icon: 'thunderstorm' },
  99: { condition: 'Severe thunderstorm with hail', icon: 'thunderstorm' },
};

export function describeWeatherCode(code: number): { condition: string; icon: string } {
  return WEATHER_CONDITIONS[code] ?? { condition: 'Unknown conditions', icon: 'thermostat' };
}
