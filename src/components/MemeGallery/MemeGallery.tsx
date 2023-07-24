import React, { useEffect, useState } from "react";
import { useHelia } from "../../hooks/useHelia";
import { useWaku } from "../../hooks/useWaku";
import { MemeCard } from "../MemeCard/MemeCard";

import type { Unsubscribe } from "@waku/interfaces";
import { isNullOrUndef, isPromise } from "../../util";

export function MemeGallery(): React.ReactNode {
  const [memes, setMemes] = useState<string[]>([]);
  const { retrieveMeme } = useHelia();
  const { filterMemes, retrieveStoredMemes } = useWaku();
  const [unsubscribe, setUnsubscribe] = useState<Unsubscribe | undefined>();

  useEffect(() => {
    if (
      !isNullOrUndef(retrieveMeme) &&
      !isNullOrUndef(retrieveStoredMemes) &&
      !isNullOrUndef(filterMemes)
    ) {
      retrieveStoredMemes()
        .then(async (m) => {
          if (m !== null && m !== undefined) {
            const sources = [];
            for (const meme of m) {
              const src = await retrieveMeme(meme);
              if (src != null) {
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
              if (src != null) {
                setMemes([...memes, src.src]);
              }
            }),
          );
        })
        .catch((e) => {
          console.error(e);
        });
    }

    return () => {
      if (!isNullOrUndef(unsubscribe)) {
        const res = unsubscribe();
        if (isPromise<void>(res)) {
          res.catch((e) => console.error(e));
        }
      }
    };
  }, [memes, retrieveMeme, retrieveStoredMemes, filterMemes, unsubscribe]);

  if (memes.length === 0) {
    return <p>No memes to show</p>;
  }

  return (
    <div className="mx-4 columns-1 gap-[1.5em] sm:columns-2 md:columns-3">
      {memes.map((meme, i) => {
        const aspect = i % 3 === 0 || i % 4 === 0 ? "video" : "square";
        return <MemeCard key={meme} aspect={aspect} src={meme} />;
      })}
    </div>
  );
}
