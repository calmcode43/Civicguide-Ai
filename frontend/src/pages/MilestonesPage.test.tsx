import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { HelmetProvider } from 'react-helmet-async';
import { describe, expect, it } from 'vitest';

import MilestonesPage from '@/pages/MilestonesPage';

describe('MilestonesPage', () => {
  it('validates that an official polling date is selected before saving', async () => {
    render(
      <HelmetProvider>
        <MilestonesPage />
      </HelmetProvider>
    );

    await userEvent.click(screen.getByRole('button', { name: /add polling date/i }));
    await userEvent.click(screen.getByRole('button', { name: /save date/i }));

    expect(screen.getByText('Choose a date before saving.')).toBeInTheDocument();
  });
});
