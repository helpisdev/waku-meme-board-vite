import { DecentralizedNet } from "../DecentralizedNet/DecentralizedNet";
import { IPFS } from "../IPFS/IPFS";
import { Waku } from "../Waku/Waku";
import { MemeGallery } from "../MemeGallery/MemeGallery";

export function WakuApp() {
  return (
    <>
      <DecentralizedNet>
        <div className="columns-2 mb-20">
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
