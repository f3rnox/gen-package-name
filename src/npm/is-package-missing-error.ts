interface PackageLookupError {
  statusCode?: number
  message?: string
}

/**
 * Determines whether a caught error from an npm registry lookup indicates
 * that the package simply does not exist (HTTP 404 or a message containing
 * "not found" / "could not be found") rather than a transport or other
 * failure.
 *
 * @param {unknown} error The caught throwable to classify.
 * @returns {boolean} `true` when the error represents a missing package.
 */
export const isPackageMissingError = (error: unknown): boolean => {
  if (!(error instanceof Error)) {
    return false
  }

  const lookupError: PackageLookupError = error as PackageLookupError
  const normalizedMessage: string = error.message.toLowerCase()

  return (
    lookupError.statusCode === 404 ||
    normalizedMessage.includes('could not be found') ||
    normalizedMessage.includes('not found')
  )
}
