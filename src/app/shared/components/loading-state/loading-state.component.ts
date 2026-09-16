import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-loading-state',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatProgressSpinnerModule],
  template: `
    <div class="state" role="status" [attr.aria-label]="label()">
      <mat-progress-spinner diameter="42" mode="indeterminate" />
      <p>{{ label() }}</p>
    </div>
  `,
  styles: `
    .state {
      display: grid;
      justify-items: center;
      gap: 1rem;
      padding: 2.5rem 1rem;
      color: var(--ts-muted);
    }
  `,
})
export class LoadingStateComponent {
  readonly label = input('Loading travel information…');
}
