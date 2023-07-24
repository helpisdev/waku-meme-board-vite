import type { UnixFS } from "@helia/unixfs";
import type { Helia } from "@helia/interface";
import type { CID } from "multiformats";
import type { Meme } from './meme';
import type { NodeStatus } from "./type";

type AddMemeCallback = (data: Uint8Array) => Promise<CID | null>;
type RetrieveMemeCallback = (meme: Meme) => Promise<HTMLImageElement | null>;

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