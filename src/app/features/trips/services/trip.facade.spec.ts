import { TestBed } from '@angular/core/testing';
import { NotificationService } from '../../../core/services/notification.service';
import { TripFacade } from './trip.facade';

describe('TripFacade', () => {
  let facade: TripFacade;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({
      providers: [
        {
          provide: NotificationService,
          useValue: { success: () => undefined, error: () => undefined, info: () => undefined },
        },
      ],
    });
    facade = TestBed.inject(TripFacade);
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('creates, updates, and deletes trips', () => {
    const created = facade.create({
      name: 'Spring in Kyoto',
      destinationCode: 'JPN',
      destinationName: 'Japan',
      startDate: '2026-04-01',
      endDate: '2026-04-08',
      travelers: 2,
      estimatedBudget: 2400,
      currency: 'USD',
      notes: '',
      days: [],
    });

    expect(facade.count()).toBe(1);
    expect(facade.getById(created.id)?.name).toBe('Spring in Kyoto');

    facade.update(created.id, {
      ...created,
      name: 'Cherry blossom week',
    });
    expect(facade.getById(created.id)?.name).toBe('Cherry blossom week');

    facade.delete(created.id);
    expect(facade.getById(created.id)).toBeUndefined();
    expect(facade.count()).toBe(0);
  });
});
