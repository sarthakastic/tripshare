import { StorageService } from './storage.service';

describe('StorageService', () => {
  let service: StorageService;

  beforeEach(() => {
    localStorage.clear();
    service = new StorageService();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('round-trips JSON values', () => {
    service.set('tripshare.test', { name: 'Kyoto' });
    expect(service.get<{ name: string }>('tripshare.test')).toEqual({ name: 'Kyoto' });
  });

  it('returns null for missing keys', () => {
    expect(service.get('missing')).toBeNull();
  });

  it('clears corrupted JSON instead of throwing', () => {
    localStorage.setItem('broken', '{not-json');
    expect(service.get('broken')).toBeNull();
    expect(localStorage.getItem('broken')).toBeNull();
  });
});
