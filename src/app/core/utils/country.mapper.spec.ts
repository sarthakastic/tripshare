import { filterCountries, mapRestCountries } from './country.mapper';

describe('mapRestCountries', () => {
  it('maps API payloads into domain countries', () => {
    const countries = mapRestCountries([
      {
        cca3: 'JPN',
        cca2: 'JP',
        name: { common: 'Japan', official: 'Japan' },
        capital: ['Tokyo'],
        region: 'Asia',
        population: 125000000,
        latlng: [36, 138],
        currencies: { JPY: { name: 'Japanese yen', symbol: '¥' } },
        languages: { jpn: 'Japanese' },
      },
    ]);

    expect(countries).toHaveLength(1);
    expect(countries[0]?.code).toBe('JPN');
    expect(countries[0]?.capital).toBe('Tokyo');
    expect(countries[0]?.currencies[0]?.code).toBe('JPY');
    expect(countries[0]?.latitude).toBe(36);
  });

  it('skips records without a name or country code', () => {
    expect(mapRestCountries([{ name: { common: 'Nowhere' } }])).toEqual([]);
  });

  it('maps the public countries.dev payload shape', () => {
    const countries = mapRestCountries([
      {
        alpha3Code: 'ITA',
        alpha2Code: 'IT',
        name: 'Italy',
        officialName: 'Italian Republic',
        capital: 'Rome',
        region: 'Europe',
        population: 59000000,
        latlng: [42.5, 12.5],
        currencies: [{ code: 'EUR', name: 'Euro', symbol: '€' }],
        languages: [{ name: 'Italian' }],
        flags: { png: 'https://flagcdn.com/w320/it.png' },
      },
    ]);

    expect(countries[0]?.code).toBe('ITA');
    expect(countries[0]?.capital).toBe('Rome');
    expect(countries[0]?.currencies[0]?.code).toBe('EUR');
    expect(countries[0]?.languages).toEqual(['Italian']);
  });

  it('filters by name, capital, and region', () => {
    const countries = mapRestCountries([
      {
        cca3: 'JPN',
        cca2: 'JP',
        name: { common: 'Japan' },
        capital: ['Tokyo'],
        region: 'Asia',
      },
      {
        cca3: 'ITA',
        cca2: 'IT',
        name: { common: 'Italy' },
        capital: ['Rome'],
        region: 'Europe',
      },
    ]);

    expect(filterCountries(countries, 'tok').map((item) => item.code)).toEqual(['JPN']);
    expect(filterCountries(countries, '', 'Europe').map((item) => item.code)).toEqual(['ITA']);
  });
});
