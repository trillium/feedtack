# Contributing to feedtack

## Setup

```bash
git clone https://github.com/trillium/feedtack
cd feedtack
pnpm install
```

## Development

```bash
pnpm dev        # watch mode — rebuilds on change
pnpm test       # run unit tests
pnpm test:watch # run tests in watch mode
pnpm lint       # check code style
pnpm lint:fix   # auto-fix lint issues
```

## Project structure

```
src/
  adapters/   # ConsoleAdapter, DiskAdapter, WebhookAdapter, LocalStorageAdapter
  capture/    # DOM targeting and element serialization
  core/       # FeedtackEngine, state management
  inject/     # Self-contained IIFE snippet (feedtack.inject.js)
  react/      # FeedtackProvider, FeedbackModal, hooks
  types/      # Payload schema, adapter interfaces
site-docs/    # Marketing and documentation website (Next.js + Fumadocs)
```

## Commits

This project uses [Conventional Commits](https://www.conventionalcommits.org/). Commit messages are validated on commit:

```
feat(adapters): add SupabaseAdapter
fix(capture): resolve SVG child element targeting
docs(readme): update webhook example
```

## Tests

Tests use Vitest with jsdom. Each module has a co-located test file.

```bash
pnpm test               # run all tests
pnpm test -- --coverage # run with coverage report
```

## Releasing

Releases are managed via `release-it` with conventional-changelog. Only maintainers cut releases.

## Reporting issues

Open an issue on GitHub with a minimal reproduction. Include the feedtack version, your adapter, and what you expected vs. what happened.
