import type React from "react";
import type { NodeStatus } from "../../types/type";

interface Props {
  readonly network: string;
  readonly status: NodeStatus;
  readonly id: string;
}

export function Node({ id, status, network }: Props): React.ReactNode {
  return (
    <div>
      <h3 className="mb-4 text-lg font-bold text-high-contrast dark:text-high-contrast-dark">
        {network}
      </h3>

      <h4 className="text-md mb-4 font-bold text-high-contrast dark:text-high-contrast-dark">
        ID: {id}
      </h4>

      <h4 className="text-md mb-4 font-bold text-high-contrast dark:text-high-contrast-dark">
        Status: {status}
      </h4>
    </div>
  );
}
