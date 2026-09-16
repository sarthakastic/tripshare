import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-error-state',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatButtonModule, MatIconModule],
  template: `
    <div class="state" role="alert">
      <mat-icon aria-hidden="true">error_outline</mat-icon>
      <h2>{{ title() }}</h2>
      <p>{{ message() }}</p>
      @if (retryable()) {
        <button matButton="filled" type="button" (click)="retry.emit()">Retry</button>
      }
    </div>
  `,
  styles: `
    .state {
      display: grid;
      justify-items: center;
      text-align: center;
      gap: 0.65rem;
      padding: 2.25rem 1.25rem;
      border-radius: var(--ts-radius);
      background: color-mix(in srgb, var(--mat-sys-error) 8%, var(--ts-surface));
    }

    mat-icon {
      color: var(--mat-sys-error);
    }

    h2,
    p {
      margin: 0;
    }

    p {
      color: var(--ts-muted);
      max-width: 36rem;
    }
  `,
})
export class ErrorStateComponent {
  readonly title = input('Unable to load this view');
  readonly message = input('Please try again in a moment.');
  readonly retryable = input(true);
  readonly retry = output<void>();
}
