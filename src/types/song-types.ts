export type Song_Tag =
  'rainy' | 'marathi' | 'emotional' | 'latest' | 'art-of-living' | 'vikram-hazra' | 'rishi-nityapragya'
  | string;

export interface ISong {
  url: string;
  name: string;
  nameLocal?: string;
  tags: Song_Tag[];
  number: number;
  token: string;
}
