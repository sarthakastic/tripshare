import { ChangeDetectionStrategy, Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { catchError, of } from 'rxjs';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { CountryApiService } from '../../../core/api/country-api.service';
import { FEATURED_COUNTRY_CODES } from '../../../core/constants/featured-destinations';
import { REGION_PREVIEWS } from '../../../core/constants/regions';
import { Country } from '../../../core/models/country.model';
import { DestinationCardComponent } from '../../../shared/components/destination-card/destination-card.component';
import { DestinationSearchComponent } from '../../../shared/components/destination-search/destination-search.component';
import { LoadingStateComponent } from '../../../shared/components/loading-state/loading-state.component';
import { ErrorStateComponent } from '../../../shared/components/error-state/error-state.component';

@Component({
  selector: 'app-home-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    RouterLink,
    MatButtonModule,
    MatIconModule,
    DestinationCardComponent,
    DestinationSearchComponent,
    LoadingStateComponent,
    ErrorStateComponent,
  ],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.scss',
})
export class HomePageComponent {
  private readonly countriesApi = inject(CountryApiService);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

  readonly featured = signal<Country[]>([]);
  readonly loading = signal(true);
  readonly error = signal<string | null>(null);
  readonly regions = REGION_PREVIEWS;
  readonly tools = [
    { title: 'Explore destinations', copy: 'Browse countries by region and search.', path: '/explore', icon: 'explore' },
    { title: 'Weather', copy: 'Check current conditions and a 7-day forecast.', path: '/weather', icon: 'partly_cloudy_day' },
    { title: 'Trip planner', copy: 'Build day-by-day itineraries.', path: '/trips', icon: 'luggage' },
    { title: 'Budget calculator', copy: 'Estimate trip costs per person and per day.', path: '/budget', icon: 'payments' },
    { title: 'Currency converter', copy: 'Convert travel budgets with live rates.', path: '/currency', icon: 'currency_exchange' },
  ];

  constructor() {
    this.loadFeatured();
  }

  loadFeatured(): void {
    this.loading.set(true);
    this.error.set(null);
    this.countriesApi
      .getByCodes(FEATURED_COUNTRY_CODES)
      .pipe(
        catchError(() => {
          this.error.set('Featured destinations could not be loaded.');
          return of([]);
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((countries) => {
        this.featured.set(countries);
        this.loading.set(false);
      });
  }

  search(query: string): void {
    void this.router.navigate(['/explore'], { queryParams: { q: query } });
  }

  openCountry(country: Country): void {
    void this.router.navigate(['/destinations', country.code]);
  }
}
