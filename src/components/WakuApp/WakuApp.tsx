import type React from "react";
import { DecentralizedNet } from "../DecentralizedNet/DecentralizedNet";
import { IPFS } from "../IPFS/IPFS";
import { MemeGallery } from "../MemeGallery/MemeGallery";
import { Waku } from "../Waku/Waku";

export function WakuApp(): React.ReactNode {
  return (
    <>
      <DecentralizedNet>
        <div className="mb-20 columns-2">
          <div className="mx-auto">
            <IPFS />
          </div>

          <div className="mx-auto">
            <Waku />
          </div>
        </div>
      </DecentralizedNet>

      <MemeGallery />
    </>
  );
}
