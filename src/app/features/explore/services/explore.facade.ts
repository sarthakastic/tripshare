import { Injectable, inject, signal } from '@angular/core';
import { Observable, catchError, map, of } from 'rxjs';
import { CountryApiService } from '../../../core/api/country-api.service';
import { Country } from '../../../core/models/country.model';

@Injectable({ providedIn: 'root' })
export class ExploreFacade {
  private readonly countriesApi = inject(CountryApiService);
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);

  search(query: string, region: string): Observable<Country[]> {
    this.loading.set(true);
    this.error.set(null);
    const trimmed = query.trim();

    const source$ = trimmed.length >= 2 ? this.countriesApi.searchByName(trimmed) : region ? this.countriesApi.getByRegion(region) : this.countriesApi.getAll();

    return source$.pipe(
      map((countries) => (region && trimmed.length >= 2 ? countries.filter((country) => country.region === region) : countries)),
      catchError(() => {
        this.error.set(trimmed ? 'No destinations matched that search.' : 'Destinations could not be loaded.');
        return of([]);
      }),
    );
  }
}
