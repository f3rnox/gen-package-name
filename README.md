# gen-package-name

> CLI utility to generate npm package name ideas and check their availability
> in the npm registry.

[![npm version](https://img.shields.io/npm/v/gen-package-name.svg)](https://www.npmjs.com/package/gen-package-name)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE.md)
[![Node.js](https://img.shields.io/badge/node-%3E%3D16-brightgreen.svg)](https://nodejs.org)

## Table of Contents

- [Features](#features)
- [Requirements](#requirements)
- [Installation](#installation)
- [Usage](#usage)
- [CLI Arguments](#cli-arguments)
- [How It Works](#how-it-works)
- [Development](#development)
- [Contributing](#contributing)
- [Changelog](#changelog)
- [License](#license)

## Features

- Prompts for a short package description
- Extracts keywords from your description to influence suggestions
- Generates 5 package name candidates per round (configurable)
- Checks availability for each candidate against the npm registry
- Lets you regenerate candidates until you pick one
- Filter to only show available names with `--available-only`
- Machine-readable JSON output for scripting with `--json`
- Non-interactive mode for CI/automation pipelines
- One-shot availability check with `--check`
- Fetch registry metadata for any package with `--info`

## Requirements

- Node.js `>=16`
- pnpm

## Installation

Install globally from npm:

```bash
npm install -g gen-package-name
```

Or run directly with npx:

```bash
npx gen-package-name
```

Or clone and install locally for development:

```bash
git clone https://github.com/f3rnox/gen-package-name.git
cd gen-package-name
pnpm install
```

## Usage

Run interactively:

```bash
gen-package-name
```

Generate names for a description non-interactively:

```bash
gen-package-name -d "parse json streams" -n
```

Generate 10 names from keywords, only show available ones, output as JSON:

```bash
gen-package-name -k parse,json -c 10 -a -j
```

Check if a specific name is available:

```bash
gen-package-name --check my-package-name
```

Fetch registry metadata for a package:

```bash
gen-package-name --info chalk --json
```

## CLI Arguments

```text
Usage: gen-package-name [options]

Options:
  -V, --version          print version and exit
  -d, --description      describe the package; used to extract keyword seeds
  -k, --keywords <list>  comma- or space-separated keyword seeds
                         (overrides --description extraction)
  -c, --count <n>        number of package names to generate (default: 5)
  -a, --available-only   only output names that are available on npm
  -j, --json             emit machine-readable JSON output
  -n, --non-interactive  skip prompts; print generated names and exit
  --check <name>         check whether a specific package name is available
  --info <name>          fetch and print npm registry metadata for a package
  --no-color             disable colored output
  -h, --help             display help for command
```

## How It Works

1. Enter a short description of your package (or skip).
2. Review generated package names and their availability status.
3. Pick a name, regenerate another set, or exit.
4. If the selected name is available, the CLI confirms it.
5. If it is not available, the CLI fetches and prints package metadata.

## Development

```bash
# Install dependencies
pnpm install

# Run in development mode
pnpm dev

# Build
pnpm build

# Run tests
pnpm test

# Lint
pnpm lint

# Format
pnpm format
```

### Scripts

| Script | Description |
| --- | --- |
| `pnpm start` | Run the CLI via tsx |
| `pnpm dev` | Run in development mode |
| `pnpm build` | Build TypeScript and generate docs |
| `pnpm test` | Run tests with vitest |
| `pnpm lint` | Run markdownlint and eslint |
| `pnpm format` | Format with prettier |
| `pnpm serve:docs` | Serve generated TypeDoc docs locally |
| `pnpm serve:coverage` | Serve coverage report locally |

## Contributing

Contributions are welcome. Please open an issue before submitting a pull
request for significant changes.

1. Fork the repository
2. Create a feature branch (`git checkout -b feat/my-feature`)
3. Commit using [Conventional Commits](https://www.conventionalcommits.org)
4. Push and open a pull request

## Changelog

See [CHANGELOG.md](./CHANGELOG.md).

## License

[MIT](./LICENSE.md) &copy; 2026 Cris Mihalache
