import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

interface PackageJsonShape {
  version: string
}

/**
 * Reads the `version` field from the project's `package.json`, resolved
 * relative to the compiled module location. Used to populate the CLI
 * `--version` output.
 *
 * @returns {string} The package version string.
 */
export const readPackageVersion = (): string => {
  const packageJsonPath: string = resolve(__dirname, '..', '..', 'package.json')
  const packageJson: PackageJsonShape = JSON.parse(
    readFileSync(packageJsonPath, 'utf8')
  ) as PackageJsonShape

  return packageJson.version
}
