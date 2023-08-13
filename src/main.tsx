import './index.css';

import React, { useEffect } from 'react';
import ReactDOM from 'react-dom/client';

import Layout from './components/Layout/Layout';
import HeliaProvider from './provider/HeliaProvider';
import { setupTheme } from './provider/theme';

export default function App(): React.ReactNode {
  useEffect(setupTheme, []);

  return (
    <Layout title='Waku Meme Board'>
      <HeliaProvider />
    </Layout>
  );
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
