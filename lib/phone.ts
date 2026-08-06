/** Keep only digits; strip a leading country code 7/8 so the local part is always 10 digits. */
export function digitsOnly(value: string): string {
  let digits = value.replace(/\D/g, '')
  if (digits.startsWith('8') || digits.startsWith('7')) digits = digits.slice(1)
  return digits.slice(0, 10)
}

/** Format as `+7 (XXX) XXX-XX-XX` while the user types. */
export function formatRuPhone(value: string): string {
  const d = digitsOnly(value)
  if (!d) return '+7'
  if (d.length <= 3) return `+7 (${d}`
  if (d.length <= 6) return `+7 (${d.slice(0, 3)}) ${d.slice(3)}`
  if (d.length <= 8) return `+7 (${d.slice(0, 3)}) ${d.slice(3, 6)}-${d.slice(6)}`
  return `+7 (${d.slice(0, 3)}) ${d.slice(3, 6)}-${d.slice(6, 8)}-${d.slice(8, 10)}`
}

export function isValidRuPhone(value: string): boolean {
  return digitsOnly(value).length === 10
}
