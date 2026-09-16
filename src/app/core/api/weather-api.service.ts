import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { DailyForecast, WeatherSnapshot } from '../models/weather.model';
import { describeWeatherCode } from '../utils/weather-code';

interface OpenMeteoResponse {
  latitude: number;
  longitude: number;
  timezone?: string;
  current?: {
    time?: string;
    temperature_2m?: number;
    apparent_temperature?: number;
    relative_humidity_2m?: number;
    weather_code?: number;
    wind_speed_10m?: number;
  };
  daily?: {
    time?: string[];
    weather_code?: number[];
    temperature_2m_max?: number[];
    temperature_2m_min?: number[];
    precipitation_probability_max?: number[];
    precipitation_sum?: number[];
    wind_speed_10m_max?: number[];
  };
}

@Injectable({ providedIn: 'root' })
export class WeatherApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.apiUrls.weather;

  getForecast(latitude: number, longitude: number): Observable<WeatherSnapshot> {
    const params = new HttpParams()
      .set('latitude', latitude.toString())
      .set('longitude', longitude.toString())
      .set('current', 'temperature_2m,apparent_temperature,relative_humidity_2m,weather_code,wind_speed_10m')
      .set(
        'daily',
        'weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,precipitation_sum,wind_speed_10m_max',
      )
      .set('timezone', 'auto')
      .set('forecast_days', '7');

    return this.http.get<OpenMeteoResponse>(`${this.baseUrl}/forecast`, { params }).pipe(map((response) => this.mapWeather(response)));
  }

  private mapWeather(response: OpenMeteoResponse): WeatherSnapshot {
    const currentCode = response.current?.weather_code ?? 0;
    const currentMeta = describeWeatherCode(currentCode);
    const dates = response.daily?.time ?? [];

    const daily: DailyForecast[] = dates.map((date, index) => {
      const code = response.daily?.weather_code?.[index] ?? 0;
      const meta = describeWeatherCode(code);
      return {
        date,
        maxTemperature: response.daily?.temperature_2m_max?.[index] ?? 0,
        minTemperature: response.daily?.temperature_2m_min?.[index] ?? 0,
        weatherCode: code,
        condition: meta.condition,
        icon: meta.icon,
        precipitationProbability: response.daily?.precipitation_probability_max?.[index] ?? null,
        precipitationSum: response.daily?.precipitation_sum?.[index] ?? null,
        windSpeedMax: response.daily?.wind_speed_10m_max?.[index] ?? null,
      };
    });

    return {
      latitude: response.latitude,
      longitude: response.longitude,
      timezone: response.timezone ?? 'auto',
      current: {
        temperature: response.current?.temperature_2m ?? 0,
        apparentTemperature: response.current?.apparent_temperature ?? 0,
        humidity: response.current?.relative_humidity_2m ?? null,
        windSpeed: response.current?.wind_speed_10m ?? 0,
        weatherCode: currentCode,
        condition: currentMeta.condition,
        icon: currentMeta.icon,
        time: response.current?.time ?? '',
      },
      daily,
    };
  }
}
