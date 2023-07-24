import type { CardType, ObjectType } from "./types/type";
import type { AcceptedMemeFormatMime } from "./types/meme";
import { MemeFormat } from "./types/meme";
import { Type, Field } from "protobufjs";

export const conf = {
  baseURL: "https://waku-meme-board.helpis.dev/",
  description: "Explore and post decentralized memes!",
  image: {
    url: "https://picsum.photos/1200/630",
    alt: "OpenGraph thumbnail description.",
    width: 1200,
    height: 630,
  },
  theme: {
    light: "#fdfdfc",
    dark: "#161615",
  },
  siteName: "Waku Meme Board",
  facebook: {
    type: "website" as ObjectType,
  },
  twitter: {
    card: "summary_large_image" as CardType,
  },
};

export function isAcceptedMemeFormatMime(mime: any): mime is AcceptedMemeFormatMime {
  return (mime as AcceptedMemeFormatMime) !== undefined;
}

// No builtin way to iterate enum values in TypeScript unfortunately
export const mimeToFormatMapping: Record<AcceptedMemeFormatMime, MemeFormat> = {
  "image/png": MemeFormat.PNG,
  "image/jpg": MemeFormat.JPG,
  "image/gif": MemeFormat.GIF,
  "image/jpeg": MemeFormat.JPEG,
}

export const formatToMimeMapping: Record<MemeFormat, AcceptedMemeFormatMime> = {
  [MemeFormat.PNG]: "image/png",
  [MemeFormat.JPG]: "image/jpg",
  [MemeFormat.GIF]: "image/gif",
  [MemeFormat.JPEG]: "image/jpeg",
}

export const MemeMessage = new Type("Meme")
  .add(new Field("timestamp", 1, "uint64"))
  .add(new Field("hash", 2, "string"))
  .add(new Field("format", 3, "enum"));

export const contentTopic = "/waku-meme-board/1/meme/proto";
