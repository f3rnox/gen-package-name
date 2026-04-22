import inquirer from 'inquirer'
import chalk from 'chalk'

interface DescriptionAnswer {
  description: string
}

export const promptPackageDescription = async (): Promise<string> => {
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
