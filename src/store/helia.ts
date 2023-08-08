import { unixfs } from "@helia/unixfs";
import { defaultLibp2p, defaultPeerDiscovery } from "@waku/sdk";
import { IDBBlockstore } from "blockstore-idb";
import { IDBDatastore } from "datastore-idb";
import { createHelia } from "helia";
import { CID } from "multiformats";
import { map } from "nanostores";
import { formatToMimeMapping } from "../util";

import type { HeliaInterface } from "../types/helia";
import type { Meme } from "../types/meme";

export const heliaStore = map<HeliaInterface>({
  helia: null,
  fs: null,
  error: false,
  starting: false,
  id: null,
  status: "offline",
  addMeme: null,
  retrieveMeme: null,
});

const datastore = new IDBDatastore("waku-meme-board", {});
const blockstore = new IDBBlockstore("waku-meme-board", {});

async function createLibp2pOptions() {
  await datastore.open();
  await blockstore.open();

  return {
    peerDiscovery: [defaultPeerDiscovery()],
    datastore,
  };
}

export const libp2pOptions = createLibp2pOptions();

export async function closeIDBStores() {
  await datastore.close();
  await blockstore.close();
}

export async function startHelia(): Promise<void> {
  const store = heliaStore.get();
  const helia = store.helia;
  const starting = store.starting;

  if ((helia === null || helia === undefined) && !starting) {
    try {
      heliaStore.setKey("starting", true);
      console.info("Starting Helia");

      const libp2p = await defaultLibp2p(undefined, await libp2pOptions);
      const helia = await createHelia({ datastore, blockstore, libp2p });

      heliaStore.setKey("helia", helia);
      heliaStore.setKey("id", helia.libp2p.peerId.toString());

      const nodeIsOnline = helia.libp2p.isStarted();

      heliaStore.setKey("status", nodeIsOnline ? "online" : "offline");
      heliaStore.setKey("fs", unixfs(helia));
      heliaStore.setKey("starting", false);
    } catch (e) {
      console.error(e);
      throw e;
    }
  }
}

export async function addMeme(data: Uint8Array): Promise<CID | null> {
  const store = heliaStore.get();
  const fs = store.fs;

  if (fs === null || fs === undefined) {
    return null;
  }

  const cid: CID = await fs.addBytes(data, {
    onProgress: (evt) => {
      console.info("add event", evt.type, evt.detail);
    },
  });

  return cid;
}

export async function retrieveMeme(
  meme: Meme,
): Promise<HTMLImageElement | null> {
  const store = heliaStore.get();
  const fs = store.fs;
  const cid = meme.hash;
  const { format } = meme;
  const parsedCID = CID.parse(cid);

  if (fs === null || fs === undefined) {
    return null;
  }

  let bytes: Uint8Array = new Uint8Array();
  for await (const chunk of fs.cat(parsedCID)) {
    bytes = new Uint8Array([...bytes, ...chunk]);
  }

  const mime = formatToMimeMapping[format];
  const blob = new Blob([bytes], { type: mime });

  const imageUrl = URL.createObjectURL(blob);
  const image = new Image();
  image.src = imageUrl;

  return image;
}
