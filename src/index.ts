#!/usr/bin/env node

import chalk from 'chalk'

import type { CliOptions } from './cli/cli-options'
import { parseCliOptions } from './cli/parse-cli-options'
import { runCheckCommand } from './commands/run-check-command'
import { runInfoCommand } from './commands/run-info-command'
import { runNonInteractiveFlow } from './commands/run-non-interactive-flow'
import { runPackageSelectionFlow } from './commands/run-package-selection-flow'
import { printRunError } from './ui/print-run-error'

const main = async (): Promise<number> => {
  const options: CliOptions = parseCliOptions(process.argv)

  if (!options.color) {
    chalk.level = 0
  }

  if (options.check !== null) {
    return runCheckCommand(options.check, options.json)
  }

  if (options.info !== null) {
    return runInfoCommand(options.info, options.json)
  }

  if (options.nonInteractive) {
    return runNonInteractiveFlow(options)
  }

  await runPackageSelectionFlow(options)
  return 0
}

main()
  .then((exitCode: number): void => {
    process.exitCode = exitCode
  })
  .catch((error: unknown): void => {
    printRunError(error)
    process.exitCode = 1
  })
