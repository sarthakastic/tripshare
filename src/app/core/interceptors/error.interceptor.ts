import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { AppError } from '../models/app-error.model';
import { NotificationService } from '../services/notification.service';

function toUserMessage(error: HttpErrorResponse): string {
  if (error.status === 0) {
    return 'Unable to reach travel data services. Check your connection and try again.';
  }
  if (error.status === 404) {
    return 'No matching results were found.';
  }
  if (error.status === 429) {
    return 'Too many requests were sent. Please wait a moment and retry.';
  }
  if (error.status >= 500) {
    return 'A travel data service is temporarily unavailable. Please try again.';
  }
  return 'Something went wrong while loading travel information.';
}

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const notifications = inject(NotificationService);

  return next(req).pipe(
    catchError((error: unknown) => {
      const httpError = error instanceof HttpErrorResponse ? error : null;
      const message = httpError ? toUserMessage(httpError) : 'Something went wrong while loading travel information.';
      const status = httpError?.status ?? null;

      if (status === 0 || (status !== null && status >= 500)) {
        notifications.error(message);
      }

      console.error('[TripShare]', httpError ?? error);
      return throwError(() => new AppError(message, status, status === 0 || (status !== null && status >= 500)));
    }),
  );
};
