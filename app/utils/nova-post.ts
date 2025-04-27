export const checkTTNFormat = (ttn: string) => {
  if (ttn.length !== 14) {
    return {
      isValid: false,
      message: `Invalid tracking code by length - ${ttn.length}`
    }
  }

  if (!/^\d+$/.test(ttn)) {
    return {
      isValid: false,
      message: 'Non numeric tracking code'
    }
  }

  return {
    isValid: true
  }
}

export const toReadableTTN = (ttn: string) => {
  const digits = ttn.replace(/\D/g, '')

  // Apply the formatting safely
  const part1 = digits.slice(0, 2)
  const part2 = digits.slice(2, 6)
  const part3 = digits.slice(6, 10)
  const part4 = digits.slice(10, 14)

  return [part1, part2, part3, part4]
    .filter(Boolean)
    .join(' ')
}
