import { LightNode, PageDirection } from '@waku/interfaces';
import { useFilterMessages, useStoreMessages } from '@waku/react';
import { Decoder } from '@waku/sdk';
import React, { useCallback, useEffect, useRef, useState } from 'react';

import type { IMeme } from '../../types/interface';
import { MemeInfo, RetrieveMemeCallback } from '../../types/type';
import { MemeMessage } from '../../util';

interface Props {
  readonly node: LightNode | undefined;
  readonly decoder: Decoder;
  readonly retrieveMeme: RetrieveMemeCallback;
  readonly uploading: boolean;
}
export default function MemeGallery({
  node,
  decoder,
  retrieveMeme,
  uploading,
}: Props): React.ReactNode {
  const memes = useRef<MemeInfo[]>([]);
  const [fetched, setFetched] = useState<boolean>(false);
  const { error, messages, isLoading } = useFilterMessages({
    node,
    decoder,
  });
  const store = useStoreMessages({
    node,
    decoder,
    options: {
      pageDirection: PageDirection.BACKWARD,
    },
  });

  const filter = (sources: MemeInfo[]): MemeInfo[] => {
    return [...sources]
      .filter((meme) => meme.timestamp.valueOf() !== 0)
      .filter((meme, i, arr) => !arr.find((m, j) => j > i && meme.hash === m.hash))
      .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
      .reverse();
  };

  const retrieveMemes = useCallback(
    async function retrieveMemes() {
      if (!store.isLoading) {
        const results: IMeme[] = [];
        const query = store.messages;
        for (const meme of query) {
          if (meme) {
            const { hash, timestamp, format }: IMeme = MemeMessage.decode(
              meme.payload,
            ) as unknown as IMeme;

            results.push({ hash, timestamp, format });
          }
        }
        const sources: MemeInfo[] = [];
        for (const meme of results) {
          if (!memes.current.find((m) => m.hash === meme.hash)) {
            const src = await retrieveMeme(meme);
            if (src?.src) {
              sources.push({ src: src.src, ...meme });
            }
          }
        }

        const filtered = filter([...sources, ...memes.current]);
        memes.current = filtered;

        if (filtered.length !== 0) {
          setFetched(true);
        }
      }
      if (store.error) {
        console.error(store.error);
      }
    },
    [store.isLoading, store.messages, store.error, retrieveMeme],
  );

  useEffect(() => {
    retrieveMemes().catch((e) => {
      console.error(e);
    });
  }, [retrieveMemes]);

  const loadMemes = useCallback(
    async function loadMemes() {
      if (!isLoading) {
        for (const msg of messages) {
          if (msg.payload) {
            const meme = MemeMessage.decode(msg.payload) as unknown as IMeme;
            if (meme) {
              if (!memes.current.find((m) => m.hash === meme.hash)) {
                const src = await retrieveMeme(meme);
                if (src?.src) {
                  memes.current = filter([{ src: src.src, ...meme }, ...memes.current]);
                }
              }
            }
          }
        }
      }
      if (error) {
        console.error(error);
      }
    },
    [isLoading, error, messages, retrieveMeme],
  );

  useEffect(() => {
    loadMemes().catch((e) => {
      console.error(e);
    });
  }, [loadMemes]);

  useEffect(() => {}, [fetched]);

  if (memes.current.length === 0) {
    return (
      <p className='text-center text-3xl text-high-contrast dark:text-high-contrast-dark'>
        No memes to show 😢
      </p>
    );
  }

  if (uploading) {
    return (
      <div className='text-center text-3xl text-high-contrast dark:text-high-contrast-dark'>
        Uploading meme...
      </div>
    );
  }

  return (
    <div className='max-w-10xl mx-auto flex flex-row flex-wrap items-center justify-evenly gap-y-2'>
      {memes.current.map((meme) => (
        <img
          alt='gallery'
          className='b-6 max-w w-full max-w-sm break-inside-avoid rounded-lg border-4 border-ui-el-borders-and-focus-rings bg-app dark:border-ui-el-borders-and-focus-rings-dark dark:bg-app-dark'
          src={meme.src}
          key={meme.hash}
        />
      ))}
    </div>
  );
}
