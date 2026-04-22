import chalk from 'chalk'

/**
 * Prints a fatal run error to stderr. Shows the full stack trace when
 * `NODE_ENV === 'development'`, and a terse message otherwise. Falls back to a
 * JSON stringification for non-Error throwables.
 *
 * @param {unknown} error The thrown value to report.
 * @returns {void}
 */
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
