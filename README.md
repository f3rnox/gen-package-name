# gen-package-name

CLI utility that generates npm package name ideas and checks availability
against the npm registry.

[![npm version](https://img.shields.io/npm/v/gen-package-name.svg)](https://www.npmjs.com/package/gen-package-name)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE.md)
[![Node.js](https://img.shields.io/badge/node-%3E%3D16-brightgreen.svg)](https://nodejs.org)

## Features

- Interactive package-name selection flow with regenerate + exit actions
- Non-interactive generation mode for scripts and CI
- Availability checks for generated names and one-off names
- Package metadata lookup with `--info`
- JSON output for automation with `--json`
- Optional availability-only filtering with `--available-only`

## Requirements

- Node.js `>=16`
- pnpm (for local development)

## Installation

Install globally:

```bash
npm install -g gen-package-name
```

Run without installing:

```bash
npx gen-package-name
```

Local development setup:

```bash
git clone https://github.com/f3rnox/gen-package-name.git
cd gen-package-name
pnpm install
```

## Usage

Interactive mode:

```bash
gen-package-name
```

Non-interactive generation from description:

```bash
gen-package-name -d "parse json streams" -n
```

Generate 10 names from explicit keywords, keep only available, emit JSON:

```bash
gen-package-name -k parse,json -c 10 -a -j
```

Check one package name:

```bash
gen-package-name --check my-package-name
```

Fetch package metadata:

```bash
gen-package-name --info chalk --json
```

## CLI options

```text
Usage: gen-package-name [options]

Generate available npm package names interactively or via flags.

Options:
  -V, --version             print version and exit
  -d, --description <text>  describe the package; used to extract keyword seeds
  -k, --keywords <list>     comma- or space-separated keyword seeds (overrides
                            --description extraction)
  -c, --count <n>           number of package names to generate (default: 5)
  -a, --available-only      only output names that are available on npm
                            (default: false)
  -j, --json                emit machine-readable JSON output (default: false)
  -n, --non-interactive     skip prompts; print generated names and exit
                            (default: false)
  --check <name>            check whether a specific package name is available
                            on npm
  --info <name>             fetch and print npm registry metadata for a package
  --no-color                disable colored output
  -h, --help                display help for command
```

## How the interactive flow works

1. Resolve keywords from `--keywords`, `--description`, or an interactive prompt.
2. Generate a batch of candidate names.
3. Check npm availability for each candidate.
4. Pick a name, regenerate the list, or exit.
5. If the selected name is taken, display registry metadata for that package.

## Development

```bash
pnpm install
pnpm dev
pnpm build
pnpm test
pnpm lint
pnpm lint:eslint
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
| `pnpm lint:eslint` | Run eslint only |
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
