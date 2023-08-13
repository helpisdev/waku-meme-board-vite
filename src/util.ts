import type { Unsubscribe } from '@waku/interfaces';
import { Field, Type } from 'protobufjs';

import type { AcceptedMemeMime, RetrieveMemeCallback } from './types/type';
import { MemeImageExtension } from './types/type';

export const conf = {
  baseURL: 'https://waku-meme-board.helpis.dev/',
  description: 'Explore and post decentralized memes!',
  theme: {
    light: '#fdfdfc',
    dark: '#161615',
  },
  siteName: 'Waku Meme Board',
};

export function isAcceptedMemeFormatMime(mime: unknown): mime is AcceptedMemeMime {
  return !!(mime as AcceptedMemeMime);
}

// No builtin way to iterate enum values in TypeScript unfortunately
export const mimeToFormatMapping: Record<AcceptedMemeMime, MemeImageExtension> = {
  'image/png': MemeImageExtension.PNG,
  'image/jpg': MemeImageExtension.JPG,
  'image/gif': MemeImageExtension.GIF,
  'image/jpeg': MemeImageExtension.JPEG,
};

export const formatToMimeMapping: Record<MemeImageExtension, AcceptedMemeMime> = {
  [MemeImageExtension.PNG]: 'image/png',
  [MemeImageExtension.JPG]: 'image/jpg',
  [MemeImageExtension.GIF]: 'image/gif',
  [MemeImageExtension.JPEG]: 'image/jpeg',
};

export const MemeMessage = new Type('Meme')
  .add(new Field('timestamp', 1, 'uint64'))
  .add(new Field('hash', 2, 'string'))
  .add(new Field('format', 3, 'uint64'));

export const contentTopic = '/waku-meme-board/1/meme/proto';

export function isPromise<T>(val: unknown): val is Promise<T> {
  return val instanceof Promise;
}

export function isFunction<T>(fn: T | unknown): fn is T {
  return typeof fn === 'function';
}

export function isUnsubscribeCallback(cb: unknown): cb is Unsubscribe {
  return isFunction<Unsubscribe>(cb);
}

export function isRetrieveMemeCallback(cb: unknown): cb is RetrieveMemeCallback {
  return isFunction<RetrieveMemeCallback>(cb);
}
