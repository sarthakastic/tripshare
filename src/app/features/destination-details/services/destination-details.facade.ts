import { Injectable, inject } from '@angular/core';
import { Observable, catchError, forkJoin, map, of, switchMap } from 'rxjs';
import { CountryApiService } from '../../../core/api/country-api.service';
import { WeatherApiService } from '../../../core/api/weather-api.service';
import { Country } from '../../../core/models/country.model';
import { WeatherSnapshot } from '../../../core/models/weather.model';

export interface DestinationDetailsView {
  country: Country;
  weather: WeatherSnapshot | null;
}

@Injectable({ providedIn: 'root' })
export class DestinationDetailsFacade {
  private readonly countriesApi = inject(CountryApiService);
  private readonly weatherApi = inject(WeatherApiService);

  load(countryCode: string): Observable<DestinationDetailsView> {
    return this.countriesApi.getByCode(countryCode).pipe(
      switchMap((country) =>
        forkJoin({
          country: of(country),
          weather: this.weatherApi.getForecast(country.latitude, country.longitude).pipe(catchError(() => of(null))),
        }),
      ),
      map((result) => result),
    );
  }
}
