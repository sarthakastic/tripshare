import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-empty-state',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatIconModule],
  template: `
    <div class="state">
      <mat-icon aria-hidden="true">{{ icon() }}</mat-icon>
      <h2>{{ title() }}</h2>
      <p>{{ message() }}</p>
      <ng-content />
    </div>
  `,
  styles: `
    .state {
      display: grid;
      justify-items: center;
      text-align: center;
      gap: 0.5rem;
      padding: 2.5rem 1.25rem;
      border: 1px dashed var(--ts-border);
      border-radius: var(--ts-radius);
      background: color-mix(in srgb, var(--ts-surface) 80%, transparent);
    }

    mat-icon {
      font-size: 2.25rem;
      width: 2.25rem;
      height: 2.25rem;
      color: var(--ts-accent);
    }

    h2 {
      margin: 0.5rem 0 0;
      font-size: 1.25rem;
    }

    p {
      margin: 0;
      max-width: 36rem;
      color: var(--ts-muted);
    }
  `,
})
export class EmptyStateComponent {
  readonly title = input('Nothing to show yet');
  readonly message = input('Try another search or adjust your filters.');
  readonly icon = input('travel_explore');
}
