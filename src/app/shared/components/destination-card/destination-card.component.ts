import { DecimalPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { Country, Destination, toDestination } from '../../../core/models/country.model';
import { WishlistStore } from '../../../features/wishlist/services/wishlist.store';

@Component({
  selector: 'app-destination-card',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DecimalPipe, RouterLink, MatButtonModule, MatCardModule, MatIconModule],
  templateUrl: './destination-card.component.html',
  styleUrl: './destination-card.component.scss',
})
export class DestinationCardComponent {
  private readonly wishlist = inject(WishlistStore);
  readonly country = input.required<Country>();
  readonly wishlistToggled = output<Destination>();
  readonly saved = computed(() => this.wishlist.isWishlisted(this.country().code));

  toggleWishlist(): void {
    const destination = toDestination(this.country());
    this.wishlist.toggle(destination);
    this.wishlistToggled.emit(destination);
  }
}
