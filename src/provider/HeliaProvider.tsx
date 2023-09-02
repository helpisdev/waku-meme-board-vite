import type { Helia } from '@helia/interface';
import { UnixFS, unixfs } from '@helia/unixfs';
import { LightNode } from '@waku/sdk';
import { createHelia } from 'helia';
import { CID } from 'multiformats';
import type React from 'react';
import { useCallback, useEffect, useState } from 'react';

import Meme from '../components/Meme/Meme';
import NodeLauncher from '../components/Node/NodeLauncher';
import type { IHelia, ILibp2pOptionsWithBlockstore, IMeme, IWaku } from '../types/interface';
import type { AddMemeCallback, NodeStatus, RetrieveMemeCallback } from '../types/type';
import { formatToMimeMapping } from '../util';

interface Props {
  readonly waku: IWaku;
  readonly options: ILibp2pOptionsWithBlockstore | undefined;
}

function useCreateHeliaNode({ options }: Props): IHelia & {
  addMeme: AddMemeCallback;
  retrieveMeme: RetrieveMemeCallback;
} {
  const [helia, setHelia] = useState<Helia | undefined>();
  const [fs, setFs] = useState<UnixFS | undefined>();
  const [id, setId] = useState<string | undefined>();
  const [status, setStatus] = useState<NodeStatus>('offline');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean | unknown>(false);

  const startHelia = useCallback(
    async function startHelia(): Promise<void> {
      try {
        setIsLoading(true);

        const heliaNode = await createHelia({
          datastore: options?.datastore,
          blockstore: options?.blockstore,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          // libp2p: waku.node?.libp2p as any,
          start: true,
        });
        setHelia(heliaNode);
        setId(heliaNode.libp2p.peerId.toString());
        setStatus(heliaNode.libp2p.isStarted() ? 'online' : 'offline');
        setFs(unixfs(heliaNode));
      } catch (e) {
        console.error(e);
        setError(e);
      }

      setIsLoading(false);
    },
    [options?.datastore, options?.blockstore],
  );

  useEffect(() => {
    if (helia) {
      return;
    }
    startHelia();
  }, [startHelia, helia]);

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
    node: helia,
    error,
    isLoading,
    id,
    status,
    fs,
    addMeme,
    retrieveMeme,
  };
}

export default function HeliaProvider({ waku, options }: Props): React.ReactNode {
  const helia = useCreateHeliaNode({ waku, options });

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

  return (
    <div>
      <div className='px-6 text-center'>
        <div className='mb-10 flex content-center justify-center gap-5'>
          <NodeLauncher<IHelia, Helia> node={helia} network='Helia' />
          <NodeLauncher<IWaku, LightNode> node={waku} network='Waku' />
        </div>
      </div>
      {helia.node && waku.node && <Meme helia={helia} waku={waku} />}
    </div>
  );
}
