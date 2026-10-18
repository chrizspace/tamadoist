import { describe, expect, it } from 'vitest';
import { SLEEP_HOURS } from './constants';

describe('SLEEP_HOURS', () => {
  it('is 8 hours', () => {
    expect(SLEEP_HOURS).toBe(8);
  });
});
