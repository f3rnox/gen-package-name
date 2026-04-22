import inquirer from 'inquirer'
import chalk from 'chalk'

interface DescriptionAnswer {
  description: string
}

/**
 * Returns the package description, either from a preset value or by prompting
 * the user interactively. The returned string is trimmed; an empty string
 * indicates the user chose to skip the prompt (or aborted it).
 *
 * @param {string|null} [preset=null] Description from CLI; bypasses the prompt when non-null.
 * @returns {Promise<string>} Trimmed description, possibly empty.
 */
export const promptPackageDescription = async (
  preset: string | null = null
): Promise<string> => {
  if (preset !== null) {
    return preset.trim()
  }

  console.log(chalk.bold.blue('\nWhat does your package do?\n'))

  try {
    const { description } = await inquirer.prompt<DescriptionAnswer>([
      {
        type: 'input',
        name: 'description',
        message: 'Describe your package (or press Enter to skip):'
      }
    ])

    return description.trim()
  } catch (error: unknown) {
    if (error instanceof Error && error.name === 'ExitPromptError') {
      return ''
    }

    throw error
  }
}
