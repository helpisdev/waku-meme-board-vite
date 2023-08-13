import type { Helia } from '@helia/interface';
import { UnixFS, unixfs } from '@helia/unixfs';
import { defaultLibp2p } from '@waku/sdk';
import { IDBBlockstore } from 'blockstore-idb';
import { IDBDatastore } from 'datastore-idb';
import { createHelia } from 'helia';
import { CID } from 'multiformats';
import type React from 'react';
import { useCallback, useEffect, useState } from 'react';

import type { IHelia, IMeme, IPartiaLibp2pOptions } from '../types/interface';
import type { AddMemeCallback, NodeStatus, RetrieveMemeCallback } from '../types/type';
import { formatToMimeMapping } from '../util';
import WakuProvider from './WakuProvider';

function useCreateHeliaNode(): IHelia & {
  addMeme: AddMemeCallback;
  retrieveMeme: RetrieveMemeCallback;
} {
  const [node, setNode] = useState<Helia | undefined>();
  const [fs, setFs] = useState<UnixFS | undefined>();
  const [id, setId] = useState<string | undefined>();
  const [status, setStatus] = useState<NodeStatus>('offline');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean | unknown>(false);
  const [libp2pOptions, setLibp2pOptions] = useState<IPartiaLibp2pOptions | undefined>();
  const [datastore, setDatastore] = useState<IDBDatastore | undefined>();
  const [blockstore, setBlockstore] = useState<IDBBlockstore | undefined>();

  const startHelia = useCallback(async function startHelia(): Promise<void> {
    try {
      setIsLoading(true);

      const data = new IDBDatastore('meme-db-datastore', {
        prefix: 'helia-',
      });
      const block = new IDBBlockstore('meme-idb-blockstore', { prefix: 'waku-x-helia-' });
      await data.open();
      await block.open();
      setDatastore(data);
      setBlockstore(block);

      const opts = {
        datastore: data,
        start: true,
      };
      setLibp2pOptions(opts);

      const helia = await createHelia({
        datastore: data,
        blockstore: block,
        libp2p: await defaultLibp2p(undefined, opts),
        start: true,
      });
      setNode(helia);
      setId(helia.libp2p.peerId.toString());
      setStatus(helia.libp2p.isStarted() ? 'online' : 'offline');
      setFs(unixfs(helia));
    } catch (e) {
      console.error(e);
      setError(e);
    }

    setIsLoading(false);
  }, []);

  useEffect(() => {
    return () => {
      datastore?.close();
      blockstore?.close();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (node) {
      return;
    }
    startHelia();
  }, [startHelia, node]);

  const addMeme: AddMemeCallback = useCallback(
    async (data: Uint8Array): Promise<CID | undefined> => fs?.addBytes(data),
    [fs],
  );

  const retrieveMeme: RetrieveMemeCallback = useCallback(
    async (meme: IMeme): Promise<HTMLImageElement | undefined> => {
      const cid = meme.hash;
      const { format } = meme;
      const parsedCID = CID.parse(cid);

      if (!fs) {
        return undefined;
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

  return {
    node,
    error,
    isLoading,
    id,
    status,
    fs,
    libp2pOptions,
    addMeme,
    retrieveMeme,
  };
}

export default function HeliaProvider(): React.ReactNode {
  const helia = useCreateHeliaNode();

  if (helia.error) {
    console.error(helia.error);
  }

  if (helia.isLoading || helia.error || !helia.node) {
    return (
      <div className='w-1/2 px-6 pb-20 text-center'>
        <h4 className='mb-6 text-lg font-bold text-high-contrast dark:text-high-contrast-dark'>
          {helia.error ? `An error occured: ${helia.error}` : `Connecting to Helia...`}
        </h4>
      </div>
    );
  }

  return <WakuProvider helia={helia} />;
}
