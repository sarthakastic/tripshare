import { Injectable, inject, signal } from '@angular/core';
import { catchError, of, switchMap } from 'rxjs';
import { CountryApiService } from '../../../core/api/country-api.service';
import { WeatherApiService } from '../../../core/api/weather-api.service';
import { Country } from '../../../core/models/country.model';
import { WeatherSnapshot } from '../../../core/models/weather.model';

@Injectable({ providedIn: 'root' })
export class WeatherFacade {
  private readonly countriesApi = inject(CountryApiService);
  private readonly weatherApi = inject(WeatherApiService);
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);
  readonly country = signal<Country | null>(null);
  readonly weather = signal<WeatherSnapshot | null>(null);

  loadForCountry(country: Country): void {
    this.country.set(country);
    this.loading.set(true);
    this.error.set(null);
    this.weatherApi
      .getForecast(country.latitude, country.longitude)
      .pipe(
        catchError(() => {
          this.error.set('Weather could not be loaded for this destination.');
          return of(null);
        }),
      )
      .subscribe((weather) => {
        this.weather.set(weather);
        this.loading.set(false);
      });
  }

  loadByName(name: string): void {
    this.loading.set(true);
    this.error.set(null);
    this.countriesApi
      .searchByName(name)
      .pipe(
        switchMap((countries) => {
          const match = countries[0];
          if (!match) {
            this.error.set('No destination matched that search.');
            return of(null);
          }
          this.country.set(match);
          return this.weatherApi.getForecast(match.latitude, match.longitude);
        }),
        catchError(() => {
          this.error.set('Weather could not be loaded for this destination.');
          return of(null);
        }),
      )
      .subscribe((weather) => {
        this.weather.set(weather);
        this.loading.set(false);
      });
  }
}
