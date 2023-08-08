import Sentry from '@sentry/browser';
import matchers from '@testing-library/jest-dom/matchers';
import { cleanup } from '@testing-library/react';
import sentryTestkit from 'sentry-testkit';
import { afterEach, expect } from 'vitest';

const { sentryTransport } = sentryTestkit();

Sentry.init({
  dsn: import.meta.env.VITE_SENTRY_DSN,
  transport: sentryTransport,
});

expect.extend(matchers);

afterEach(() => {
  cleanup();
});
