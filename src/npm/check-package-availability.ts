const NPM_REGISTRY_URL = 'https://registry.npmjs.org'

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
