import { useWaku } from "../../hooks/useWaku";
import { NetworkConnector } from "../NetworkConnector/NetworkConnector";
import { Node } from "../Node/Node";

export function Waku() {
  const waku = useWaku();

  if (!waku || !waku.id) {
    return <NetworkConnector network="Waku" />;
  }

  return <Node network="Waku" id={waku.id} status={waku.status} />;
}
