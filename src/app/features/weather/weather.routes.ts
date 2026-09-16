import { Routes } from '@angular/router';
import { WeatherPageComponent } from './pages/weather-page.component';

export const WEATHER_ROUTES: Routes = [
  {
    path: '',
    component: WeatherPageComponent,
    title: 'Weather · TripShare',
  },
];
