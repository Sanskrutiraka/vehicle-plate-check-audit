export type PlateValidationResult = {
  valid: boolean
  normalized: string
  state: string | null
  rtoCode: string | null
}

const STATE_CODES: Record<string, string> = {
  AP: 'Andhra Pradesh', AR: 'Arunachal Pradesh', AS: 'Assam', BR: 'Bihar', CG: 'Chhattisgarh', CH: 'Chandigarh',
  DD: 'Dadra and Nagar Haveli and Daman and Diu', DL: 'Delhi', GA: 'Goa', GJ: 'Gujarat', HR: 'Haryana', HP: 'Himachal Pradesh',
  JH: 'Jharkhand', JK: 'Jammu and Kashmir', KA: 'Karnataka', KL: 'Kerala', LA: 'Ladakh', LD: 'Lakshadweep', MH: 'Maharashtra',
  ML: 'Meghalaya', MN: 'Manipur', MP: 'Madhya Pradesh', MZ: 'Mizoram', NL: 'Nagaland', OD: 'Odisha', OR: 'Odisha', PB: 'Punjab',
  PY: 'Puducherry', RJ: 'Rajasthan', SK: 'Sikkim', TN: 'Tamil Nadu', TR: 'Tripura', TS: 'Telangana', UK: 'Uttarakhand',
  UP: 'Uttar Pradesh', WB: 'West Bengal',
}

export function validatePlate(value: string): PlateValidationResult {
  const normalized = value.toUpperCase().replace(/[\s-]/g, '')
  const hasInvalidCharacters = /[^A-Z0-9]/.test(normalized)
  const match = hasInvalidCharacters
    ? null
    : normalized.match(/^([A-Z]{2})(\d{1,2})([A-Z]{0,3})(\d{1,4})$/)  
  const bhMatch = hasInvalidCharacters
    ? null
    : normalized.match(/^(\d{2})BH(\d{4})([A-Z]{1,2})$/)

  if (bhMatch) {
    return { valid: true, normalized, state: 'Bharat Series (BH)', rtoCode: null }
  }
  const stateCode = match?.[1] ?? ''

  if (!match || !STATE_CODES[stateCode]) {
    return { valid: false, normalized, state: null, rtoCode: null }
  }

  return {
    valid: true,
    normalized,
    state: STATE_CODES[stateCode],
    rtoCode: match[2].padStart(2, '0'),
  }
}

export default validatePlate

export { STATE_CODES }

