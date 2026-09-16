import { describeWeatherCode } from './weather-code';

describe('describeWeatherCode', () => {
  it('returns a known condition for WMO codes', () => {
    expect(describeWeatherCode(0).condition).toBe('Clear sky');
    expect(describeWeatherCode(95).icon).toBe('thunderstorm');
  });

  it('falls back for unknown codes', () => {
    expect(describeWeatherCode(1234).condition).toContain('Unknown');
  });
});
