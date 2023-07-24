import type * as React from 'react';
import type { UnixFS } from "@helia/unixfs";
import type { Helia } from "@helia/interface";
import type { CID } from "multiformats";
import type { LightNode, Unsubscribe } from "@waku/interfaces";
import type { Encoder, Decoder } from "@waku/sdk"

export interface ChildrenProp {
  children: React.ReactNode;
}

export type Music = "song" | "album" | "playlist" | "radio_station";
export type Video = "movie" | "episode" | "tv_show" | "other";
export type OtherType = "article" | "book" | "profile" | "website";
export type ObjectType = OtherType | `music.${Music}` | `video.${Video}`;
export type CardType = "summary" | "summary_large_image" | "app" | "player";

export type Aspect = "video" | "square";

export type Theme = "light" | "dark";
export type ToggleThemeCallback = (theme?: Theme | undefined) => void;

export type NodeStatus = "online" | "offline";

export interface Meme {
  timestamp: Date,
  hash: string,
  format: MemeFormat,
}

export const enum MemeFormat {
  JPG = 0,
  JPEG = 1,
  PNG = 2,
  GIF = 3,
}

export type AcceptedMemeFormatMime = "image/png" | "image/jpg" | "image/gif" | "image/jpeg";

type AddMemeCallback = (data: Uint8Array) => Promise<CID | null>;
type RetrieveMemeCallback = (meme: Meme) => Promise<HTMLImageElement | null>;
type UploadMemeCallback = (hash: string, format: MemeFormat) => void;
type RetrieveStoredMemesCallback = () => Promise<Meme[]>;
type FilterMemesCallback = (callback?: ReceiveMemeCallback | undefined) => Promise<Unsubscribe | undefined>;
export type ReceiveMemeCallback = (meme: Meme) => void;

export interface HeliaInterface {
  helia?: Helia | null;
  fs: UnixFS | null;
  error: boolean;
  starting: boolean;
  id?: string | null;
  status: NodeStatus;
  addMeme?: AddMemeCallback | null;
  retrieveMeme?: RetrieveMemeCallback | null;
}

export interface WakuInterface {
  waku?: LightNode | null;
  encoder?: Encoder | null;
  decoder?: Decoder | null;
  error: boolean;
  starting: boolean;
  id?: string | null;
  status: NodeStatus;
  uploadMeme?: UploadMemeCallback | null;
  retrieveStoredMemes?: RetrieveStoredMemesCallback | null;
  filterMemes?: FilterMemesCallback | null;
}
