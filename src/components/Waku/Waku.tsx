import { NetworkConnector } from "../NetworkConnector/NetworkConnector";
import { Node } from "../Node/Node";
import { useWaku } from "../../hooks/useWaku";

export function Waku() {
  const waku = useWaku();

  if (!waku || !waku.id) {
    return <NetworkConnector network="Waku" />;
  }

  return <Node network="Waku" id={"waku.id"} status={"offline"} />;
}
