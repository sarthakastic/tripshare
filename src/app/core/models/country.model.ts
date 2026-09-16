export interface CountryCurrency {
  code: string;
  name: string;
  symbol: string;
}

export interface Country {
  code: string;
  cca2: string;
  name: string;
  officialName: string;
  capital: string;
  region: string;
  subregion: string;
  population: number;
  area: number;
  languages: string[];
  currencies: CountryCurrency[];
  flagPng: string;
  flagSvg: string;
  flagAlt: string;
  mapsGoogle: string;
  mapsOsm: string;
  timezones: string[];
  borders: string[];
  latitude: number;
  longitude: number;
}

export type Destination = Pick<
  Country,
  'code' | 'name' | 'capital' | 'region' | 'population' | 'flagPng' | 'flagAlt' | 'cca2'
>;

export function toDestination(country: Country): Destination {
  return {
    code: country.code,
    name: country.name,
    capital: country.capital,
    region: country.region,
    population: country.population,
    flagPng: country.flagPng,
    flagAlt: country.flagAlt,
    cca2: country.cca2,
  };
}
