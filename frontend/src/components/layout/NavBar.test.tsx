import { MemoryRouter } from 'react-router-dom';
import { axe } from 'jest-axe';
import { fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';

import NavBar from '@/components/layout/NavBar';
import { SkipToContent } from '@/components/ui/SkipToContent';

describe('NavBar accessibility', () => {
  it('supports the skip link and closes the mobile dialog with Escape', async () => {
    const { container } = render(
      <MemoryRouter initialEntries={['/assistant']}>
        <SkipToContent />
        <NavBar />
        <div id="main-content">Main content</div>
      </MemoryRouter>
    );

    const skipLink = screen.getByRole('link', { name: /skip to main content/i });
    skipLink.focus();
    expect(skipLink).toHaveFocus();
    expect(skipLink).toHaveAttribute('href', '#main-content');

    const results = await axe(container);
    expect(results.violations).toHaveLength(0);

    await userEvent.click(screen.getByRole('button', { name: /open navigation menu/i }));

    const dialog = await screen.findByRole('dialog', { name: /mobile navigation menu/i });
    await waitFor(() => {
      expect(within(dialog).getByRole('link', { name: 'Home' })).toHaveFocus();
    });

    fireEvent.keyDown(window, { key: 'Escape' });
    await waitFor(() => {
      expect(screen.queryByRole('dialog', { name: /mobile navigation menu/i })).not.toBeInTheDocument();
    });
  });
});
