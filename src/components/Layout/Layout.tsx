import type React from 'react';

import type { IChildrenProp } from '../../types/interface';
import { conf } from '../../util';
import Logo from './Logo/Logo';
import ThemeToggle from './ThemeToggle/ThemeToggle';

interface HeaderProps {
  readonly title: string;
}

export default function Header({ title, children }: HeaderProps & IChildrenProp): React.ReactNode {
  return (
    <div className='bg-app dark:bg-app-dark'>
      <header>
        <nav
          className='flex-no-wrap shadow-black/5 dark:shadow-black/10 relative flex w-full items-center justify-between bg-subtle py-2 shadow-md dark:bg-subtle-dark lg:flex-wrap lg:justify-start lg:py-4'
          data-te-navbar-ref
        >
          <div className='flex w-full flex-wrap items-center justify-between px-3'>
            <div
              className='!visible hidden shrink basis-[100%] items-center lg:!flex lg:basis-auto'
              data-te-collapse-item
              id='navbarSupportedContent1'
            >
              <a
                className='mb-4 ml-2 mr-5 mt-3 flex items-center text-high-contrast lg:my-0'
                href='/'
              >
                <Logo />
              </a>
            </div>

            <div className='relative flex items-center'>
              <ThemeToggle />
            </div>
          </div>
        </nav>

        <div className='px-6 py-10 text-center'>
          <h1 className='mb-6 text-5xl font-bold text-high-contrast dark:text-high-contrast-dark'>
            {title}
          </h1>

          <h2 className='mb-8 text-3xl font-bold text-high-contrast dark:text-high-contrast-dark'>
            {conf.description}
          </h2>
        </div>
      </header>
      <main>{children}</main>
      <footer className='h-20'>
        {
          // footer
        }
      </footer>
    </div>
  );
}
