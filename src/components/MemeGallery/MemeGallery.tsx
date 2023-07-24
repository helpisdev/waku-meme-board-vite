import { useEffect, useState } from "react";
import { useHelia } from "../../hooks/useHelia";
import { useWaku } from "../../hooks/useWaku";
import { MemeCard } from "../MemeCard/MemeCard";

import type { Unsubscribe } from "@waku/interfaces";

export function MemeGallery() {
  const [memes, setMemes] = useState<string[]>([]);
  const { retrieveMeme } = useHelia();
  const { filterMemes, retrieveStoredMemes } = useWaku();
  let unsubscribe: Unsubscribe | undefined;

  useEffect(() => {
    if (retrieveMeme && retrieveStoredMemes && filterMemes) {
      retrieveStoredMemes()
        .then(async (m) => {
          if (m) {
            const sources = [];
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
          unsubscribe = await filterMemes(async (meme) => {
            const src = await retrieveMeme(meme);
            if (src) {
              setMemes([...memes, src.src]);
            }
          });
        });
    }

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [memes, retrieveMeme, retrieveStoredMemes, filterMemes]);

  if (memes.length == 0) {
    return <p>No memes to show</p>;
  }

  return (
    <div className="mx-4 columns-1 gap-[1.5em] sm:columns-2 md:columns-3">
      {memes.map((meme, i) => {
        const aspect = i % 3 == 0 || i % 4 == 0 ? "video" : "square";
        return <MemeCard src={meme} aspect={aspect} />;
      })}
    </div>
  );
}
