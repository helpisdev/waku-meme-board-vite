import { useHelia } from "../../hooks/useHelia";
import { NetworkConnector } from "../NetworkConnector/NetworkConnector";
import { Node } from "../Node/Node";

export function IPFS() {
  const helia = useHelia();

  if (!helia || !helia.id) {
    return <NetworkConnector network="IPFS" />;
  }

  return <Node network="IPFS" id={helia.id} status={helia.status} />;
}
