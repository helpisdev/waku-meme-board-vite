import { Protocols } from "@waku/interfaces";
import {
  createDecoder,
  createEncoder,
  createLightNode,
  waitForRemotePeer,
} from "@waku/sdk";
import type React from "react";
import { createContext, useCallback, useEffect, useState } from "react";
import { MemeMessage, contentTopic } from "../util";

import type {
  IDecodedMessage,
  LightNode,
  Unsubscribe,
  Waku,
} from "@waku/interfaces";
import type { Decoder, Encoder } from "@waku/sdk";
import type { Meme, MemeFormat } from "../types/meme";
import type { ChildrenProp, NodeStatus } from "../types/type";
import type { ReceiveMemeCallback, WakuInterface } from "../types/waku";

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

export function WakuProvider({ children }: ChildrenProp): React.ReactNode {
  const [waku, setWaku] = useState<LightNode | null>(null);
  const [encoder, setEncoder] = useState<Encoder | null>(null);
  const [decoder, setDecoder] = useState<Decoder | null>(null);
  const [starting, setStarting] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);
  const [id, setId] = useState<string | null>(null);
  const [status, setStatus] = useState<NodeStatus>("offline");

  const uploadMeme = useCallback(
    async (hash: string, format: MemeFormat) => {
      if (waku != null && encoder != null) {
        const proto = MemeMessage.create({
          timestamp: Date.now(),
          hash,
          format: format.valueOf(),
        });
        const memeData = MemeMessage.encode(proto).finish();
        await waku.lightPush.send(encoder, {
          payload: memeData,
        });
      }
    },
    [waku, encoder],
  );

  const retrieveStoredMemes = useCallback(async (): Promise<Meme[]> => {
    const results: Meme[] = [];

    if (waku != null && decoder != null) {
      const storeQuery = waku.store.queryGenerator([decoder], {});

      for await (const futureMemes of storeQuery) {
        const memes = await Promise.all(futureMemes);
        for (const meme of memes) {
          if (meme != null) {
            const { hash, timestamp, format }: Meme = MemeMessage.decode(
              meme.payload,
            ) as unknown as Meme;
            results.push({ hash, timestamp, format });
          }
        }
      }
    }

    return results;
  }, [waku, decoder]);

  const decodeMeme = useCallback(
    (encodedMeme?: IDecodedMessage | undefined): Meme | null => {
      if (encodedMeme?.payload == null) {
        return null;
      }
      return MemeMessage.decode(encodedMeme.payload) as unknown as Meme;
    },
    [],
  );

  const filterMemes = useCallback(
    async (
      callback?: ReceiveMemeCallback | undefined,
    ): Promise<Unsubscribe | undefined> => {
      if (waku != null && decoder != null) {
        return await waku.filter.subscribe(
          [decoder],
          (msg: IDecodedMessage) => {
            const meme = decodeMeme(msg);
            if (meme != null && callback != null) {
              callback(meme);
            }
          },
        );
      }

      return undefined;
    },
    [waku, decoder, decodeMeme],
  );

  const startWaku = useCallback(async () => {
    if (waku == null) {
      try {
        console.info("Starting Waku");
        const waku = await createLightNode({ defaultBootstrap: true });
        setWaku(waku);

        const enc = createEncoder({
          contentTopic,
          ephemeral: false,
        });
        setEncoder(enc);

        const dec = createDecoder(contentTopic);
        setDecoder(dec);

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
  }, [waku]);

  useEffect(() => {
    startWaku().catch((e) => {
      console.error(e);
    });
  }, [startWaku]);

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
