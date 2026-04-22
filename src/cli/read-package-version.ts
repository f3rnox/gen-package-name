import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

interface PackageJsonShape {
  version: string
}

export const readPackageVersion = (): string => {
  const packageJsonPath: string = resolve(__dirname, '..', '..', 'package.json')
  const packageJson: PackageJsonShape = JSON.parse(
    readFileSync(packageJsonPath, 'utf8')
  ) as PackageJsonShape

  return packageJson.version
}
