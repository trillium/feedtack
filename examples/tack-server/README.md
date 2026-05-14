# tack-server

A zero-config dev server that accepts Feedtack payloads and writes them to `.feedtack/` in your project root.

## How it works

1. On startup, walks up from `process.cwd()` to find the nearest `.git` directory
2. Creates `{gitRoot}/.feedtack/` if it doesn't exist
3. Listens for `POST /tack` — writes each payload as `{id}.json` via `DiskAdapter`
4. `GET /tacks` returns all stored payloads as JSON

## Usage

From the feedtack repo root:

```bash
bun run tack-server
# or with a custom port:
bun run tack-server --port 3333
```

Then point Feedtack at it:

```js
window.__feedtack = {
  webhookUrl: 'http://localhost:2727/tack'
}
```

## Endpoints

| Method | Path     | Description                        |
|--------|----------|------------------------------------|
| POST   | `/tack`  | Accept a `FeedtackPayload` as JSON |
| GET    | `/tacks` | Return all stored tacks as JSON    |

## Output

Tacks land in `{gitRoot}/.feedtack/{id}.json`. Add `.feedtack/` to `.gitignore` or commit them — your call.

Each file is a `FeedbackItem` envelope:

```json
{
  "payload": { ... },
  "replies": [],
  "resolutions": [],
  "archives": []
}
```
