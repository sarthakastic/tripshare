import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function endDateAfterStartDate(startKey: string, endKey: string): ValidatorFn {
  return (group: AbstractControl): ValidationErrors | null => {
    const start = group.get(startKey)?.value as string | Date | null;
    const end = group.get(endKey)?.value as string | Date | null;
    if (!start || !end) {
      return null;
    }

    const startTime = new Date(start).getTime();
    const endTime = new Date(end).getTime();
    if (Number.isNaN(startTime) || Number.isNaN(endTime)) {
      return { invalidDate: true };
    }

    return endTime >= startTime ? null : { endBeforeStart: true };
  };
}
