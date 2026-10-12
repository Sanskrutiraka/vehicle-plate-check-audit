import { describe, it, expect } from 'vitest'
import { validatePlate } from './validate-plate'

const cases: [string, boolean][] = [
  ['MH12AB1234', true],
  ['mh 12 ab 1234', true],
  ['MH-12-AB-1234', true],
  ['  MH12AB1234  ', true],
  ['22BH1234AA', true],
  ['22BH1234A', true],
  ['22BH12345AA', false],
  ['DL1CAB1234', true],
  ['MH121234', true],
  ['MH12A1234', true],
  ['MH12ABC1234', true],
  ['MH12ABCD1234', false],
  ['MH12AB0000', false],
  ['MH00AB1234', false],
  ['XX12AB1234', false],
  ['TS09AB1234', true],
  ['TG09AB1234', true],
  ['OD02AB1234', true],
  ['OR02AB1234', true],
  ['UK07AB1234', true],
  ['UA07AB1234', true],
  ['MH12ABI1234', false],
  ['MH12ABO1234', false],
  ['МН12АВ1234', false],
  ['MH12AВ1234', false],
  ['MH12AB1234!!!', false],
  ["MH12AB1234'; DROP TABLE x;--", false],
  ['', false],
]

describe('validatePlate', () => {
  it.each(cases)('%s -> valid: %s', (input, expected) => {
    expect(validatePlate(input).valid).toBe(expected)
  })

  it('does not crash on null', () => {
    expect(() => validatePlate(null as unknown as string)).not.toThrow()
  })
})