import { DatePipe, DecimalPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state.component';
import { TripFacade } from '../services/trip.facade';

@Component({
  selector: 'app-trips-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DatePipe, DecimalPipe, RouterLink, MatButtonModule, MatCardModule, MatIconModule, EmptyStateComponent],
  templateUrl: './trips-page.component.html',
  styleUrl: './trips-page.component.scss',
})
export class TripsPageComponent {
  readonly trips = inject(TripFacade).trips;
}
