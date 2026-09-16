import { CurrencyPipe, DecimalPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration } from 'chart.js';
import { startWith } from 'rxjs';
import { CurrencyApiService } from '../../../core/api/currency-api.service';
import { BudgetCalculation } from '../../../core/models/budget.model';
import { calculateBudget } from '../../../core/utils/budget.calculator';
import { catchError, of } from 'rxjs';

@Component({
  selector: 'app-budget-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CurrencyPipe,
    DecimalPipe,
    ReactiveFormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    BaseChartDirective,
  ],
  templateUrl: './budget-page.component.html',
  styleUrl: './budget-page.component.scss',
})
export class BudgetPageComponent {
  private readonly currencyApi = inject(CurrencyApiService);
  private readonly route = inject(ActivatedRoute);

  readonly form = new FormGroup({
    destination: new FormControl(this.route.snapshot.queryParamMap.get('destination') ?? '', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    days: new FormControl(7, { nonNullable: true, validators: [Validators.required, Validators.min(1)] }),
    travelers: new FormControl(2, { nonNullable: true, validators: [Validators.required, Validators.min(1)] }),
    accommodationPerDay: new FormControl(120, { nonNullable: true, validators: [Validators.min(0)] }),
    foodPerDay: new FormControl(55, { nonNullable: true, validators: [Validators.min(0)] }),
    transportation: new FormControl(180, { nonNullable: true, validators: [Validators.min(0)] }),
    activities: new FormControl(220, { nonNullable: true, validators: [Validators.min(0)] }),
    other: new FormControl(80, { nonNullable: true, validators: [Validators.min(0)] }),
    currency: new FormControl((this.route.snapshot.queryParamMap.get('currency') ?? 'USD').toUpperCase(), {
      nonNullable: true,
      validators: [Validators.required],
    }),
  });

  private readonly formValue = toSignal(this.form.valueChanges.pipe(startWith(this.form.getRawValue())), {
    initialValue: this.form.getRawValue(),
  });

  readonly result = computed<BudgetCalculation>(() => {
    const value = this.formValue();
    return calculateBudget({
      destination: value.destination ?? '',
      days: Number(value.days ?? 0),
      travelers: Number(value.travelers ?? 1),
      accommodationPerDay: Number(value.accommodationPerDay ?? 0),
      foodPerDay: Number(value.foodPerDay ?? 0),
      transportation: Number(value.transportation ?? 0),
      activities: Number(value.activities ?? 0),
      other: Number(value.other ?? 0),
      currency: value.currency ?? 'USD',
    });
  });

  readonly chartData = computed<ChartConfiguration<'doughnut'>['data']>(() => {
    const calc = this.result();
    return {
      labels: ['Accommodation', 'Food', 'Transportation', 'Activities', 'Other'],
      datasets: [
        {
          data: [calc.accommodationTotal, calc.foodTotal, calc.transportation, calc.activities, calc.other],
          backgroundColor: ['#0f6e6b', '#c9783f', '#3d6b8a', '#7a8f4a', '#8a5a7a'],
        },
      ],
    };
  });

  readonly conversions = signal<Record<string, number>>({});
  readonly conversionError = signal<string | null>(null);
  readonly converting = signal(false);
  readonly targets = ['USD', 'EUR', 'JPY', 'GBP'] as const;

  convert(): void {
    const amount = this.result().total;
    const from = this.form.controls.currency.value.toUpperCase();
    this.converting.set(true);
    this.conversionError.set(null);
    this.currencyApi
      .getLatestRates(from, [...this.targets])
      .pipe(catchError(() => {
        this.conversionError.set('Exchange rates are unavailable right now.');
        return of(null);
      }))
      .subscribe((rate) => {
        this.converting.set(false);
        if (!rate) {
          this.conversions.set({});
          return;
        }
        const mapped: Record<string, number> = {};
        for (const code of this.targets) {
          if (code === from) {
            mapped[code] = amount;
          } else if (rate.rates[code] !== undefined) {
            mapped[code] = amount * rate.rates[code];
          }
        }
        this.conversions.set(mapped);
      });
  }
}
