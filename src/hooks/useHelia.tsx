import { useContext } from "react";
import { HeliaContext } from "../provider/HeliaProvider";

export const useHelia = () => {
  const { helia, fs, error, starting, status, id, addMeme, retrieveMeme } =
    useContext(HeliaContext);
  return { helia, fs, error, starting, status, id, addMeme, retrieveMeme };
};
