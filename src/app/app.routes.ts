import { Routes } from '@angular/router';
import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';

export const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      {
        path: '',
        loadChildren: () => import('./features/home/home.routes').then((m) => m.HOME_ROUTES),
      },
      {
        path: 'explore',
        loadChildren: () => import('./features/explore/explore.routes').then((m) => m.EXPLORE_ROUTES),
      },
      {
        path: 'destinations',
        loadChildren: () =>
          import('./features/destination-details/destination-details.routes').then((m) => m.DESTINATION_DETAILS_ROUTES),
      },
      {
        path: 'weather',
        loadChildren: () => import('./features/weather/weather.routes').then((m) => m.WEATHER_ROUTES),
      },
      {
        path: 'trips',
        loadChildren: () => import('./features/trips/trips.routes').then((m) => m.TRIPS_ROUTES),
      },
      {
        path: 'budget',
        loadChildren: () => import('./features/budget/budget.routes').then((m) => m.BUDGET_ROUTES),
      },
      {
        path: 'currency',
        loadChildren: () => import('./features/currency/currency.routes').then((m) => m.CURRENCY_ROUTES),
      },
      {
        path: 'wishlist',
        loadChildren: () => import('./features/wishlist/wishlist.routes').then((m) => m.WISHLIST_ROUTES),
      },
    ],
  },
  {
    path: '**',
    loadComponent: () => import('./features/not-found/not-found.component').then((m) => m.NotFoundComponent),
    title: 'Page not found · TripShare',
  },
];
