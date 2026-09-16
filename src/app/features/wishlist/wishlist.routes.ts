import { Routes } from '@angular/router';
import { WishlistPageComponent } from './pages/wishlist-page.component';

export const WISHLIST_ROUTES: Routes = [
  {
    path: '',
    component: WishlistPageComponent,
    title: 'Wishlist · TripShare',
  },
];
