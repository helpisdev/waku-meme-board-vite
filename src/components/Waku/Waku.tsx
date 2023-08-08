import { useStore } from '@nanostores/react';
import type React from 'react';
import { useEffect, useState } from 'react';

import { startWaku, wakuStore } from '../../store/waku';
import NetworkConnector from '../NetworkConnector/NetworkConnector';
import Node from '../Node/Node';

export default function Waku(): React.ReactNode {
  const waku = useStore(wakuStore);
  const [started, setStarted] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    const online: boolean = waku.status === 'online';
    if (!online) {
      try {
        startWaku();
      } catch (err) {
        setError(true);
      }
      setStarted(true);
    }
  }, [waku, started, error]);

  if (error) {
    // Show error message
  }

  if (!started) {
    return <NetworkConnector network='Waku' />;
  }

  return <Node id={waku.id!} network='Waku' status={waku.status} />;
}
