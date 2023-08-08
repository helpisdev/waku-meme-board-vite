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

  if (waku && encoder) {
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

  if (waku?.store && decoder) {
    const storeQuery = waku.store.queryGenerator([decoder], {
      pageDirection: PageDirection.BACKWARD,
    });

    for await (const futureMemes of storeQuery) {
      const memes = await Promise.all(futureMemes);

      for (const meme of memes) {
        if (meme) {
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
  if (!encodedMeme?.payload) {
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

  if (waku && decoder) {
    return await waku.filter.subscribe([decoder], (msg: IDecodedMessage) => {
      const meme = decodeMeme(msg);

      if (meme && isRetrieveMemeCallback(callback)) {
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
    if (meme) {
      const memes = (meme as HTMLInputElement).files;

      if (memes) {
        for (const m of memes) {
          const memeData = new Uint8Array(await m.arrayBuffer());
          const cid = await addMeme(memeData);

          if (cid) {
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

  if (!waku && !starting) {
    try {
      wakuStore.setKey("starting", true);
      console.info("Starting Waku");

      const waku = await createLightNode({
        defaultBootstrap: true,
        pubSubTopic: contentTopic,
        libp2p: await libp2pOptions,
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
