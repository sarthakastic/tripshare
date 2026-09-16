import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map, of, shareReplay } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Country } from '../models/country.model';
import { RestCountryResponse, filterCountries, mapRestCountries } from '../utils/country.mapper';

@Injectable({ providedIn: 'root' })
export class CountryApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.apiUrls.countries;
  private catalog$?: Observable<Country[]>;

  getAll(): Observable<Country[]> {
    if (!this.catalog$) {
      this.catalog$ = this.http.get<RestCountryResponse[]>(`${this.baseUrl}/countries`).pipe(
        map(mapRestCountries),
        shareReplay(1),
      );
    }
    return this.catalog$;
  }

  searchByName(name: string): Observable<Country[]> {
    const query = name.trim();
    if (!query) {
      return this.getAll();
    }
    return this.getAll().pipe(map((countries) => filterCountries(countries, query)));
  }

  getByRegion(region: string): Observable<Country[]> {
    return this.getAll().pipe(map((countries) => filterCountries(countries, '', region)));
  }

  getByCode(code: string): Observable<Country> {
    return this.getAll().pipe(
      map((countries) => {
        const country = countries.find((item) => item.code.toUpperCase() === code.toUpperCase());
        if (!country) {
          throw new Error(`Destination ${code} was not found.`);
        }
        return country;
      }),
    );
  }

  getByCodes(codes: readonly string[]): Observable<Country[]> {
    if (codes.length === 0) {
      return of([]);
    }
    const wanted = new Set(codes.map((code) => code.toUpperCase()));
    return this.getAll().pipe(map((countries) => countries.filter((country) => wanted.has(country.code))));
  }
}
