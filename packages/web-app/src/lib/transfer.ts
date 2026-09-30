import { getAddress, isAddress, parseUnits, zeroAddress, type Address } from 'viem';

/** NOMAD uses the ERC-20 default of 18 decimals (see NomadCoin.sol). */
export const NOMAD_DECIMALS = 18;

export interface TransferInput {
  recipient: string;
  amount: string;
  /** Connected wallet, used to reject sending to yourself. */
  sender?: string;
  /** Spendable balance in base units, when known. */
  balance?: bigint;
}

export type TransferErrors = Partial<Record<'recipient' | 'amount', string>>;

export type TransferValidation =
  | { ok: true; to: Address; value: bigint }
  | { ok: false; errors: TransferErrors };

const DECIMAL_AMOUNT = /^(?:\d+(?:\.\d*)?|\.\d+)$/;

/**
 * EIP-55: all-lowercase or all-uppercase hex is unchecked; mixed case must
 * match the checksum exactly (viem 1.x `isAddress` does not check this).
 */
function hasValidChecksum(address: string): boolean {
  const hex = address.slice(2);
  if (hex === hex.toLowerCase() || hex === hex.toUpperCase()) return true;
  return getAddress(address) === address;
}

/**
 * Validates a NOMAD transfer before it is sent to the wallet. Amounts are
 * parsed as exact decimal strings into base units (no floating point).
 */
export function validateTransfer(input: TransferInput): TransferValidation {
  const errors: TransferErrors = {};
  const recipient = input.recipient.trim();
  const amount = input.amount.trim();

  let to: Address | undefined;
  if (!recipient) {
    errors.recipient = 'Enter a recipient address.';
  } else if (!isAddress(recipient) || !hasValidChecksum(recipient)) {
    errors.recipient = 'Enter a valid Ethereum address (0x followed by 40 hex characters).';
  } else {
    to = getAddress(recipient);
    if (to === zeroAddress) {
      errors.recipient = 'Tokens sent to the zero address are lost.';
    } else if (input.sender && isAddress(input.sender) && getAddress(input.sender) === to) {
      errors.recipient = 'You cannot send tokens to your own address.';
    }
  }

  let value: bigint | undefined;
  if (!amount) {
    errors.amount = 'Enter an amount.';
  } else if (!DECIMAL_AMOUNT.test(amount)) {
    errors.amount = 'Enter a positive number, for example 1.5.';
  } else if ((amount.split('.')[1] ?? '').length > NOMAD_DECIMALS) {
    errors.amount = `NOMAD supports at most ${NOMAD_DECIMALS} decimal places.`;
  } else {
    value = parseUnits(amount, NOMAD_DECIMALS);
    if (value <= 0n) {
      errors.amount = 'Amount must be greater than zero.';
    } else if (input.balance !== undefined && value > input.balance) {
      errors.amount = 'Amount exceeds your balance.';
    }
  }

  if (errors.recipient || errors.amount || to === undefined || value === undefined) {
    return { ok: false, errors };
  }
  return { ok: true, to, value };
}
