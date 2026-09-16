import { Routes } from '@angular/router';
import { DestinationDetailsPageComponent } from './pages/destination-details-page.component';

export const DESTINATION_DETAILS_ROUTES: Routes = [
  {
    path: ':countryCode',
    component: DestinationDetailsPageComponent,
    title: 'Destination · TripShare',
  },
];
