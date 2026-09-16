import { DecimalPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, input, signal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { catchError, of, switchMap, tap } from 'rxjs';
import { toDestination } from '../../../core/models/country.model';
import { AppError } from '../../../core/models/app-error.model';
import { CompactNumberPipe } from '../../../shared/pipes/compact-number.pipe';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state.component';
import { ErrorStateComponent } from '../../../shared/components/error-state/error-state.component';
import { LoadingStateComponent } from '../../../shared/components/loading-state/loading-state.component';
import { WeatherCardComponent } from '../../../shared/components/weather-card/weather-card.component';
import { WeatherForecastComponent } from '../../../shared/components/weather-forecast/weather-forecast.component';
import { WishlistStore } from '../../wishlist/services/wishlist.store';
import { DestinationDetailsFacade } from '../services/destination-details.facade';

@Component({
  selector: 'app-destination-details-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    DecimalPipe,
    RouterLink,
    MatButtonModule,
    MatIconModule,
    CompactNumberPipe,
    EmptyStateComponent,
    ErrorStateComponent,
    LoadingStateComponent,
    WeatherCardComponent,
    WeatherForecastComponent,
  ],
  templateUrl: './destination-details-page.component.html',
  styleUrl: './destination-details-page.component.scss',
})
export class DestinationDetailsPageComponent {
  private readonly facade = inject(DestinationDetailsFacade);
  readonly wishlist = inject(WishlistStore);
  readonly countryCode = input.required<string>();
  readonly loading = signal(true);
  readonly error = signal<string | null>(null);

  private readonly view$ = toObservable(this.countryCode).pipe(
    tap(() => {
      this.loading.set(true);
      this.error.set(null);
    }),
    switchMap((code) =>
      this.facade.load(code).pipe(
        catchError((err: unknown) => {
          this.error.set(err instanceof AppError ? err.message : 'This destination could not be loaded.');
          return of(null);
        }),
      ),
    ),
    tap(() => this.loading.set(false)),
  );

  readonly view = toSignal(this.view$, { initialValue: null });
  readonly saved = computed(() => {
    const country = this.view()?.country;
    return country ? this.wishlist.isWishlisted(country.code) : false;
  });

  toggleWishlist(): void {
    const country = this.view()?.country;
    if (country) {
      this.wishlist.toggle(toDestination(country));
    }
  }
}
