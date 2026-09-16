import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-not-found',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, MatButtonModule],
  template: `
    <section class="wrap">
      <p>404</p>
      <h1>This page is off the map</h1>
      <p>The route you requested is not part of TripShare.</p>
      <a matButton="filled" routerLink="/">Back to home</a>
    </section>
  `,
  styles: `
    .wrap {
      min-height: 100vh;
      display: grid;
      place-content: center;
      text-align: center;
      gap: 0.6rem;
      padding: 2rem;
      background: var(--ts-bg);
    }
    h1, p { margin: 0; }
  `,
})
export class NotFoundComponent {}
