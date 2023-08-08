import type React from 'react';

import type { NodeStatus } from '../../types/type';

interface Props {
  readonly network: string;
  readonly status: NodeStatus;
  readonly id: string;
}

export default function Node({ id, status, network }: Props): React.ReactNode {
  return (
    <div className='min-w-2/4 rounded-lg border-2 border-subtle-borders-and-seperators bg-ui-el px-6 py-4 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] dark:border-subtle-borders-and-seperators-dark dark:bg-ui-el-dark'>
      {network && (
        <h3 className='mb-8 mt-4 text-6xl font-bold text-high-contrast dark:text-high-contrast-dark'>
          {network}
        </h3>
      )}

      {id && (
        <h4 className='text-md mb-1 text-left text-high-contrast dark:text-high-contrast-dark'>
          <span className='font-bold'>ID:</span> {id}
        </h4>
      )}

      {status && (
        <h4 className='text-md mb-1 text-left text-high-contrast dark:text-high-contrast-dark'>
          <span className='font-bold'>Status:</span> <span className='uppercase'>{status}</span>
        </h4>
      )}
    </div>
  );
}
