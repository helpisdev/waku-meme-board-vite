import { useStore } from '@nanostores/react';
import type React from 'react';
import { useEffect, useState } from 'react';

import { closeIDBStores, heliaStore, startHelia } from '../../store/helia';
import NetworkConnector from '../NetworkConnector/NetworkConnector';
import Node from '../Node/Node';

export default function IPFS(): React.ReactNode {
  const helia = useStore(heliaStore);
  const [started, setStarted] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);

  useEffect(() => {
    const online: boolean = helia.status === 'online';
    if (!online) {
      try {
        startHelia();
      } catch (err) {
        setError(true);
      }
      setStarted(true);
    }
  }, [helia, started, error]);

  useEffect(() => {
    return () => {
      closeIDBStores();
    };
  }, []);

  if (error) {
    // Show error message
  }

  if (!started) {
    return <NetworkConnector network='IPFS' />;
  }

  return <Node id={helia.id!} network='IPFS' status={helia.status} />;
}
