import { Routes } from '@angular/router';
import { CurrencyPageComponent } from './pages/currency-page.component';

export const CURRENCY_ROUTES: Routes = [
  {
    path: '',
    component: CurrencyPageComponent,
    title: 'Currency converter · TripShare',
  },
];
