import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map, of, shareReplay } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ConversionResult, CurrencyOption, ExchangeRate } from '../models/currency.model';

interface FrankfurterLatestResponse {
  amount: number;
  base: string;
  date: string;
  rates: Record<string, number>;
}

@Injectable({ providedIn: 'root' })
export class CurrencyApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.apiUrls.currency;
  private currencies$?: Observable<CurrencyOption[]>;

  getCurrencies(): Observable<CurrencyOption[]> {
    if (!this.currencies$) {
      this.currencies$ = this.http.get<Record<string, string>>(`${this.baseUrl}/currencies`).pipe(
        map((payload) =>
          Object.entries(payload)
            .map(([code, name]) => ({ code, name }))
            .sort((a, b) => a.code.localeCompare(b.code)),
        ),
        shareReplay(1),
      );
    }
    return this.currencies$;
  }

  getLatestRates(base: string, symbols: string[] = []): Observable<ExchangeRate> {
    let params = new HttpParams().set('from', base);
    if (symbols.length > 0) {
      params = params.set('to', symbols.join(','));
    }

    return this.http.get<FrankfurterLatestResponse>(`${this.baseUrl}/latest`, { params }).pipe(
      map((response) => ({
        amount: response.amount,
        base: response.base,
        date: response.date,
        rates: response.rates,
      })),
    );
  }

  convert(amount: number, from: string, to: string): Observable<ConversionResult> {
    if (from === to) {
      return of({
        amount,
        from,
        to,
        rate: 1,
        converted: amount,
        date: new Date().toISOString().slice(0, 10),
      });
    }

    const params = new HttpParams().set('amount', amount.toString()).set('from', from).set('to', to);
    return this.http.get<FrankfurterLatestResponse>(`${this.baseUrl}/latest`, { params }).pipe(
      map((response) => {
        const converted = response.rates[to];
        if (converted === undefined) {
          throw new Error(`No exchange rate available for ${from} to ${to}.`);
        }
        return {
          amount: response.amount,
          from: response.base,
          to,
          rate: amount === 0 ? 0 : converted / amount,
          converted,
          date: response.date,
        };
      }),
    );
  }
}
