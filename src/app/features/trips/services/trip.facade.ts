import { Injectable, computed, inject, signal } from '@angular/core';
import { Trip } from '../../../core/models/trip.model';
import { NotificationService } from '../../../core/services/notification.service';
import { createId } from '../../../core/utils/id';
import { TripRepositoryService } from './trip-repository.service';

@Injectable({ providedIn: 'root' })
export class TripFacade {
  private readonly repository = inject(TripRepositoryService);
  private readonly notifications = inject(NotificationService);
  readonly trips = signal<Trip[]>(this.repository.loadAll());
  readonly count = computed(() => this.trips().length);

  getById(id: string): Trip | undefined {
    return this.trips().find((trip) => trip.id === id);
  }

  create(input: Omit<Trip, 'id' | 'createdAt' | 'updatedAt'>): Trip {
    const now = new Date().toISOString();
    const trip: Trip = {
      ...input,
      id: createId('trip'),
      createdAt: now,
      updatedAt: now,
    };
    this.trips.update((trips) => [trip, ...trips]);
    this.persist();
    this.notifications.success('Trip saved.');
    return trip;
  }

  update(id: string, input: Omit<Trip, 'id' | 'createdAt' | 'updatedAt'>): Trip | null {
    const existing = this.getById(id);
    if (!existing) {
      this.notifications.error('This trip could not be found.');
      return null;
    }

    const updated: Trip = {
      ...existing,
      ...input,
      id,
      createdAt: existing.createdAt,
      updatedAt: new Date().toISOString(),
    };

    this.trips.update((trips) => trips.map((trip) => (trip.id === id ? updated : trip)));
    this.persist();
    this.notifications.success('Trip updated.');
    return updated;
  }

  delete(id: string): void {
    this.trips.update((trips) => trips.filter((trip) => trip.id !== id));
    this.persist();
    this.notifications.success('Trip removed.');
  }

  private persist(): void {
    this.repository.saveAll(this.trips());
  }
}
