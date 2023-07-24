import { DecentralizedNet } from "../DecentralizedNet/DecentralizedNet";
import { IPFS } from "../IPFS/IPFS";
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
            <div>
              <h3 className="mb-4 text-lg font-bold text-high-contrast dark:text-high-contrast-dark">
                {"network"}
              </h3>
              <h4 className="mb-4 text-md font-bold text-high-contrast dark:text-high-contrast-dark">
                ID: {"id"}
              </h4>
              <h4 className="mb-4 text-md font-bold text-high-contrast dark:text-high-contrast-dark">
                Status: {"status"}
              </h4>
            </div>
          </div>
        </div>
      </DecentralizedNet>
      <MemeGallery />
    </>
  );
}
