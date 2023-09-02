// eslint-disable-next-line simple-import-sort/imports
import './index.css';

import React, { useEffect } from 'react';
import ReactDOM from 'react-dom/client';

import Layout from './components/Layout/Layout';
import WakuProvider from './provider/WakuProvider';
import { setupTheme } from './provider/theme';

export default function App(): React.ReactNode {
  useEffect(setupTheme, []);

  return (
    <Layout title='Waku Meme Board'>
      <WakuProvider />
    </Layout>
  );
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
