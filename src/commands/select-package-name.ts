import inquirer from 'inquirer'
import chalk from 'chalk'

import {
  EXIT_PACKAGE_SELECTION,
  REGENERATE_PACKAGE_SET
} from '../generator/constants'
import { generatePackageNames } from '../generator/generate-package-names'
import { resolveKeywords } from '../generator/resolve-keywords'
import { checkPackageNamesAvailability } from '../npm/check-package-names-availability'
import type { CliOptions, PackageChoice } from '../types'
import { buildPackageChoice } from '../ui/build-package-choice'
import { promptPackageDescription } from '../ui/prompt-package-description'

interface SelectPackagePromptAnswer {
  selectedPackage: string
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
  const presetKeywords: string[] =
    options.keywords !== null ? options.keywords : []

  let keywords: string[] = presetKeywords

  if (keywords.length === 0) {
    const description: string = await promptPackageDescription(
      options.description
    )

    keywords = resolveKeywords({
      ...options,
      description: description.length > 0 ? description : null
    })
  }

  if (keywords.length > 0) {
    console.log(chalk.dim(`\nUsing keywords: ${keywords.join(', ')}\n`))
  }

  while (true) {
    const packageNames: string[] = generatePackageNames(options.count, keywords)

    console.log(chalk.magenta('\nChecking npm availability...\n'))
    const availability: Map<string, boolean> =
      await checkPackageNamesAvailability(packageNames)

    console.log(chalk.bold.blue('Generated package names\n'))

    let selectedPackage: string
    try {
      const promptAnswer: SelectPackagePromptAnswer =
        await inquirer.prompt<SelectPackagePromptAnswer>([
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
      selectedPackage = promptAnswer.selectedPackage
    } catch (error: unknown) {
      if (error instanceof Error && error.name === 'ExitPromptError') {
        return null
      }

      throw error
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
