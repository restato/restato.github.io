import { describe, expect, it } from 'vitest';
import { getAdSlotConfig, getAdsenseClient } from '../../../lib/ad-config';

const configured = {
  PUBLIC_ADSENSE_ENABLED: 'true',
  PUBLIC_ADSENSE_CLIENT: 'ca-pub-1234567890123456',
  PUBLIC_ADSENSE_SLOT_TOOL: '1111111111',
  PUBLIC_ADSENSE_SLOT_CATALOG: '2222222222',
};

describe('dormant AdSense configuration', () => {
  it.each([
    [{ ...configured, PUBLIC_ADSENSE_ENABLED: 'false' }],
    [{ ...configured, PUBLIC_ADSENSE_ENABLED: 'TRUE' }],
    [{ ...configured, PUBLIC_ADSENSE_CLIENT: 'pub-123' }],
    [{ ...configured, PUBLIC_ADSENSE_CLIENT: '' }],
    [{ ...configured, PUBLIC_ADSENSE_SLOT_TOOL: '' }],
  ])('keeps the tool placement disabled for incomplete or invalid configuration', env => {
    expect(getAdSlotConfig(env, 'tool-after-help')).toBeNull();
  });

  it('returns only a complete enabled placement', () => {
    expect(getAdSlotConfig(configured, 'tool-after-help')).toEqual({
      client: 'ca-pub-1234567890123456',
      slot: '1111111111',
    });
    expect(getAdSlotConfig(configured, 'catalog-between-clusters')).toEqual({
      client: 'ca-pub-1234567890123456',
      slot: '2222222222',
    });
  });

  it('publishes the account metadata only when at least one slot is enabled', () => {
    expect(getAdsenseClient(configured)).toBe('ca-pub-1234567890123456');
    expect(getAdsenseClient({ ...configured, PUBLIC_ADSENSE_SLOT_TOOL: '', PUBLIC_ADSENSE_SLOT_CATALOG: '' })).toBeNull();
  });
});
