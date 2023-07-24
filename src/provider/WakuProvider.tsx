import { useEffect, useState, useCallback, createContext } from "react";
import { MemeMessage, contentTopic } from "../util";
import {
  createLightNode,
  createEncoder,
  createDecoder,
  waitForRemotePeer,
} from "@waku/sdk";
import { Protocols } from "@waku/interfaces";

import type {
  LightNode,
  Unsubscribe,
  IDecodedMessage,
  Waku,
} from "@waku/interfaces";
import type { Encoder, Decoder } from "@waku/sdk";
import type {
  ChildrenProp,
  NodeStatus,
  Meme,
  WakuInterface,
  MemeFormat,
  ReceiveMemeCallback,
} from "../type";

export const WakuContext = createContext<WakuInterface>({
  waku: null,
  error: false,
  starting: true,
  id: null,
  encoder: null,
  decoder: null,
  status: "offline",
  uploadMeme: null,
  retrieveStoredMemes: null,
  filterMemes: null,
});

export function WakuProvider({ children }: ChildrenProp) {
  const [waku, setWaku] = useState<LightNode | null>(null);
  const [encoder, setEncoder] = useState<Encoder | null>(null);
  const [decoder, setDecoder] = useState<Decoder | null>(null);
  const [starting, setStarting] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);
  const [id, setId] = useState<string | null>(null);
  const [status, setStatus] = useState<NodeStatus>("offline");

  async function uploadMeme(hash: string, format: MemeFormat) {
    if (waku && encoder) {
      const proto = MemeMessage.create({
        timestamp: Date.now(),
        hash: hash,
        format: format.valueOf(),
      });
      const memeData = MemeMessage.encode(proto).finish();
      await (waku as LightNode).lightPush.send(encoder, {
        payload: memeData,
      });
    }
  }

  async function retrieveStoredMemes(): Promise<Meme[]> {
    const results: Array<Meme> = [];

    if (waku && decoder) {
      const storeQuery = waku.store.queryGenerator([decoder], {});

      for await (const futureMemes of storeQuery) {
        const memes = await Promise.all(futureMemes);
        for (const meme of memes) {
          if (meme) {
            const { hash, timestamp, format }: Meme = MemeMessage.decode(
              meme.payload
            ) as unknown as Meme;
            results.push({ hash, timestamp, format });
          }
        }
      }
    }

    return results;
  }

  function decodeMeme(encodedMeme?: IDecodedMessage | undefined): Meme | null {
    if (!encodedMeme?.payload) {
      return null;
    }
    return MemeMessage.decode(encodedMeme.payload) as unknown as Meme;
  }

  async function filterMemes(
    callback?: ReceiveMemeCallback | undefined
  ): Promise<Unsubscribe | undefined> {
    if (waku && decoder) {
      return await waku.filter.subscribe([decoder], (msg: IDecodedMessage) => {
        const meme = decodeMeme(msg);
        if (meme && callback) {
          callback(meme);
        }
      });
    }

    return undefined;
  }

  const startWaku = useCallback(async () => {
    if (!waku) {
      try {
        console.info("Starting Waku");
        const waku = await createLightNode({ defaultBootstrap: true });
        setWaku(waku);

        const encoder = createEncoder({
          contentTopic: contentTopic,
          ephemeral: false,
        });
        setEncoder(encoder);

        const decoder = createDecoder(contentTopic);
        setDecoder(decoder);

        setId(waku.libp2p.peerId.toString());
        await waku.start();
        setStarting(false);
        const nodeIsOnline = waku.libp2p.isStarted();
        setStatus(nodeIsOnline ? "online" : "offline");

        await waitForRemotePeer(waku as unknown as Waku, [
          Protocols.Store,
          Protocols.LightPush,
          Protocols.Filter,
        ]);
      } catch (e) {
        console.error(e);
        setError(true);
      }
    }
  }, []);

  useEffect(() => {
    startWaku();
  }, []);

  return (
    <WakuContext.Provider
      value={{
        waku,
        encoder,
        decoder,
        error,
        starting,
        status,
        id,
        uploadMeme,
        retrieveStoredMemes,
        filterMemes,
      }}
    >
      {children}
    </WakuContext.Provider>
  );
}
