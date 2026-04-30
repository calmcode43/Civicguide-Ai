import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { HelmetProvider } from 'react-helmet-async';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import BallotDecoderPage from '@/pages/BallotDecoderPage';

const { apiClientMock, trackEventMock } = vi.hoisted(() => ({
  apiClientMock: {
    get: vi.fn(),
    post: vi.fn(),
    delete: vi.fn(),
  },
  trackEventMock: vi.fn().mockResolvedValue(undefined),
}));

vi.mock('@/lib/apiClient', () => ({
  default: apiClientMock,
}));

vi.mock('@/lib/analytics', () => ({
  trackEvent: trackEventMock,
}));

describe('BallotDecoderPage', () => {
  beforeEach(() => {
    apiClientMock.post.mockReset();
    trackEventMock.mockClear();
  });

  it('loads a decoded explanation for a selected term', async () => {
    apiClientMock.post.mockResolvedValue({
      data: {
        data: {
          explanation: 'VVPAT shows a paper slip behind a transparent window.',
          related_terms: ['EVM', 'NOTA'],
          sources: [],
        },
      },
    });

    render(
      <HelmetProvider>
        <BallotDecoderPage />
      </HelmetProvider>
    );

    await userEvent.click(screen.getByRole('button', { name: /explain the term vvpat/i }));

    expect(await screen.findByText('VVPAT shows a paper slip behind a transparent window.')).toBeInTheDocument();
    expect(screen.getAllByText('EVM').length).toBeGreaterThan(0);
    expect(screen.getAllByText('NOTA').length).toBeGreaterThan(0);
    expect(apiClientMock.post).toHaveBeenCalledWith(
      '/api/ballot/decode',
      expect.objectContaining({ term: 'VVPAT' })
    );
    expect(trackEventMock).toHaveBeenCalledWith(
      'ballot_term_decoded',
      expect.objectContaining({ category: 'technology' })
    );
  });
});
