# gen-package-name

CLI utility to generate npm package name ideas and check their
availability in the npm registry.

## Features

- Prompts for a short package description
- Extracts keywords from your description to influence suggestions
- Generates 5 package name candidates per round
- Checks availability for each candidate against the npm registry
- Lets you regenerate candidates until you pick one
- If a selected name is taken, shows basic package details

## Requirements

- Node.js `>=16`
- pnpm

## Installation

```bash
pnpm install
```

## Usage

Run the CLI:

```bash
pnpm start
```

For development:

```bash
pnpm dev
```

## How It Works

1. Enter a short description of your package (or skip).
2. Review generated package names and their availability status.
3. Pick a name, regenerate another set, or exit.
4. If the selected name is available, the CLI confirms it.
5. If it is not available, the CLI fetches and prints package metadata.

## Scripts

- `pnpm start` - run the CLI
- `pnpm dev` - run in development mode via `tsx`
- `pnpm build` - build TypeScript and docs
- `pnpm test` - run tests
- `pnpm lint` - run markdown + eslint checks
