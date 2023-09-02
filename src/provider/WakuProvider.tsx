import { Protocols } from '@waku/interfaces';
import { useCreateContentPair, useCreateLightNode } from '@waku/react';
import { IDBBlockstore } from 'blockstore-idb';
import { IDBDatastore } from 'datastore-idb';
import React, { useCallback, useEffect, useState } from 'react';

import { ILibp2pOptionsWithBlockstore, IWaku } from '../types/interface';
import { NodeStatus } from '../types/type';
import { contentTopic } from '../util';
import HeliaProvider from './HeliaProvider';

function useCreateWakuNodeOptions(): ILibp2pOptionsWithBlockstore | undefined {
  const [libp2pOptions, setLibp2pOptions] = useState<ILibp2pOptionsWithBlockstore | undefined>();
  const [datastore, setDatastore] = useState<IDBDatastore | undefined>();
  const [blockstore, setBlockstore] = useState<IDBBlockstore | undefined>();

  const createOptions = useCallback(async function createOptions(): Promise<void> {
    try {
      const data = new IDBDatastore('meme-idb-datastore');
      const block = new IDBBlockstore('meme-idb-blockstore');
      await data.open();
      await block.open();
      setDatastore(data);
      setBlockstore(block);

      const opts = {
        datastore: data,
        blockstore: block,
        start: true,
      };
      setLibp2pOptions(opts);
    } catch (e) {
      console.error(e);
    }
  }, []);

  useEffect(() => {
    return () => {
      datastore?.close();
      blockstore?.close();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (libp2pOptions) {
      return;
    }
    createOptions();
  }, [createOptions, libp2pOptions]);

  return libp2pOptions;
}

export default function WakuProvider(): React.ReactNode {
  const libp2pOptions = useCreateWakuNodeOptions();
  const { node, error, isLoading } = useCreateLightNode({
    options: {
      defaultBootstrap: true,
      libp2p: libp2pOptions,
    },
    protocols: [Protocols.Store, Protocols.LightPush, Protocols.Filter],
  });
  const { encoder, decoder } = useCreateContentPair(contentTopic, false);

  const waku: IWaku = {
    node,
    error,
    isLoading,
    status: (node?.isStarted() ? 'online' : 'offline') as NodeStatus,
    id: node?.libp2p.peerId.toCID().toString(),
    encoder,
    decoder,
  };

  if (error) {
    console.error(error);
  }

  if (isLoading || error || !node) {
    return (
      <div className='w-1/2 px-6 pb-20 text-center'>
        <h4 className='mb-6 text-lg font-bold text-high-contrast dark:text-high-contrast-dark'>
          {error ? `An error occured: ${error}` : `Connecting to Waku...`}
        </h4>
      </div>
    );
  }

  return <HeliaProvider waku={waku} options={libp2pOptions} />;
}
