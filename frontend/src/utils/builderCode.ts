import { Attribution } from 'ox/erc8021';

// Get your Builder Code from base.dev > Settings > Builder Code
const BUILDER_CODE = 'bc_1vrarh56';

// Generate the data suffix for attribution
export const DATA_SUFFIX = Attribution.toDataSuffix({
  codes: [BUILDER_CODE],
});

/**
 * Appends the builder code suffix to transaction data.
 * This enables attribution tracking on Base.
 */
export function appendBuilderCode(data: string | undefined): string {
  // If there's no data, just return the suffix
  if (!data || data === '0x') {
    return DATA_SUFFIX;
  }

  // Remove '0x' prefix if present, append suffix, and add '0x' back
  const cleanData = data.startsWith('0x') ? data.slice(2) : data;
  const cleanSuffix = DATA_SUFFIX.startsWith('0x') ? DATA_SUFFIX.slice(2) : DATA_SUFFIX;

  return '0x' + cleanData + cleanSuffix;
}
