export interface CurrentWeather {
  temperature: number;
  apparentTemperature: number;
  humidity: number | null;
  windSpeed: number;
  weatherCode: number;
  condition: string;
  icon: string;
  time: string;
}

export interface DailyForecast {
  date: string;
  maxTemperature: number;
  minTemperature: number;
  weatherCode: number;
  condition: string;
  icon: string;
  precipitationProbability: number | null;
  precipitationSum: number | null;
  windSpeedMax: number | null;
}

export interface WeatherSnapshot {
  latitude: number;
  longitude: number;
  timezone: string;
  current: CurrentWeather;
  daily: DailyForecast[];
}
