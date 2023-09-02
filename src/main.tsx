// eslint-disable-next-line simple-import-sort/imports
import { ErrorBoundary, FallbackProps } from 'react-error-boundary';
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

function ErrorFallback({ error, resetErrorBoundary }: FallbackProps) {
  return (
    <div role='alert'>
      <p>Something went wrong:</p>
      <pre>{error.message}</pre>
      <button type='button' onClick={resetErrorBoundary}>
        Try again
      </button>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      onError={(error, info) => console.error('Caught an error:', error, info)}
    >
      <App />
    </ErrorBoundary>
  </React.StrictMode>,
);
