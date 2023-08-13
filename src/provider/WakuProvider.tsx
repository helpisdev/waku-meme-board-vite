import { Helia } from '@helia/interface';
import { LightNode, Protocols } from '@waku/interfaces';
import { useCreateContentPair, useCreateLightNode } from '@waku/react';
import { LevelDatastore } from 'datastore-level';
import React from 'react';

import NodeLauncher from '../components/Node/NodeLauncher';
import { IHelia, IWaku } from '../types/interface';
import { AddMemeCallback, NodeStatus, RetrieveMemeCallback } from '../types/type';
import { contentTopic } from '../util';
import MemeProvider from './MemeProvider';

interface Props {
  readonly helia: IHelia & {
    addMeme: AddMemeCallback;
    retrieveMeme: RetrieveMemeCallback;
  };
}

export default function WakuProvider({ helia }: Props): React.ReactNode {
  const { node, error, isLoading } = useCreateLightNode({
    options: {
      defaultBootstrap: true,
      libp2p: {
        datastore: new LevelDatastore('meme-level-datastore', {
          prefix: 'waku-',
          createIfMissing: true,
          errorIfExists: false,
        }),
        start: true,
      },
    },
    protocols: [Protocols.Store, Protocols.LightPush, Protocols.Filter],
  });
  const { encoder, decoder } = useCreateContentPair(contentTopic, false);

  const waku = {
    node,
    error,
    isLoading,
    status: (node?.isStarted() ? 'online' : 'offline') as NodeStatus,
    id: node?.libp2p.peerId.toCID().toString(),
    encoder,
    decoder,
  };

  return (
    <div>
      <div className='px-6 text-center'>
        <div className='mb-10 flex content-center justify-center gap-5'>
          <NodeLauncher<IHelia, Helia> node={helia} network='Helia' />
          <NodeLauncher<IWaku, LightNode> node={waku} network='Waku' />
        </div>
      </div>
      {helia.node && waku.node && <MemeProvider helia={helia} waku={waku} />}
    </div>
  );
}
