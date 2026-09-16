import { Routes } from '@angular/router';
import { ExplorePageComponent } from './pages/explore-page.component';

export const EXPLORE_ROUTES: Routes = [
  {
    path: '',
    component: ExplorePageComponent,
    title: 'Explore destinations · TripShare',
  },
];
