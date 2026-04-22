interface PackageLookupError {
  statusCode?: number
  message?: string
}

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
