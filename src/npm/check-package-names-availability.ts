import { checkPackageAvailability } from './check-package-availability'

/**
 * Checks a batch of package names for availability in parallel and returns a
 * map from name to availability (`true` when available on npm).
 *
 * @param {string[]} packageNames The npm package names to check.
 * @returns {Promise<Map<string, boolean>>} Map keyed by input names; values are
 *   availability flags.
 */
export const checkPackageNamesAvailability = async (
  packageNames: string[]
): Promise<Map<string, boolean>> => {
  const availabilityEntries: [string, boolean][] = await Promise.all(
    packageNames.map(
      async (packageName: string): Promise<[string, boolean]> => [
        packageName,
        await checkPackageAvailability(packageName)
      ]
    )
  )

  return new Map<string, boolean>(availabilityEntries)
}
