import { printRunError } from './print-run-error'
import { runPackageSelectionFlow } from './run-package-selection-flow'

runPackageSelectionFlow().catch(printRunError)
