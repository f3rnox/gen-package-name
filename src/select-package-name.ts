import inquirer from 'inquirer'
import chalk from 'chalk'

import {
  EXIT_PACKAGE_SELECTION,
  GENERATED_PACKAGE_COUNT,
  REGENERATE_PACKAGE_SET
} from './constants'
import { extractNameKeywords } from './extract-name-keywords'
import { generatePackageNames } from './generate-package-names'
import { promptPackageDescription } from './prompt-package-description'

interface SelectPackagePromptAnswer {
  selectedPackage: string
}

export const selectPackageName = async (): Promise<string | null> => {
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
    console.log(chalk.bold.blue('\nGenerated package names\n'))

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
                (name: string): { name: string; value: string } => ({
                  name,
                  value: name
                })
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
      return selectedPackage
    }

    console.log(chalk.yellow('\nGenerating a new set...\n'))
  }
}
