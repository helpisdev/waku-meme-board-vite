import type React from 'react';

import type { INode } from '../../types/interface';
import Node from './Node';

interface Props<T extends INode<E>, E> {
  readonly node: T;
  readonly network: string;
}

export default function NodeLauncher<T extends INode<E>, E>({
  node,
  network,
}: Props<T, E>): React.ReactNode {
  if (node.error) {
    console.error(node.error);
  }

  if (node.isLoading || !node || node.error) {
    return (
      <div className='w-1/2 px-6 pb-20 text-center'>
        <h4 className='mb-6 text-lg font-bold text-high-contrast dark:text-high-contrast-dark'>
          {node.error ? `An error occured: ${node.error}` : `Connecting to ${network}...`}
        </h4>
      </div>
    );
  }

  return <Node id={node.id!} network={network} status={node.status} />;
}
