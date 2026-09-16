import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { map } from 'rxjs';
import { LoadingService } from '../../core/services/loading.service';
import { ThemeService } from '../../core/services/theme.service';
import { WishlistStore } from '../../features/wishlist/services/wishlist.store';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatBadgeModule } from '@angular/material/badge';

@Component({
  selector: 'app-main-layout',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    MatButtonModule,
    MatIconModule,
    MatListModule,
    MatSidenavModule,
    MatToolbarModule,
    MatProgressBarModule,
    MatBadgeModule,
  ],
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.scss',
})
export class MainLayoutComponent {
  private readonly breakpoints = inject(BreakpointObserver);
  readonly loading = inject(LoadingService);
  readonly theme = inject(ThemeService);
  readonly wishlist = inject(WishlistStore);

  readonly isMobile = toSignal(
    this.breakpoints.observe([Breakpoints.Handset, Breakpoints.TabletPortrait]).pipe(map((state) => state.matches)),
    { initialValue: false },
  );

  readonly links = [
    { path: '/', label: 'Home', icon: 'home', exact: true },
    { path: '/explore', label: 'Explore', icon: 'explore', exact: false },
    { path: '/weather', label: 'Weather', icon: 'partly_cloudy_day', exact: false },
    { path: '/trips', label: 'Trips', icon: 'luggage', exact: false },
    { path: '/budget', label: 'Budget', icon: 'payments', exact: false },
    { path: '/currency', label: 'Currency', icon: 'currency_exchange', exact: false },
    { path: '/wishlist', label: 'Wishlist', icon: 'favorite', exact: false },
  ] as const;
}
