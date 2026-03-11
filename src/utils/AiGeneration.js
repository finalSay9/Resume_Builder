
// ─── AI GENERATION ───────────────────────────────────────────────────────────
async function generateWithAI(prompt, onChunk) {
  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1000,
      stream: true,
      messages: [{ role: "user", content: prompt }],
      system: "You are an expert resume writer. Generate professional, ATS-optimized content. Be concise, impactful, and use strong action verbs. Return only the requested content, no preamble."
    })
  });
  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let result = "";
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    const chunk = decoder.decode(value);
    const lines = chunk.split("\n");
    for (const line of lines) {
      if (line.startsWith("data: ")) {
        try {
          const data = JSON.parse(line.slice(6));
          if (data.type === "content_block_delta" && data.delta?.text) {
            result += data.delta.text;
            onChunk(result);
          }
        } catch {}
      }
    }
  }
  return result;
}