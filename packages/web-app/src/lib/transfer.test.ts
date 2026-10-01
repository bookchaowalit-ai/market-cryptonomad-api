import { describe, expect, it } from 'vitest';
import { parseUnits } from 'viem';
import { validateTransfer } from './transfer';

// Well-known public test addresses (Hardhat default accounts); no keys used.
const ALICE = '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266';
const BOB = '0x70997970C51812dc3A010C7d01b50e0d17dc79C8';

describe('validateTransfer', () => {
  it('accepts a valid transfer and returns checksummed address and base units', () => {
    const result = validateTransfer({ recipient: ` ${BOB.toLowerCase()} `, amount: '1.5', sender: ALICE });
    expect(result).toEqual({ ok: true, to: BOB, value: 1_500_000_000_000_000_000n });
  });

  it.each([
    ['', 'Enter a recipient address.'],
    ['0x123', 'valid Ethereum address'],
    ['0x70997970c51812dc3a010c7d01b50e0d17dc79C8', 'valid Ethereum address'], // bad checksum
    ['0x0000000000000000000000000000000000000000', 'zero address'],
    [ALICE.toLowerCase(), 'your own address'],
  ])('rejects recipient %j', (recipient, message) => {
    const result = validateTransfer({ recipient, amount: '1', sender: ALICE });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.errors.recipient).toContain(message);
  });

  it.each([
    ['', 'Enter an amount.'],
    ['-1', 'positive number'],
    ['1e18', 'positive number'],
    ['abc', 'positive number'],
    ['0', 'greater than zero'],
    ['0.000', 'greater than zero'],
    ['0.0000000000000000001', 'at most 18 decimal places'],
  ])('rejects amount %j', (amount, message) => {
    const result = validateTransfer({ recipient: BOB, amount });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.errors.amount).toContain(message);
  });

  it('accepts the smallest unit and leading-dot amounts exactly', () => {
    const tiny = validateTransfer({ recipient: BOB, amount: '0.000000000000000001' });
    expect(tiny).toMatchObject({ ok: true, value: 1n });
    const dot = validateTransfer({ recipient: BOB, amount: '.25' });
    expect(dot).toMatchObject({ ok: true, value: parseUnits('0.25', 18) });
  });

  it('enforces the balance when it is known', () => {
    const balance = parseUnits('10', 18);
    expect(validateTransfer({ recipient: BOB, amount: '10', balance }).ok).toBe(true);
    const over = validateTransfer({ recipient: BOB, amount: '10.000000000000000001', balance });
    expect(over.ok).toBe(false);
    if (!over.ok) expect(over.errors.amount).toContain('exceeds your balance');
  });

  it('reports both fields at once', () => {
    const result = validateTransfer({ recipient: 'nope', amount: 'nope' });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(Object.keys(result.errors).sort()).toEqual(['amount', 'recipient']);
  });
});
