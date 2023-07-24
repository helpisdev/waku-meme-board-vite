import type React from "react";
import { useHelia } from "../../hooks/useHelia";
import { isNullOrUndef } from "../../util";
import { NetworkConnector } from "../NetworkConnector/NetworkConnector";
import { Node } from "../Node/Node";

export function IPFS(): React.ReactNode {
  const helia = useHelia();

  if (isNullOrUndef(helia?.id)) {
    return <NetworkConnector network="IPFS" />;
  }

  return <Node id={helia.id} network="IPFS" status={helia.status} />;
}
