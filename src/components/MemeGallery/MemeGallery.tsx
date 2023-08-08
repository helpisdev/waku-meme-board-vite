import { useStore } from '@nanostores/react';
import type { Unsubscribe } from '@waku/interfaces';
import React, { useEffect, useState } from 'react';

import { retrieveMeme } from '../../store/helia';
import { filterMemes, retrieveStoredMemes, wakuStore } from '../../store/waku';
import { isPromise, isUnsubscribeCallback } from '../../util';
import MemeCard from '../MemeCard/MemeCard';

export default function MemeGallery(): React.ReactNode {
  const waku = useStore(wakuStore);
  const [memes, setMemes] = useState<string[]>([]);
  const [unsubscribe, setUnsubscribe] = useState<Unsubscribe | undefined>();

  useEffect(() => {
    retrieveStoredMemes()
      .then(async (m) => {
        if (m) {
          const sources: Array<string> = [];

          for (const meme of m) {
            const src = await retrieveMeme(meme);

            if (src) {
              sources.push(src.src);
            }
          }

          setMemes(sources);
        }
      })
      .then(async () => {
        setUnsubscribe(
          await filterMemes(async (meme) => {
            const src = await retrieveMeme(meme);

            if (src) {
              setMemes([...memes, src.src]);
            }
          }),
        );
      })
      .catch((e) => {
        console.error(e);
      });

    return () => {
      if (isUnsubscribeCallback(unsubscribe)) {
        const res = unsubscribe();

        if (isPromise<void>(res)) {
          res.catch((e) => console.error(e));
        }
      }
    };
  }, [memes, unsubscribe]);

  if (waku.uploadingMeme && waku.uploadingMeme !== 'error') {
    return (
      <div>
        <div className='border-red-400 h-16 w-16 animate-spin rounded-full border-4 border-double' />
      </div>
    );
  }

  if (memes.length === 0) {
    return (
      <p className='text-center text-3xl text-high-contrast dark:text-high-contrast-dark'>
        No memes to show 😢
      </p>
    );
  }

  return (
    <div className='mx-4 columns-1 gap-[1.5em] sm:columns-2 md:columns-3'>
      {memes.map((meme, i) => {
        const aspect = i % 3 === 0 || i % 4 === 0 ? 'video' : 'square';
        return <MemeCard key={meme} aspect={aspect} src={meme} />;
      })}
    </div>
  );
}
