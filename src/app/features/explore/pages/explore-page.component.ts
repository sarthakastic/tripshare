import { ChangeDetectionStrategy, Component, DestroyRef, OnInit, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { debounceTime, distinctUntilChanged, map, startWith, switchMap, tap } from 'rxjs';
import { SEARCH_DEBOUNCE_MS } from '../../../core/constants/featured-destinations';
import { WORLD_REGIONS } from '../../../core/constants/regions';
import { Country } from '../../../core/models/country.model';
import { DestinationCardComponent } from '../../../shared/components/destination-card/destination-card.component';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state.component';
import { ErrorStateComponent } from '../../../shared/components/error-state/error-state.component';
import { LoadingStateComponent } from '../../../shared/components/loading-state/loading-state.component';
import { ExploreFacade } from '../services/explore.facade';

@Component({
  selector: 'app-explore-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    DestinationCardComponent,
    EmptyStateComponent,
    ErrorStateComponent,
    LoadingStateComponent,
  ],
  templateUrl: './explore-page.component.html',
  styleUrl: './explore-page.component.scss',
})
export class ExplorePageComponent implements OnInit {
  private readonly facade = inject(ExploreFacade);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

  readonly regions = WORLD_REGIONS;
  readonly countries = signal<Country[]>([]);
  readonly loading = this.facade.loading;
  readonly error = this.facade.error;

  readonly filters = new FormGroup({
    query: new FormControl('', { nonNullable: true }),
    region: new FormControl('', { nonNullable: true }),
  });

  ngOnInit(): void {
    const query = this.route.snapshot.queryParamMap.get('q') ?? '';
    const region = this.route.snapshot.queryParamMap.get('region') ?? '';
    this.filters.patchValue({ query, region }, { emitEvent: false });

    this.filters.valueChanges
      .pipe(
        startWith(this.filters.getRawValue()),
        debounceTime(SEARCH_DEBOUNCE_MS),
        map((value) => ({ query: value.query?.trim() ?? '', region: value.region ?? '' })),
        distinctUntilChanged((a, b) => a.query === b.query && a.region === b.region),
        tap((value) => {
          void this.router.navigate([], {
            relativeTo: this.route,
            queryParams: { q: value.query || null, region: value.region || null },
            queryParamsHandling: 'merge',
            replaceUrl: true,
          });
        }),
        switchMap((value) => this.facade.search(value.query, value.region)),
        tap(() => this.facade.loading.set(false)),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((countries) => this.countries.set(countries));
  }

  clearFilters(): void {
    this.filters.setValue({ query: '', region: '' });
  }
}
