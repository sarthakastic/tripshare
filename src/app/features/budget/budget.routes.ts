import { Routes } from '@angular/router';
import { BudgetPageComponent } from './pages/budget-page.component';

export const BUDGET_ROUTES: Routes = [
  {
    path: '',
    component: BudgetPageComponent,
    title: 'Budget calculator · TripShare',
  },
];
