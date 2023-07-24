import type * as React from "react";

export interface ChildrenProp {
  children: React.ReactNode;
}

export type Music = "album" | "playlist" | "radio_station" | "song";
export type Video = "episode" | "movie" | "other" | "tv_show";
export type OtherType = "article" | "book" | "profile" | "website";
export type ObjectType = OtherType | `music.${Music}` | `video.${Video}`;
export type CardType = "app" | "player" | "summary_large_image" | "summary";

export type Aspect = "square" | "video";

export type Theme = "dark" | "light";
export type ToggleThemeCallback = (theme?: Theme | undefined) => void;

export type NodeStatus = "offline" | "online";
