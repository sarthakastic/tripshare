import { Injectable, inject } from '@angular/core';
import { STORAGE_KEYS } from '../../../core/constants/storage-keys';
import { Trip } from '../../../core/models/trip.model';
import { StorageService } from '../../../core/services/storage.service';

@Injectable({ providedIn: 'root' })
export class TripRepositoryService {
  private readonly storage = inject(StorageService);

  loadAll(): Trip[] {
    const stored = this.storage.get<Trip[]>(STORAGE_KEYS.trips);
    if (!Array.isArray(stored)) {
      return [];
    }
    return stored.filter(isTrip);
  }

  saveAll(trips: Trip[]): void {
    this.storage.set(STORAGE_KEYS.trips, trips);
  }
}

function isTrip(value: Trip): value is Trip {
  return Boolean(value && typeof value.id === 'string' && typeof value.name === 'string');
}
