import inquirer from 'inquirer'
import chalk from 'chalk'

import {
  EXIT_PACKAGE_SELECTION,
  GENERATED_PACKAGE_COUNT,
  REGENERATE_PACKAGE_SET
} from './constants'
import {
  buildPackageChoice,
  type PackageChoice
} from './build-package-choice'
import { checkPackageNamesAvailability } from './check-package-names-availability'
import { extractNameKeywords } from './extract-name-keywords'
import { generatePackageNames } from './generate-package-names'
import { promptPackageDescription } from './prompt-package-description'

interface SelectPackagePromptAnswer {
  selectedPackage: string
}

export interface SelectedPackage {
  name: string
  isAvailable: boolean
}

export const selectPackageName = async (): Promise<SelectedPackage | null> => {
  const description: string = await promptPackageDescription()
  const keywords: string[] = extractNameKeywords(description)

  if (keywords.length > 0) {
    console.log(chalk.dim(`\nUsing keywords: ${keywords.join(', ')}\n`))
  }

  while (true) {
    const packageNames: string[] = generatePackageNames(
      GENERATED_PACKAGE_COUNT,
      keywords
    )

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
