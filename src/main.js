const startBtn = document.getElementById("startBtn");
const transcriptEl = document.getElementById("transcript");
const rounds = 15;

async function postJson(path, body) {
  const r = await fetch(path, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return r.json();
}

function append(text) {
  const line = document.createElement("div");
  line.textContent = text;
  transcriptEl.appendChild(line);
}

startBtn.addEventListener("click", async () => {
  transcriptEl.textContent = "";
  const systemA = document.getElementById("systemA").value;
  const systemB = document.getElementById("systemB").value;
  const startPrompt = document.getElementById("startPrompt").value;

  append("Instantiating Agent A...");
  const a = await postJson("/instantiate", {
    system: systemA,
    startPrompt: `[Moderator] ${startPrompt}`,
  });
  append("Agent A id: " + a.id);

  append("Instantiating Agent B...");
  const b = await postJson("/instantiate", {
    system: systemB,
    startPrompt: `[Moderator] ${startPrompt}`,
  });
  append("Agent B id: " + b.id);

  let lastReply = startPrompt;
  let current = "A";
  let ids = { A: a.id, B: b.id };

  for (let i = 0; i < rounds; i++) {
    append(`\nRound ${i + 1} — ${current}\n`);

    const res = await postJson(`/prompt/${ids[current]}`, {
      message: `[Agent ${current}] ${lastReply}`,
    });
    const assistant = res.assistant ?? res.error ?? "(no response)";

    append(`${current}: ${assistant}`);
    current = current === "A" ? "B" : "A";
  }

  append("\nDebate finished");
});
