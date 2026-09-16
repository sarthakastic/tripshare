import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Country } from '../../../core/models/country.model';
import { DestinationSearchComponent } from '../../../shared/components/destination-search/destination-search.component';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state.component';
import { ErrorStateComponent } from '../../../shared/components/error-state/error-state.component';
import { LoadingStateComponent } from '../../../shared/components/loading-state/loading-state.component';
import { WeatherCardComponent } from '../../../shared/components/weather-card/weather-card.component';
import { WeatherForecastComponent } from '../../../shared/components/weather-forecast/weather-forecast.component';
import { WeatherFacade } from '../services/weather.facade';

@Component({
  selector: 'app-weather-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    DestinationSearchComponent,
    EmptyStateComponent,
    ErrorStateComponent,
    LoadingStateComponent,
    WeatherCardComponent,
    WeatherForecastComponent,
  ],
  templateUrl: './weather-page.component.html',
  styleUrl: './weather-page.component.scss',
})
export class WeatherPageComponent {
  readonly facade = inject(WeatherFacade);

  selectCountry(country: Country): void {
    this.facade.loadForCountry(country);
  }

  search(query: string): void {
    this.facade.loadByName(query);
  }
}
