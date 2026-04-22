import { Command } from 'commander'

import { GENERATED_PACKAGE_COUNT } from '../generator/constants'
import type { CliOptions } from './cli-options'
import { parseCountOption } from './parse-count-option'
import { parseKeywordList } from './parse-keyword-list'
import { readPackageVersion } from './read-package-version'

interface RawCliOptions {
  description?: string
  keywords?: string[]
  count: number
  availableOnly: boolean
  json: boolean
  nonInteractive: boolean
  check?: string
  info?: string
  color: boolean
}

/**
 * Parses `process.argv`-style arguments into a normalized `CliOptions` object
 * using commander. Registers all supported flags, help examples, and
 * validators, then converts commander's raw result (which uses `undefined`
 * for missing optional strings) into the stricter null-using shape consumed
 * by the rest of the program.
 *
 * @param {string[]} argv The argv array to parse (typically `process.argv`).
 * @returns {import('./cli-options').CliOptions} Resolved CLI options.
 */
export const parseCliOptions = (argv: string[]): CliOptions => {
  const program: Command = new Command()

  program
    .name('gen-package-name')
    .description(
      'Generate available npm package names interactively or via flags.'
    )
    .version(readPackageVersion(), '-V, --version', 'print version and exit')
    .option(
      '-d, --description <text>',
      'describe the package; used to extract keyword seeds'
    )
    .option(
      '-k, --keywords <list>',
      'comma- or space-separated keyword seeds (overrides --description extraction)',
      parseKeywordList
    )
    .option(
      '-c, --count <n>',
      'number of package names to generate',
      parseCountOption,
      GENERATED_PACKAGE_COUNT
    )
    .option(
      '-a, --available-only',
      'only output names that are available on npm',
      false
    )
    .option('-j, --json', 'emit machine-readable JSON output', false)
    .option(
      '-n, --non-interactive',
      'skip prompts; print generated names and exit',
      false
    )
    .option(
      '--check <name>',
      'check whether a specific package name is available on npm'
    )
    .option(
      '--info <name>',
      'fetch and print npm registry metadata for a package'
    )
    .option('--no-color', 'disable colored output')
    .addHelpText(
      'after',
      [
        '',
        'Examples:',
        '  $ gen-package-name',
        '  $ gen-package-name -d "parse json streams" -n',
        '  $ gen-package-name -k parse,json -c 10 -a -j',
        '  $ gen-package-name --check my-package-name',
        '  $ gen-package-name --info chalk --json'
      ].join('\n')
    )
    .showHelpAfterError()

  program.parse(argv)
  const raw: RawCliOptions = program.opts<RawCliOptions>()

  return {
    description: typeof raw.description === 'string' ? raw.description : null,
    keywords: Array.isArray(raw.keywords) ? raw.keywords : null,
    count: raw.count,
    availableOnly: raw.availableOnly,
    json: raw.json,
    nonInteractive: raw.nonInteractive,
    check: typeof raw.check === 'string' ? raw.check : null,
    info: typeof raw.info === 'string' ? raw.info : null,
    color: raw.color
  }
}
