import { PageDirection, Protocols } from "@waku/interfaces";
import {
  createDecoder,
  createEncoder,
  createLightNode,
  waitForRemotePeer,
} from "@waku/sdk";
import { map } from "nanostores";
import {
  MemeMessage,
  contentTopic,
  isAcceptedMemeFormatMime,
  isRetrieveMemeCallback,
  mimeToFormatMapping,
} from "../util";

import type { IDecodedMessage, Unsubscribe, Waku } from "@waku/interfaces";
import type { Meme, MemeFormat } from "../types/meme";
import type { ReceiveMemeCallback, WakuInterface } from "../types/waku";
import { addMeme, libp2pOptions } from "./helia";

export const wakuStore = map<WakuInterface>({
  waku: null,
  error: false,
  starting: false,
  id: null,
  encoder: null,
  decoder: null,
  status: "offline",
  uploadMeme: null,
  uploadingMeme: false,
  retrieveStoredMemes: null,
  filterMemes: null,
});

export async function uploadMeme(
  hash: string,
  format: MemeFormat,
): Promise<void> {
  const store = wakuStore.get();
  const waku = store.waku;
  const encoder = store.encoder;

  if (
    waku !== undefined &&
    waku !== null &&
    encoder !== undefined &&
    encoder !== null
  ) {
    const proto = MemeMessage.create({
      timestamp: new Date(Date.now()),
      hash,
      format: format.valueOf(),
    });
    const memeData = MemeMessage.encode(proto).finish();

    await waku.lightPush.send(encoder, {
      payload: memeData,
      timestamp: new Date(Date.now()),
    });
  }
}

export async function retrieveStoredMemes(): Promise<Meme[]> {
  const store = wakuStore.get();
  const waku = store.waku;
  const decoder = store.decoder;

  const results: Meme[] = [];

  if (
    waku !== undefined &&
    waku !== null &&
    waku.store !== undefined &&
    waku.store !== null &&
    decoder !== undefined &&
    decoder !== null
  ) {
    const storeQuery = waku.store.queryGenerator([decoder], {
      pageDirection: PageDirection.BACKWARD,
    });

    for await (const futureMemes of storeQuery) {
      const memes = await Promise.all(futureMemes);

      for (const meme of memes) {
        if (meme !== undefined && meme !== null) {
          const { hash, timestamp, format }: Meme = MemeMessage.decode(
            meme.payload,
          ) as unknown as Meme;

          results.push({ hash, timestamp, format });
        }
      }
    }
  }

  return results;
}

export function decodeMeme(
  encodedMeme?: IDecodedMessage | undefined,
): Meme | null {
  if (
    encodedMeme === undefined ||
    encodedMeme === null ||
    encodedMeme?.payload === undefined ||
    encodedMeme?.payload === null
  ) {
    return null;
  }

  return MemeMessage.decode(encodedMeme.payload) as unknown as Meme;
}

export async function filterMemes(
  callback?: ReceiveMemeCallback | undefined,
): Promise<Unsubscribe | undefined> {
  const store = wakuStore.get();
  const waku = store.waku;
  const decoder = store.decoder;

  if (
    waku !== undefined &&
    waku !== null &&
    decoder !== undefined &&
    decoder !== null
  ) {
    return await waku.filter.subscribe([decoder], (msg: IDecodedMessage) => {
      const meme = decodeMeme(msg);

      if (
        meme !== null &&
        meme !== undefined &&
        isRetrieveMemeCallback(callback)
      ) {
        callback(meme);
      }
    });
  }

  return undefined;
}

export async function handleMemeSubmit(
  e: React.MouseEvent<HTMLButtonElement>,
): Promise<void> {
  e.preventDefault();
  wakuStore.setKey("uploadingMeme", true);
  const meme: HTMLElement | null = document.getElementById("uploader");

  try {
    if (meme !== undefined && meme !== null) {
      const memes = (meme as HTMLInputElement).files;

      if (memes !== undefined && memes !== null) {
        for (const m of memes) {
          const memeData = new Uint8Array(await m.arrayBuffer());
          const cid = await addMeme(memeData);

          if (cid !== undefined && cid !== null) {
            const mime = m.type;
            if (isAcceptedMemeFormatMime(mime)) {
              await uploadMeme(cid.toString(), mimeToFormatMapping[mime]);
            }
          }
        }
      }
      wakuStore.setKey("uploadingMeme", false);
      return;
    }
    wakuStore.setKey("uploadingMeme", "error");
    throw "Invalid file.";
  } catch (err) {
    console.error(err);
    wakuStore.setKey("uploadingMeme", "error");
    throw err;
  }
}

export async function startWaku(): Promise<void> {
  const store = wakuStore.get();
  const waku = store.waku;
  const starting = store.starting;

  if ((waku === null || waku === undefined) && !starting) {
    try {
      wakuStore.setKey("starting", true);
      console.info("Starting Waku");

      const waku = await createLightNode({
        defaultBootstrap: true,
        pubSubTopic: contentTopic,
        libp2p: await libp2pOptions(),
      });
      wakuStore.setKey("waku", waku);

      const enc = createEncoder({
        contentTopic,
        ephemeral: false,
      });
      wakuStore.setKey("encoder", enc);

      const dec = createDecoder(contentTopic);
      wakuStore.setKey("decoder", dec);

      wakuStore.setKey("id", waku.libp2p.peerId.toString());
      await waku.start();

      const nodeIsOnline = waku.libp2p.isStarted();
      wakuStore.setKey("status", nodeIsOnline ? "online" : "offline");

      await waitForRemotePeer(waku as unknown as Waku, [
        Protocols.Store,
        Protocols.LightPush,
        Protocols.Filter,
      ]);
      wakuStore.setKey("starting", false);
    } catch (e) {
      console.error(e);
      throw e;
    }
  }
}

/*
import {
  defaultLibp2p,
  defaultPeerDiscovery,
  WakuNode,
  waitForRemotePeer,
  createDecoder,
  waku
} from "https://unpkg.com/@waku/sdk@0.0.18/bundle/index.js";

const libp2p = await defaultLibp2p(undefined, {
  peerDiscovery: [defaultPeerDiscovery()],
});
const store = waku.wakuStore();
const node = new WakuNode({}, libp2p, store);

await node.start();

await waitForRemotePeer(node, ["store"]);

await node.store.queryOrderedCallback(
  [createDecoder("/relay-ping/1/ping/null")],
  callback,
  { pageDirection: "backward" }
);
*/
