import { useWaku } from "../../hooks/useWaku";
import { isNullOrUndef } from "../../util";
import { NetworkConnector } from "../NetworkConnector/NetworkConnector";
import { Node } from "../Node/Node";

import type React from "react";

export function Waku(): React.ReactNode {
  const waku = useWaku();

  if (isNullOrUndef(waku) || isNullOrUndef(waku.id)) {
    return <NetworkConnector network="Waku" />;
  }

  return <Node id={waku.id} network="Waku" status={waku.status} />;
}
