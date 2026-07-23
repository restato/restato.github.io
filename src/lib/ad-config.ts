export type AdPlacement = 'tool-after-help' | 'catalog-between-clusters';

export interface AdEnvironment {
  PUBLIC_ADSENSE_ENABLED?: string;
  PUBLIC_ADSENSE_CLIENT?: string;
  PUBLIC_ADSENSE_SLOT_TOOL?: string;
  PUBLIC_ADSENSE_SLOT_CATALOG?: string;
}

export interface AdSlotConfig { client: string; slot: string }

const placementKeys: Record<AdPlacement, keyof AdEnvironment> = {
  'tool-after-help': 'PUBLIC_ADSENSE_SLOT_TOOL',
  'catalog-between-clusters': 'PUBLIC_ADSENSE_SLOT_CATALOG',
};

function validClient(env: AdEnvironment): string | null {
  if (env.PUBLIC_ADSENSE_ENABLED !== 'true') return null;
  const client = env.PUBLIC_ADSENSE_CLIENT?.trim() ?? '';
  return /^ca-pub-\d+$/.test(client) ? client : null;
}

export function getAdSlotConfig(env: AdEnvironment, placement: AdPlacement): AdSlotConfig | null {
  const client = validClient(env);
  const slot = env[placementKeys[placement]]?.trim() ?? '';
  return client && slot ? { client, slot } : null;
}

export function getAdsenseClient(env: AdEnvironment): string | null {
  return getAdSlotConfig(env, 'tool-after-help')?.client
    ?? getAdSlotConfig(env, 'catalog-between-clusters')?.client
    ?? null;
}
