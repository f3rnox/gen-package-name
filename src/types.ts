/**
 * Normalized CLI options after parsing `process.argv` with commander.
 */
export interface CliOptions {
  description: string | null
  keywords: string[] | null
  count: number
  availableOnly: boolean
  json: boolean
  nonInteractive: boolean
  check: string | null
  info: string | null
  color: boolean
}

/**
 * Inquirer list option: a display label (`name`) and submitted value (`value`).
 */
export interface PackageChoice {
  name: string
  value: string
}

/**
 * Subset of registry fields used when formatting package details for the terminal.
 */
export interface PackageOutput {
  name: string
  version: string
  description?: string
  homepage?: string
}

/**
 * A generated candidate name and whether it is available on the npm registry.
 */
export interface GeneratedNameEntry {
  name: string
  available: boolean
}

/**
 * Registry metadata for an npm package (partial fields from `package-json`).
 */
export interface PackageInfo {
  name?: string
  version?: string
  description?: string
  homepage?: string
}

/**
 * Narrowed error shape for npm registry responses (e.g. HTTP 404, message text).
 */
export interface PackageLookupError {
  statusCode?: number
  message?: string
}
