import type React from 'react';

import DecentralizedNet from '../DecentralizedNet/DecentralizedNet';
import IPFS from '../IPFS/IPFS';
import MemeGallery from '../MemeGallery/MemeGallery';
import Waku from '../Waku/Waku';

export default function WakuApp(): React.ReactNode {
  return (
    <>
      <DecentralizedNet>
        <IPFS />
        <Waku />
      </DecentralizedNet>

      <MemeGallery />
    </>
  );
}
