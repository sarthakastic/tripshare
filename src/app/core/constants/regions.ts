export const WORLD_REGIONS = ['Africa', 'Americas', 'Asia', 'Europe', 'Oceania'] as const;

export type WorldRegion = (typeof WORLD_REGIONS)[number];

export interface RegionPreview {
  name: WorldRegion;
  description: string;
  icon: string;
}

export const REGION_PREVIEWS: readonly RegionPreview[] = [
  { name: 'Asia', description: 'Temples, street food, and vast landscapes', icon: 'temple_buddhist' },
  { name: 'Europe', description: 'Historic cities and coastal villages', icon: 'castle' },
  { name: 'Africa', description: 'Savannahs, markets, and coastlines', icon: 'public' },
  { name: 'Americas', description: 'National parks and vibrant capitals', icon: 'landscape' },
  { name: 'Oceania', description: 'Islands, reefs, and open skies', icon: 'water' },
];
