import { checkPackageAvailability } from './check-package-availability'

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
