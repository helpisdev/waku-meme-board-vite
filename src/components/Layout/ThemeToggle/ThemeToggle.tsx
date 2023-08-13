import { useStore } from '@nanostores/react';
import type React from 'react';
import { useEffect, useState } from 'react';

import { themeStore, toggleTheme as toggle } from '../../../provider/theme';

export default function ThemeToggle(): React.ReactNode {
  const theme = useStore(themeStore);

  const [isDarkMode, setDarkMode] = useState(theme === 'dark');
  const [color, setColor] = useState(isDarkMode ? '#e7f9fb' : '#072830');

  useEffect(() => {
    if (theme === 'dark') {
      setDarkMode(true);
      setColor('#e7f9fb');
    } else {
      setDarkMode(false);
      setColor('#072830');
    }
  }, [theme, color, isDarkMode]);

  return (
    <div className='w-full'>
      <button type='submit' onClick={() => toggle()}>
        {isDarkMode ? (
          <svg
            className='h-8 w-8 md:h-10 md:w-10'
            fill='none'
            stroke={color}
            viewBox='0 0 24 24'
            xmlns='http://www.w3.org/2000/svg'
          >
            <path
              d='M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z'
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
            />
          </svg>
        ) : (
          <svg
            className='h-8 w-8 md:h-10 md:w-10'
            fill='none'
            stroke={color}
            viewBox='0 0 24 24'
            xmlns='http://www.w3.org/2000/svg'
          >
            <path
              d='M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z'
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
            />
          </svg>
        )}
      </button>
    </div>
  );
}
