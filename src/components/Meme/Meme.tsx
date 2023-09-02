import type React from 'react';
import { useState } from 'react';

import { IHelia, IWaku } from '../../types/interface';
import { AddMemeCallback, RetrieveMemeCallback } from '../../types/type';
import MemeGallery from './Gallery';
import MemeUploader from './Uploader';

interface Props {
  readonly helia: IHelia & {
    addMeme: AddMemeCallback;
    retrieveMeme: RetrieveMemeCallback;
  };
  readonly waku: IWaku;
}

export default function Meme({ helia, waku }: Props): React.ReactNode {
  const [uploadingMeme, setUploadingMeme] = useState<boolean>(false);
  return (
    <div>
      <MemeUploader
        addMeme={helia.addMeme}
        node={waku.node}
        encoder={waku.encoder}
        uploadingMeme={setUploadingMeme}
      />
      <MemeGallery
        retrieveMeme={helia.retrieveMeme}
        node={waku.node}
        decoder={waku.decoder}
        uploading={uploadingMeme}
      />
    </div>
  );
}
