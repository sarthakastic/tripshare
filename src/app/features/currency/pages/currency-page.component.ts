import { CurrencyPipe, DecimalPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { catchError, of } from 'rxjs';
import { CurrencyApiService } from '../../../core/api/currency-api.service';
import { ConversionResult, CurrencyOption } from '../../../core/models/currency.model';
import { ErrorStateComponent } from '../../../shared/components/error-state/error-state.component';
import { LoadingStateComponent } from '../../../shared/components/loading-state/loading-state.component';

@Component({
  selector: 'app-currency-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CurrencyPipe,
    DecimalPipe,
    ReactiveFormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatSelectModule,
    ErrorStateComponent,
    LoadingStateComponent,
  ],
  templateUrl: './currency-page.component.html',
  styleUrl: './currency-page.component.scss',
})
export class CurrencyPageComponent implements OnInit {
  private readonly currencyApi = inject(CurrencyApiService);
  readonly currencies = signal<CurrencyOption[]>([]);
  readonly loading = signal(false);
  readonly listLoading = signal(true);
  readonly error = signal<string | null>(null);
  readonly result = signal<ConversionResult | null>(null);

  readonly form = new FormGroup({
    amount: new FormControl(80000, { nonNullable: true, validators: [Validators.required, Validators.min(0)] }),
    from: new FormControl('INR', { nonNullable: true, validators: [Validators.required] }),
    to: new FormControl('USD', { nonNullable: true, validators: [Validators.required] }),
  });

  ngOnInit(): void {
    this.currencyApi
      .getCurrencies()
      .pipe(
        catchError(() => {
          this.error.set('Currency list could not be loaded.');
          return of([]);
        }),
      )
      .subscribe((currencies) => {
        this.currencies.set(currencies);
        this.listLoading.set(false);
        this.convert();
      });
  }

  swap(): void {
    const { from, to } = this.form.getRawValue();
    this.form.patchValue({ from: to, to: from });
    this.convert();
  }

  convert(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const { amount, from, to } = this.form.getRawValue();
    this.loading.set(true);
    this.error.set(null);
    this.currencyApi
      .convert(amount, from, to)
      .pipe(
        catchError(() => {
          this.error.set('This conversion is unavailable. Check both currency codes and try again.');
          return of(null);
        }),
      )
      .subscribe((result) => {
        this.result.set(result);
        this.loading.set(false);
      });
  }
}
