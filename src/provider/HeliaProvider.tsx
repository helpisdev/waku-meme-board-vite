import { unixfs, type UnixFS } from "@helia/unixfs";
import { defaultLibp2p } from "@waku/sdk";
import { IDBBlockstore } from "blockstore-idb";
import { IDBDatastore } from "datastore-idb";
import { createHelia } from "helia";
import { CID } from "multiformats";
import React, { createContext, useCallback, useEffect, useState } from "react";
import { formatToMimeMapping } from "../util";

import type { Helia } from "@helia/interface";
import type { HeliaInterface } from "../types/helia";
import type { Meme } from "../types/meme";
import type { ChildrenProp, NodeStatus } from "../types/type";

export const HeliaContext = createContext<HeliaInterface>({
  helia: null,
  fs: null,
  error: false,
  starting: true,
  id: null,
  status: "offline",
  addMeme: null,
  retrieveMeme: null,
});

const datastore = new IDBDatastore("waku-meme-board", {});
const blockstore = new IDBBlockstore("waku-meme-board", {});

async function closeIDBStores() {
  await datastore.close();
  await blockstore.close();
}

export function HeliaProvider({ children }: ChildrenProp): React.ReactNode {
  const [helia, setHelia] = useState<Helia | null>(null);
  const [fs, setFs] = useState<UnixFS | null>(null);
  const [starting, setStarting] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);
  const [id, setId] = useState<string | null>(null);
  const [status, setStatus] = useState<NodeStatus>("offline");

  const startHelia = useCallback(async () => {
    if (helia == null) {
      try {
        console.info("Starting Helia");
        await datastore.open();
        await blockstore.open();
        const libp2p = await defaultLibp2p();
        const helia = await createHelia({ datastore, blockstore, libp2p });
        setHelia(helia);
        setId(helia.libp2p.peerId.toString());
        const nodeIsOnline = helia.libp2p.isStarted();
        setStatus(nodeIsOnline ? "online" : "offline");
        setFs(unixfs(helia));
        setStarting(false);
      } catch (e) {
        console.error(e);
        setError(true);
      }
    }

    return () => {
      closeIDBStores();
    };
  }, [helia]);

  useEffect(() => {
    startHelia();
  }, [startHelia]);

  const addMeme = useCallback(
    async (data: Uint8Array): Promise<CID | null> => {
      if (fs == null) {
        return null;
      }
      const cid: CID = await fs.addBytes(data, {
        onProgress: (evt) => {
          console.info("add event", evt.type, evt.detail);
        },
      });

      return cid;
    },
    [fs],
  );

  const retrieveMeme = useCallback(
    async (meme: Meme): Promise<HTMLImageElement | null> => {
      const cid = meme.hash;
      const { format } = meme;
      const parsedCID = CID.parse(cid);
      if (fs == null) {
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
    },
    [fs],
  );

  return (
    <HeliaContext.Provider
      value={{
        helia,
        fs,
        error,
        starting,
        status,
        id,
        addMeme,
        retrieveMeme,
      }}
    >
      {children}
    </HeliaContext.Provider>
  );
}
