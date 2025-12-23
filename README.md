# db8 — Multi-agent debate playground

> A small demo that runs multiple OpenAI-powered agent instances on a Node/Express backend and a tiny Vite-powered client UI. Each agent is an in-memory server-side instance with its own system prompt and conversation history; the client can instantiate agents and orchestrate short debates between them.

## What this repo contains

- `server/` — Express server that manages per-agent instances, exposes REST endpoints to instantiate agents and send prompts. Each instance stores its own `messages` history and uses the OpenAI Chat completions API to generate replies.
- `src/` — Vite client (development root). A minimal UI for creating two agents, providing system prompts, giving an opening moderator prompt, and running a short debate. Built assets are output to `client/` when you run `npm run build`.
- `experiments/` — small scripts used during development (optional).
- `package.json` — npm scripts for running the server and client.

## Key ideas / architecture

- Each agent is implemented as a server-side `ChatGPTInstance` that holds a `messages` array (system/user/assistant roles). The server is authoritative for message history.
- When you want an agent to speak, the orchestrator calls `reply()` on that instance; the instance flattens its stored history into the chat API request and appends the assistant response to the history.
- To start a debate with an opening statement from a moderator, broadcast the moderator message into every agent's history as a `user` message (e.g. `[Moderator] The proposition is: ...`) and then call `reply()` only for whoever should reply first.

## Endpoints (server)

- `POST /instantiate` — create a new agent instance

  - body: `{ system: string, startPrompt?: string }`
  - returns: `{ id: <uuid> }`

- `POST /prompt/:id` — send a message to a specific agent and get a reply

  - body: `{ message?: string }` (omit `message` to generate a reply from stored history only)
  - returns: `{ assistant: string, messages: [...] }`

## Environment

Create a `.env` file in the project root and set your OpenAI key. Do NOT commit `.env`.

```
OPEN_AI_KEY=sk-...
```

The server expects `OPEN_AI_KEY` to be present in `process.env`.

## Install & run (development)

Run these commands from the project root using zsh.

Install dependencies (if not already installed):

```bash
npm install
```

Start the Express server (default port 3000):

```bash
npm run server
```

Start the Vite dev server (serves `src/` and proxies API requests to the Express server):

```bash
npm run dev
```

Open the client in your browser (Vite usually serves at `http://localhost:5173`).

## Build & run (production-ish)

Build the client and serve the static files (the project includes a simple `start` script that may be a stub):

```bash
npm run build
npm run start
```

Note: You may want to host the built client behind a static host and run the Express server separately.
