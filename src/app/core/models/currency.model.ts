export interface ExchangeRate {
  amount: number;
  base: string;
  date: string;
  rates: Record<string, number>;
}

export interface ConversionResult {
  amount: number;
  from: string;
  to: string;
  rate: number;
  converted: number;
  date: string;
}

export interface CurrencyOption {
  code: string;
  name: string;
}
