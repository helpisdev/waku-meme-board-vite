import type React from "react";
import type { Aspect } from "../../types/type";

interface Props {
  readonly src: string;
  readonly aspect?: Aspect | undefined;
}

export function MemeCard({ src, aspect = "square" }: Props): React.ReactNode {
  return (
    <img
      alt="gallery"
      className={`w-full break-inside-avoid aspect-${aspect} mb-6 rounded-lg border-4 border-ui-el-borders-and-focus-rings bg-app p-1 dark:border-ui-el-borders-and-focus-rings-dark dark:bg-app-dark`}
      src={src}
    />
  );
}
