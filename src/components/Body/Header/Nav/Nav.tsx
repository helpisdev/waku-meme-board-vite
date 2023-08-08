import type React from 'react';

import ReactiveNavPart from './ReactiveNavPart';

export default function Nav(): React.ReactNode {
  return (
    <nav
      className='flex-no-wrap shadow-black/5 dark:shadow-black/10 relative flex w-full items-center justify-between bg-subtle py-2 shadow-md dark:bg-subtle-dark lg:flex-wrap lg:justify-start lg:py-4'
      data-te-navbar-ref
    >
      <ReactiveNavPart />
    </nav>
  );
}
