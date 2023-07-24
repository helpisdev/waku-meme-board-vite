import { useContext } from "react";
import { WakuContext } from "../provider/WakuProvider";

export function useWaku() {
  const {
    waku,
    encoder,
    decoder,
    error,
    starting,
    status,
    id,
    retrieveStoredMemes,
    uploadMeme,
    filterMemes,
  } = useContext(WakuContext);

  return {
    waku,
    encoder,
    decoder,
    error,
    starting,
    status,
    id,
    retrieveStoredMemes,
    uploadMeme,
    filterMemes,
  };
}
