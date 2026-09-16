import { Injectable, computed, inject, signal } from '@angular/core';
import { STORAGE_KEYS } from '../../../core/constants/storage-keys';
import { Destination } from '../../../core/models/country.model';
import { StorageService } from '../../../core/services/storage.service';

@Injectable({ providedIn: 'root' })
export class WishlistStore {
  private readonly storage = inject(StorageService);
  readonly wishlist = signal<Destination[]>(this.read());
  readonly count = computed(() => this.wishlist().length);

  addDestination(destination: Destination): void {
    if (this.isWishlisted(destination.code)) {
      return;
    }
    this.wishlist.update((items) => [...items, destination]);
    this.persist();
  }

  removeDestination(code: string): void {
    this.wishlist.update((items) => items.filter((item) => item.code !== code));
    this.persist();
  }

  toggle(destination: Destination): void {
    if (this.isWishlisted(destination.code)) {
      this.removeDestination(destination.code);
      return;
    }
    this.addDestination(destination);
  }

  isWishlisted(code: string): boolean {
    return this.wishlist().some((item) => item.code === code);
  }

  private read(): Destination[] {
    const stored = this.storage.get<Destination[]>(STORAGE_KEYS.wishlist);
    return Array.isArray(stored) ? stored : [];
  }

  private persist(): void {
    this.storage.set(STORAGE_KEYS.wishlist, this.wishlist());
  }
}
