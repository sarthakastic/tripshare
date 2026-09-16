import { Country, CountryCurrency } from '../models/country.model';

interface NamedLanguage {
  name?: string;
}

interface NamedCurrency {
  code?: string;
  name?: string;
  symbol?: string;
}

export interface RestCountryResponse {
  cca3?: string;
  cca2?: string;
  alpha3Code?: string;
  alpha2Code?: string;
  name?: string | { common?: string; official?: string };
  nativeName?: string;
  officialName?: string;
  capital?: string | string[];
  region?: string;
  subregion?: string;
  population?: number;
  area?: number;
  languages?: Record<string, string> | NamedLanguage[];
  currencies?: Record<string, { name?: string; symbol?: string }> | NamedCurrency[];
  flags?: {
    png?: string;
    svg?: string;
    alt?: string;
  };
  flag?: string;
  maps?: {
    googleMaps?: string;
    openStreetMaps?: string;
  };
  timezones?: string[];
  borders?: string[];
  latlng?: number[];
}

function readName(raw: RestCountryResponse): { common: string; official: string } | null {
  if (typeof raw.name === 'string' && raw.name.trim()) {
    return { common: raw.name.trim(), official: raw.officialName?.trim() || raw.nativeName?.trim() || raw.name.trim() };
  }
  if (raw.name && typeof raw.name === 'object') {
    const common = raw.name.common?.trim();
    if (!common) {
      return null;
    }
    return { common, official: raw.name.official?.trim() || common };
  }
  return null;
}

function readCapital(capital: string | string[] | undefined): string {
  if (Array.isArray(capital)) {
    return capital[0] ?? '—';
  }
  return capital?.trim() || '—';
}

function readLanguages(languages: RestCountryResponse['languages']): string[] {
  if (Array.isArray(languages)) {
    return languages.map((item) => item.name).filter((name): name is string => Boolean(name));
  }
  return Object.values(languages ?? {});
}

function readCurrencies(currencies: RestCountryResponse['currencies']): CountryCurrency[] {
  if (Array.isArray(currencies)) {
    return currencies
      .filter((item) => item.code)
      .map((item) => ({
        code: item.code ?? '',
        name: item.name ?? item.code ?? '',
        symbol: item.symbol ?? '',
      }));
  }
  return Object.entries(currencies ?? {}).map(([code, value]) => ({
    code,
    name: value.name ?? code,
    symbol: value.symbol ?? '',
  }));
}

function flagUrl(cca2: string, png?: string): string {
  if (png) {
    return png;
  }
  return cca2 ? `https://flagcdn.com/w320/${cca2.toLowerCase()}.png` : '';
}

export function mapRestCountry(raw: RestCountryResponse): Country | null {
  const code = (raw.cca3 ?? raw.alpha3Code)?.trim();
  const names = readName(raw);
  if (!code || !names) {
    return null;
  }

  const cca2 = (raw.cca2 ?? raw.alpha2Code ?? '').trim();
  const [latitude = 0, longitude = 0] = raw.latlng ?? [];
  const mapsGoogle =
    raw.maps?.googleMaps ??
    (latitude || longitude ? `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}` : '');

  return {
    code,
    cca2,
    name: names.common,
    officialName: names.official,
    capital: readCapital(raw.capital),
    region: raw.region ?? 'Unknown',
    subregion: raw.subregion ?? '—',
    population: raw.population ?? 0,
    area: raw.area ?? 0,
    languages: readLanguages(raw.languages),
    currencies: readCurrencies(raw.currencies),
    flagPng: flagUrl(cca2, raw.flags?.png),
    flagSvg: raw.flags?.svg ?? (typeof raw.flag === 'string' && raw.flag.startsWith('http') ? raw.flag : ''),
    flagAlt: raw.flags?.alt ?? `Flag of ${names.common}`,
    mapsGoogle,
    mapsOsm: raw.maps?.openStreetMaps ?? '',
    timezones: raw.timezones ?? [],
    borders: raw.borders ?? [],
    latitude,
    longitude,
  };
}

export function mapRestCountries(raw: RestCountryResponse[] | RestCountryResponse): Country[] {
  const list = Array.isArray(raw) ? raw : [raw];
  return list
    .map(mapRestCountry)
    .filter((country): country is Country => country !== null)
    .sort((a, b) => a.name.localeCompare(b.name));
}

export function filterCountries(countries: Country[], query: string, region = ''): Country[] {
  const needle = query.trim().toLowerCase();
  return countries.filter((country) => {
    const matchesRegion = !region || country.region === region;
    const matchesQuery =
      !needle ||
      country.name.toLowerCase().includes(needle) ||
      country.officialName.toLowerCase().includes(needle) ||
      country.capital.toLowerCase().includes(needle) ||
      country.code.toLowerCase() === needle;
    return matchesRegion && matchesQuery;
  });
}
