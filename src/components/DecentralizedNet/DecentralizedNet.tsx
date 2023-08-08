import type React from "react";
import type { ChildrenProp } from "../../types/type";
import { MemeUploader } from "../MemeUploader/MemeUploader";

export function DecentralizedNet({ children }: ChildrenProp): React.ReactNode {
  return (
    <div className="px-6 pb-20 text-center">
      <div className="mb-10 flex justify-center content-center gap-5">
        {children}
      </div>

      <MemeUploader />
    </div>
  );
}
