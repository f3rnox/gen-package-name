import { InvalidArgumentError } from 'commander'

export const parseCountOption = (value: string): number => {
  const parsed: number = Number.parseInt(value, 10)

  if (!Number.isFinite(parsed) || parsed < 1) {
    throw new InvalidArgumentError('Count must be a positive integer.')
  }

  if (parsed > 100) {
    throw new InvalidArgumentError('Count must not exceed 100.')
  }

  return parsed
}
