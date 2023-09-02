import '@testing-library/jest-dom/extend-expect';

import { render } from '@testing-library/react';

import App from '../../src/main';

describe('Sample description', () => {
  test('Sample', () => {
    // eslint-disable-next-line react/react-in-jsx-scope
    render(<App />);
  });
});
