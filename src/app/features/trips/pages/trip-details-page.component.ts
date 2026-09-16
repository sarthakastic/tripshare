import { CurrencyPipe, DatePipe, DecimalPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { Router, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { catchError, filter, forkJoin, map, of, switchMap } from 'rxjs';
import { CurrencyApiService } from '../../../core/api/currency-api.service';
import { WeatherApiService } from '../../../core/api/weather-api.service';
import { CountryApiService } from '../../../core/api/country-api.service';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state.component';
import { WeatherCardComponent } from '../../../shared/components/weather-card/weather-card.component';
import { TripFacade } from '../services/trip.facade';

@Component({
  selector: 'app-trip-details-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CurrencyPipe,
    DatePipe,
    DecimalPipe,
    RouterLink,
    MatButtonModule,
    MatIconModule,
    EmptyStateComponent,
    WeatherCardComponent,
  ],
  templateUrl: './trip-details-page.component.html',
  styleUrl: './trip-details-page.component.scss',
})
export class TripDetailsPageComponent {
  private readonly facade = inject(TripFacade);
  private readonly dialog = inject(MatDialog);
  private readonly router = inject(Router);
  private readonly countriesApi = inject(CountryApiService);
  private readonly weatherApi = inject(WeatherApiService);
  private readonly currencyApi = inject(CurrencyApiService);

  readonly id = input.required<string>();
  readonly trip = computed(() => this.facade.getById(this.id()));

  private readonly extras$ = toObservable(this.trip).pipe(
    switchMap((trip) => {
      if (!trip) {
        return of({ weather: null, conversion: null as number | null });
      }

      const weather$ = this.countriesApi.getByCode(trip.destinationCode).pipe(
        catchError(() => of(null)),
        switchMap((country) =>
          country
            ? this.weatherApi.getForecast(country.latitude, country.longitude).pipe(catchError(() => of(null)))
            : of(null),
        ),
      );

      const target = trip.currency === 'USD' ? 'EUR' : 'USD';
      const conversion$ = this.currencyApi.convert(trip.estimatedBudget, trip.currency, target).pipe(
        catchError(() => of(null)),
      );

      return forkJoin({ weather: weather$, conversion: conversion$ }).pipe(
        map((result) => ({
          weather: result.weather,
          conversion: result.conversion?.converted ?? null,
        })),
      );
    }),
  );

  readonly extras = toSignal(this.extras$, { initialValue: { weather: null, conversion: null } });

  deleteTrip(): void {
    const trip = this.trip();
    if (!trip) {
      return;
    }
    const ref = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Delete this trip?',
        message: `${trip.name} will be removed from this device.`,
        confirmLabel: 'Delete trip',
      },
    });
    ref
      .afterClosed()
      .pipe(filter(Boolean))
      .subscribe(() => {
        this.facade.delete(trip.id);
        void this.router.navigate(['/trips']);
      });
  }
}
