import { FormControl, FormGroup } from '@angular/forms';
import { endDateAfterStartDate } from './date.validators';

describe('endDateAfterStartDate', () => {
  const group = new FormGroup(
    {
      startDate: new FormControl<Date | null>(null),
      endDate: new FormControl<Date | null>(null),
    },
    { validators: endDateAfterStartDate('startDate', 'endDate') },
  );

  it('allows an end date on or after the start date', () => {
    group.setValue({
      startDate: new Date('2026-04-01'),
      endDate: new Date('2026-04-08'),
    });
    expect(group.valid).toBe(true);
  });

  it('rejects an end date before the start date', () => {
    group.setValue({
      startDate: new Date('2026-04-10'),
      endDate: new Date('2026-04-01'),
    });
    expect(group.hasError('endBeforeStart')).toBe(true);
  });
});
