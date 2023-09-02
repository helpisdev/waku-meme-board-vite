import type { Helia } from '@helia/interface';
import type { UnixFS } from '@helia/unixfs';
import type { LightNode } from '@waku/interfaces';
import type { Decoder, Encoder } from '@waku/sdk';
import { IDBBlockstore } from 'blockstore-idb';
import type { IDBDatastore } from 'datastore-idb';
import type * as React from 'react';

import type { MemeImageExtension, NodeStatus } from './type';

export interface IPartiaLibp2pOptions {
  datastore: IDBDatastore;
  start: boolean;
}

export interface INode<T> {
  node?: T | undefined;
  error: boolean | unknown;
  isLoading: boolean;
  id?: string | undefined;
  status: NodeStatus;
}

export interface IHelia extends INode<Helia> {
  fs?: UnixFS | undefined;
}

export interface IMeme {
  timestamp: Date;
  hash: string;
  format: MemeImageExtension;
}

export interface IChildrenProp {
  children: React.ReactNode;
}

export interface IWaku extends INode<LightNode> {
  encoder: Encoder;
  decoder: Decoder;
}

export interface ILibp2pOptionsWithBlockstore extends IPartiaLibp2pOptions {
  blockstore: IDBBlockstore;
}
