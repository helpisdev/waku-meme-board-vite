import type * as React from "react";

export interface ChildrenProp {
  children: React.ReactNode;
}

export type Music = "song" | "album" | "playlist" | "radio_station";
export type Video = "movie" | "episode" | "tv_show" | "other";
export type OtherType = "article" | "book" | "profile" | "website";
export type ObjectType = OtherType | `music.${Music}` | `video.${Video}`;
export type CardType = "summary" | "summary_large_image" | "app" | "player";

export type Aspect = "video" | "square";

export type Theme = "light" | "dark";
export type ToggleThemeCallback = (theme?: Theme | undefined) => void;

export type NodeStatus = "online" | "offline";
