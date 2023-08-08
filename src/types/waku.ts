import type { LightNode, Unsubscribe } from "@waku/interfaces";
import type { Decoder, Encoder } from "@waku/sdk";
import type { Meme, MemeFormat } from "./meme";
import type { NodeStatus } from "./type";

export type UploadMemeCallback = (
  hash: string,
  format: MemeFormat,
) => Promise<void>;
export type RetrieveStoredMemesCallback = () => Promise<Meme[]>;
export type FilterMemesCallback = (
  callback?: ReceiveMemeCallback | undefined,
) => Promise<Unsubscribe | undefined>;
export type ReceiveMemeCallback = (meme: Meme) => void;

export interface WakuInterface {
  waku?: LightNode | null;
  encoder?: Encoder | null;
  decoder?: Decoder | null;
  error: boolean;
  starting: boolean;
  id?: string | null;
  status: NodeStatus;
  uploadMeme?: UploadMemeCallback | null;
  uploadingMeme: boolean | "error";
  retrieveStoredMemes?: RetrieveStoredMemesCallback | null;
  filterMemes?: FilterMemesCallback | null;
}
