import { ChangeDetectionStrategy, Component, DestroyRef, inject, input, output, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { catchError, debounceTime, distinctUntilChanged, of, switchMap } from 'rxjs';
import { CountryApiService } from '../../../core/api/country-api.service';
import { SEARCH_DEBOUNCE_MS } from '../../../core/constants/featured-destinations';
import { Country } from '../../../core/models/country.model';

@Component({
  selector: 'app-destination-search',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    MatAutocompleteModule,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
  ],
  templateUrl: './destination-search.component.html',
  styleUrl: './destination-search.component.scss',
})
export class DestinationSearchComponent {
  private readonly countriesApi = inject(CountryApiService);
  private readonly destroyRef = inject(DestroyRef);

  readonly placeholder = input('Search countries and capitals');
  readonly submitLabel = input('Search');
  readonly appearance = input<'fill' | 'outline'>('outline');
  readonly selected = output<Country>();
  readonly submitted = output<string>();

  readonly control = new FormControl<string | Country>('', { nonNullable: true });
  readonly options = signal<Country[]>([]);
  readonly loading = signal(false);

  constructor() {
    this.control.valueChanges
      .pipe(
        debounceTime(SEARCH_DEBOUNCE_MS),
        distinctUntilChanged(),
        switchMap((value) => {
          const query = (typeof value === 'string' ? value : value.name).trim();
          if (query.length < 2) {
            this.loading.set(false);
            return of([]);
          }
          this.loading.set(true);
          return this.countriesApi.searchByName(query).pipe(
            catchError(() => of([])),
          );
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((countries) => {
        this.options.set(countries.slice(0, 8));
        this.loading.set(false);
      });
  }

  displayCountry(country: Country | string | null): string {
    if (!country) {
      return '';
    }
    return typeof country === 'string' ? country : country.name;
  }

  onSelected(event: MatAutocompleteSelectedEvent): void {
    const country = event.option.value as Country;
    this.selected.emit(country);
  }

  submit(): void {
    const value = this.control.value;
    const query = typeof value === 'string' ? value.trim() : value.name;
    if (query) {
      this.submitted.emit(query);
    }
  }
}
