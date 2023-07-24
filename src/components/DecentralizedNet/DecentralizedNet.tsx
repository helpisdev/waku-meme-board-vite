import { MemeUploader } from "../MemeUploader/MemeUploader";
import type { ChildrenProp } from "../../type";

export function DecentralizedNet({ children }: ChildrenProp) {
  return (
    <div className="px-6 pb-20 text-center">
      {children}
      <MemeUploader />
    </div>
  );
}
