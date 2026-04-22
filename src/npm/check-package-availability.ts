const NPM_REGISTRY_URL = 'https://registry.npmjs.org'

/**
 * Checks whether a single package name is available on the public npm
 * registry by issuing a `HEAD` request. A 404 response is treated as
 * available, any other successful response as taken, and any other status
 * throws.
 *
 * @param {string} packageName The npm package name to check.
 * @returns {Promise<boolean>} `true` when available, `false` when taken.
 * @throws {Error} When the registry returns an unexpected (non-404, non-2xx) status.
 */
export const checkPackageAvailability = async (
  packageName: string
): Promise<boolean> => {
  const response: Response = await fetch(
    `${NPM_REGISTRY_URL}/${encodeURIComponent(packageName)}`,
    { method: 'HEAD' }
  )

  if (response.status === 404) {
    return true
  }

  if (response.ok) {
    return false
  }

  throw new Error(
    `Unexpected npm registry response for "${packageName}": ${response.status} ${response.statusText}`
  )
}
