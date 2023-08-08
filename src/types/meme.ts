export interface Meme {
  timestamp: Date;
  hash: string;
  format: MemeFormat;
}

export const enum MemeFormat {
  JPG = 0,
  JPEG = 1,
  PNG = 2,
  GIF = 3,
}

export type AcceptedMemeFormatMime = 'image/gif' | 'image/jpeg' | 'image/jpg' | 'image/png';
