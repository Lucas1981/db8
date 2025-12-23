import OpenAI from "openai";

export default class ChatGPTInstance {
  constructor({ system = "", apiKey, startPrompt } = {}) {
    this.system = system;
    if (!apiKey) throw new Error("apiKey is required for ChatGPTInstance");
    this.client = new OpenAI({ apiKey });

    // conversation history
    this.messages = [];
    if (this.system && this.system.length > 0) {
      this.messages.push({ role: "system", content: this.system });
    }

    if (startPrompt && startPrompt.length > 0) {
      this.messages.push({ role: "user", content: startPrompt });
    }
  }

  addMessage(role, content) {
    if (!content || typeof content !== "string") return;
    this.messages.push({ role, content });
  }

  async reply(otherMessage, model = "gpt-4.1-mini") {
    this.messages.push({ role: "user", content: otherMessage });

    const res = await this.client.chat.completions.create({
      model,
      messages: this.messages,
      //   max_tokens: 500,
    });

    const assistant = res?.choices?.[0]?.message?.content ?? null;
    if (assistant)
      this.messages.push({ role: "assistant", content: assistant });

    return assistant;
  }

  getMessages() {
    return this.messages.slice();
  }
}
