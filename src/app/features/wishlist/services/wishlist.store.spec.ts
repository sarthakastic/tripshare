import { TestBed } from '@angular/core/testing';
import { STORAGE_KEYS } from '../../../core/constants/storage-keys';
import { StorageService } from '../../../core/services/storage.service';
import { WishlistStore } from './wishlist.store';

describe('WishlistStore', () => {
  let store: WishlistStore;
  let storage: StorageService;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({});
    store = TestBed.inject(WishlistStore);
    storage = TestBed.inject(StorageService);
  });

  afterEach(() => {
    localStorage.clear();
  });

  const kyoto = {
    code: 'JPN',
    cca2: 'JP',
    name: 'Japan',
    capital: 'Tokyo',
    region: 'Asia',
    population: 125000000,
    flagPng: 'flag.png',
    flagAlt: 'Flag of Japan',
  };

  it('adds, detects, and removes destinations', () => {
    store.addDestination(kyoto);
    expect(store.isWishlisted('JPN')).toBe(true);
    expect(store.count()).toBe(1);

    store.addDestination(kyoto);
    expect(store.count()).toBe(1);

    store.removeDestination('JPN');
    expect(store.isWishlisted('JPN')).toBe(false);
    expect(storage.get(STORAGE_KEYS.wishlist)).toEqual([]);
  });
});
