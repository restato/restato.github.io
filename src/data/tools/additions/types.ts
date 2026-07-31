import type { Language } from '../types';
import type { AdditionalToolProfile } from '../localizedContent';

export interface AdditionalToolSpec {
  slug: string;
  icon: string;
  category: string;
  component: string;
  profiles: Record<Language, AdditionalToolProfile>;
  related?: string[];
}
