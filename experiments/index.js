#!/usr/bin/env node
// experiments/index.js
// Moved from the project root. Keeps the same behavior as the original script.

import dotenv from "dotenv";

// Temporarily suppress console output while loading dotenv to avoid the
// informational tip message some dotenv builds print to stdout/stderr.
const _console = {
  log: console.log,
  info: console.info,
  warn: console.warn,
  error: console.error,
};
try {
  console.log = console.info = console.warn = console.error = () => {};
  dotenv.config();
} finally {
  console.log = _console.log;
  console.info = _console.info;
  console.warn = _console.warn;
  console.error = _console.error;
}

import OpenAI from "openai";

if (!process.env.OPEN_AI_KEY) {
  console.error(
    "Missing OPEN_AI_KEY. Add it to your environment or to a .env file in the project root."
  );
  process.exit(1);
}

const client = new OpenAI({ apiKey: process.env.OPEN_AI_KEY });

async function main() {
  try {
    const response = await client.chat.completions.create({
      model: "gpt-4.1-mini",
      messages: [
        {
          role: "system",
          content:
            "You are a helpful assistant. You are asked to reflect on if there is life after death.",
        },
        // {
        //   role: "user",
        //   content: "Say a short hello and tell me the current date.",
        // },
      ],
      max_tokens: 200,
    });

    // Prefer printing the assistant's message content
    const assistantContent = response?.choices?.[0]?.message?.content ?? null;

    if (assistantContent) {
      console.log(assistantContent);
    } else {
      // Fallback: print the full response as JSON
      console.log(JSON.stringify(response, null, 2));
    }
  } catch (err) {
    // Print a concise error message; avoid printing secrets
    console.error("Request failed:");
    if (err && err.message) console.error(err.message);
    else console.error(err);
    process.exit(1);
  }
}

main();
