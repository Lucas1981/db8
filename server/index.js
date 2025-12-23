#!/usr/bin/env node
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { v4 as uuidv4 } from "uuid";
import dotenv from "dotenv";
import ChatGPTInstance from "./ChatGPTInstance.js";

dotenv.config();
const API_KEY = process.env.OPEN_AI_KEY;

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Serve client statically from /client
app.use(express.static("client"));

const instances = new Map();

app.post("/instantiate", (req, res) => {
  const { system, startPrompt } = req.body || {};
  if (typeof system !== "string" || system.length === 0) {
    return res
      .status(400)
      .json({ error: "Missing required `system` string in request body" });
  }

  const id = uuidv4();

  try {
    const inst = new ChatGPTInstance({ system, apiKey: API_KEY, startPrompt });
    instances.set(id, inst);
    return res.json({ id });
  } catch (err) {
    console.error("Failed to instantiate:", err);
    return res.status(500).json({ error: String(err) });
  }
});

app.post("/prompt/:id", async (req, res) => {
  // Expect the client to POST { message: string } as the incoming message.
  const id = req.params.id;
  const { message } = req.body || {};

  const inst = instances.get(id);
  if (!inst) return res.status(404).json({ error: "Instance not found" });
  if (typeof message !== "string")
    return res
      .status(400)
      .json({ error: "Missing `message` string in request body" });

  try {
    const assistant = await inst.reply(message);
    return res.json({ assistant, messages: inst.getMessages() });
  } catch (err) {
    console.error("Prompt error:", err);
    return res.status(500).json({ error: String(err) });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server listening: http://localhost:${port}`);
});
