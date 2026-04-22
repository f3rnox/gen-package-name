import chalk from 'chalk'

export interface GeneratedNameEntry {
  name: string
  available: boolean
}

export const printGeneratedNames = (
  entries: GeneratedNameEntry[],
  asJson: boolean
): void => {
  if (asJson) {
    console.log(JSON.stringify(entries, null, 2))
    return
  }

  for (const entry of entries) {
    const marker: string = entry.available
      ? chalk.green('available')
      : chalk.red('taken    ')

    console.log(`${marker}  ${entry.name}`)
  }
}
