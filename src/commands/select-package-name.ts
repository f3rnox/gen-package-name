import inquirer from 'inquirer'
import chalk from 'chalk'

import {
  EXIT_PACKAGE_SELECTION,
  REGENERATE_PACKAGE_SET
} from '../generator/constants'
import { generatePackageNames } from '../generator/generate-package-names'
import { checkPackageNamesAvailability } from '../npm/check-package-names-availability'
import type { CliOptions, PackageChoice } from '../types'
import { buildPackageChoice } from '../ui/build-package-choice'
import { getKeywordsForPackageSelection } from './get-keywords-for-package-selection'

interface SelectPackagePromptAnswer {
  selectedPackage: string
}

interface PromptKeypress {
  name?: string
}

export interface SelectedPackage {
  name: string
  isAvailable: boolean
}

/**
 * Drives the interactive package name selection loop. Resolves keywords (from
 * CLI options or a prompted description), generates a batch of candidate
 * names, checks their availability, and asks the user to pick one or
 * regenerate. Loops until the user selects a name or exits.
 *
 * @param {import('../types').CliOptions} options Resolved CLI options
 *   controlling generation and prompting.
 * @returns {Promise<SelectedPackage|null>} Selected package and availability, or
 *   `null` if the user exited the prompt.
 */
export const selectPackageName = async (
  options: CliOptions
): Promise<SelectedPackage | null> => {
  const keywords: string[] = await getKeywordsForPackageSelection(options)

  while (true) {
    const packageNames: string[] = generatePackageNames(options.count, keywords)

    console.log(chalk.magenta('\nChecking npm availability...\n'))
    const availability: Map<string, boolean> =
      await checkPackageNamesAvailability(packageNames)

    console.log(chalk.bold.blue('Generated package names\n'))

    let selectedPackage: string
    const promptSession: Promise<SelectPackagePromptAnswer> & {
      ui: { close: () => void }
    } = inquirer.prompt<SelectPackagePromptAnswer>([
      {
        type: 'rawlist',
        name: 'selectedPackage',
        message: 'Select a package:',
        choices: [
          ...packageNames.map(
            (packageName: string): PackageChoice =>
              buildPackageChoice(
                packageName,
                availability.get(packageName) ?? false
              )
          ),
          {
            name: 'Generate a new set of package names',
            value: REGENERATE_PACKAGE_SET
          },
          {
            name: 'Exit',
            value: EXIT_PACKAGE_SELECTION
          }
        ]
      }
    ])

    const closePromptOnEscape = (_: string, key: PromptKeypress): void => {
      if (key.name === 'escape') {
        promptSession.ui.close()
      }
    }

    process.stdin.on('keypress', closePromptOnEscape)
    try {
      const promptAnswer: SelectPackagePromptAnswer = await promptSession
      selectedPackage = promptAnswer.selectedPackage
    } catch (error: unknown) {
      if (
        error instanceof Error &&
        (error.name === 'ExitPromptError' || error.name === 'AbortPromptError')
      ) {
        return null
      }

      throw error
    } finally {
      process.stdin.off('keypress', closePromptOnEscape)
    }

    if (selectedPackage === EXIT_PACKAGE_SELECTION) {
      return null
    }

    if (selectedPackage !== REGENERATE_PACKAGE_SET) {
      return {
        name: selectedPackage,
        isAvailable: availability.get(selectedPackage) ?? false
      }
    }

    console.log(chalk.yellow('\nGenerating a new set...\n'))
  }
}
