import type React from 'react';
import { useState } from 'react';

import MemeGallery from '../components/Meme/Gallery';
import MemeUploader from '../components/Meme/Uploader';
import { IHelia, IWaku } from '../types/interface';
import { AddMemeCallback, RetrieveMemeCallback } from '../types/type';

interface Props {
  readonly helia: IHelia & {
    addMeme: AddMemeCallback;
    retrieveMeme: RetrieveMemeCallback;
  };
  readonly waku: IWaku;
}

export default function MemeProvider({ helia, waku }: Props): React.ReactNode {
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
