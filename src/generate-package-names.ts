import { buildNameGenerators } from './build-name-generators'
import { sample } from './sample'

// Valid npm package names: lowercase alphanumeric and hyphens, no leading/trailing hyphens, max 214 chars
const isValidNpmName = (name: string): boolean =>
  /^[a-z0-9]([a-z0-9-]*[a-z0-9])?$/.test(name) && name.length <= 214

export const generatePackageNames = (
  count: number,
  keywords: string[] = []
): string[] => {
  const generators = buildNameGenerators(keywords)
  const generatedNames: Set<string> = new Set<string>()

  while (generatedNames.size < count) {
    const name = sample(generators)()

    if (isValidNpmName(name)) {
      generatedNames.add(name)
    }
  }

  return [...generatedNames]
}
