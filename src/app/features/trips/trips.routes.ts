import { Routes } from '@angular/router';
import { unsavedChangesGuard } from '../../core/guards/unsaved-changes.guard';
import { TripDetailsPageComponent } from './pages/trip-details-page.component';
import { TripEditorPageComponent } from './pages/trip-editor-page.component';
import { TripsPageComponent } from './pages/trips-page.component';

export const TRIPS_ROUTES: Routes = [
  {
    path: '',
    component: TripsPageComponent,
    title: 'Trips · TripShare',
  },
  {
    path: 'create',
    component: TripEditorPageComponent,
    title: 'Create trip · TripShare',
    canDeactivate: [unsavedChangesGuard],
  },
  {
    path: ':id',
    component: TripDetailsPageComponent,
    title: 'Trip details · TripShare',
  },
  {
    path: ':id/edit',
    component: TripEditorPageComponent,
    title: 'Edit trip · TripShare',
    canDeactivate: [unsavedChangesGuard],
  },
];
