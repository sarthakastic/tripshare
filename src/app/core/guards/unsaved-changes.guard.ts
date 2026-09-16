import { inject } from '@angular/core';
import { CanDeactivateFn } from '@angular/router';
import { map } from 'rxjs';
import { ConfirmDialogComponent } from '../../shared/components/confirm-dialog/confirm-dialog.component';
import { MatDialog } from '@angular/material/dialog';

export interface UnsavedChangesComponent {
  hasUnsavedChanges(): boolean;
}

export const unsavedChangesGuard: CanDeactivateFn<UnsavedChangesComponent> = (component) => {
  if (!component.hasUnsavedChanges()) {
    return true;
  }

  const dialog = inject(MatDialog);
  const ref = dialog.open(ConfirmDialogComponent, {
    data: {
      title: 'Leave without saving?',
      message: 'You have unsaved trip changes. If you leave now, those updates will be lost.',
      confirmLabel: 'Leave page',
      cancelLabel: 'Stay',
    },
  });

  return ref.afterClosed().pipe(map((confirmed) => !!confirmed));
};
