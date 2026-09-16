import { Injectable, inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private readonly snackBar = inject(MatSnackBar);

  success(message: string): void {
    this.snackBar.open(message, 'Dismiss', { duration: 3200, panelClass: ['ts-snack-success'] });
  }

  error(message: string): void {
    this.snackBar.open(message, 'Dismiss', { duration: 4200, panelClass: ['ts-snack-error'] });
  }

  info(message: string): void {
    this.snackBar.open(message, 'Dismiss', { duration: 3000 });
  }
}
