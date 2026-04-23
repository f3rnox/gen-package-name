import { afterEach, beforeEach, describe, it } from 'vitest'
import { expect } from 'chai'
import chalk, { type ChalkInstance } from 'chalk'

import { buildPackageChoice } from '../../src/ui/build-package-choice'
import type { PackageChoice } from '../../src/types'

describe('buildPackageChoice', (): void => {
  const originalLevel: ChalkInstance['level'] = chalk.level

  beforeEach((): void => {
    chalk.level = 0
  })

  afterEach((): void => {
    chalk.level = originalLevel
  })

  it('marks available packages with "(available)"', (): void => {
    const choice: PackageChoice = buildPackageChoice('my-pkg', true)
    expect(choice).to.deep.equal({
      name: 'my-pkg (available)',
      value: 'my-pkg'
    })
  })

  it('marks taken packages with "(taken)"', (): void => {
    const choice: PackageChoice = buildPackageChoice('chalk', false)
    expect(choice).to.deep.equal({
      name: 'chalk (taken)',
      value: 'chalk'
    })
  })

  it('preserves the package name in the value field', (): void => {
    expect(buildPackageChoice('scoped-name', true).value).to.equal(
      'scoped-name'
    )
  })
})
