import { describe, expect, it } from 'vitest';
import { addressUtils, timeUtils, tokenUtils, validationUtils } from './utils';
import { TOKEN_CONSTANTS } from './constants';

const LOWER = '0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266';
const CHECKSUM = '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266';

describe('addressUtils', () => {
  it('returns a real EIP-55 checksum address', () => {
    expect(addressUtils.toChecksum(LOWER)).toBe(CHECKSUM);
  });

  it('rejects invalid addresses', () => {
    expect(() => addressUtils.toChecksum('0x1234')).toThrow();
    expect(addressUtils.isValid('not-an-address')).toBe(false);
  });

  it('compares case-insensitively and truncates for display', () => {
    expect(addressUtils.isEqual(LOWER, CHECKSUM)).toBe(true);
    expect(addressUtils.format(CHECKSUM)).toBe('0xf39F...2266');
  });
});

describe('tokenUtils', () => {
  it('round-trips amounts without floating point loss', () => {
    const wei = tokenUtils.parseAmount('0.1');
    expect(wei).toBe(100000000000000000n);
    expect(tokenUtils.formatAmount(wei)).toBe('0.1');
    expect(tokenUtils.formatWithSymbol(wei)).toBe('0.1 NOMAD');
  });

  it('validates amounts against zero, negatives, garbage and max supply', () => {
    expect(tokenUtils.isValidAmount('1')).toBe(true);
    expect(tokenUtils.isValidAmount('0')).toBe(false);
    expect(tokenUtils.isValidAmount('-5')).toBe(false);
    expect(tokenUtils.isValidAmount('abc')).toBe(false);
    expect(tokenUtils.isValidAmount('1000000000')).toBe(true);
    expect(tokenUtils.isValidAmount('1000000000.000000000000000001')).toBe(false);
  });

  it('computes supply percentage with bigint math', () => {
    expect(tokenUtils.calculatePercentage(1n, 3n)).toBe(33.33);
    expect(tokenUtils.calculatePercentage(5n, 0n)).toBe(0);
    expect(tokenUtils.calculatePercentage(TOKEN_CONSTANTS.MAX_SUPPLY, TOKEN_CONSTANTS.MAX_SUPPLY)).toBe(100);
  });
});

describe('timeUtils.formatDuration', () => {
  it('formats hours, minutes and seconds', () => {
    expect(timeUtils.formatDuration(3725)).toBe('1h 2m 5s');
    expect(timeUtils.formatDuration(65)).toBe('1m 5s');
    expect(timeUtils.formatDuration(7)).toBe('7s');
  });
});

describe('validationUtils.validateTransaction', () => {
  it('reports every missing field and accepts a valid transaction', () => {
    expect(validationUtils.validateTransaction({})).toHaveLength(4);
    expect(
      validationUtils.validateTransaction({ hash: '0xabc', from: CHECKSUM, to: CHECKSUM, value: 0n } as any)
    ).toEqual([]);
  });
});
