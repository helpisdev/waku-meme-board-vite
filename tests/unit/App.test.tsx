import '@testing-library/jest-dom/extend-expect';
import { render, screen } from '@testing-library/react';

import App from '../../src/App';

describe('Sample description', () => {
  test('Sample', () => {
    render(<App />);
    const el = screen.getByText(/Hello Wolrd!/i);
    expect(el).toBeInTheDocument();
  });
});
