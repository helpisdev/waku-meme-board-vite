import type React from 'react';

interface Props {
  readonly network: string;
}

export default function NetworkConnector({ network }: Props): React.ReactNode {
  return (
    <div className='w-1/2 px-6 pb-20 text-center'>
      <h4 className='mb-6 text-lg font-bold text-high-contrast dark:text-high-contrast-dark'>
        Connecting to {network}
        ...
      </h4>
    </div>
  );
}
