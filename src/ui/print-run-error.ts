import chalk from 'chalk'

export const printRunError = (error: unknown): void => {
  const isDevMode: boolean = process.env.NODE_ENV === 'development'
  const errorDetails: string =
    error instanceof Error
      ? error.message
      : (JSON.stringify(error) ?? 'Unknown error')

  const errorStack: string | undefined =
    error instanceof Error && typeof error.stack === 'string'
      ? error.stack
      : undefined

  console.error(chalk.red('Failed to fetch package information'))
  console.error(
    chalk.red(
      isDevMode && typeof errorStack === 'string' ? errorStack : errorDetails
    )
  )
}
