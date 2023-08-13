import type { PeerDiscovery } from '@libp2p/interface-peer-discovery';
import type { Libp2pComponents, Unsubscribe } from '@waku/interfaces';
import type { CID } from 'multiformats';

import type { IMeme } from './interface';

export const enum MemeImageExtension {
  JPG = 0,
  JPEG = 1,
  PNG = 2,
  GIF = 3,
}

export type Aspect = 'square' | 'video';
export type Theme = 'dark' | 'light';
export type NodeStatus = 'offline' | 'online';
export type AcceptedMemeMime = 'image/gif' | 'image/jpeg' | 'image/jpg' | 'image/png';

export type ToggleThemeCallback = (theme?: Theme | undefined) => void;
export type UploadMemeCallback = (hash: string, format: MemeImageExtension) => Promise<void>;
export type UploadMemeNotifier = (err?: unknown | undefined) => Promise<void>;
export type RetrieveStoredMemesCallback = () => Promise<IMeme[]>;
export type FilterMemesCallback = (
  callback?: ReceiveMemeCallback | undefined,
) => Promise<Unsubscribe | undefined>;
export type ReceiveMemeCallback = (meme: IMeme) => void;
export type AddMemeCallback = (data: Uint8Array) => Promise<CID | undefined>;
export type RetrieveMemeCallback = (meme: IMeme) => Promise<HTMLImageElement | undefined>;
export type Libp2pPeerDiscovery = (components: Partial<Libp2pComponents>) => PeerDiscovery;
export type MemeInfo = IMeme & { src: string };
