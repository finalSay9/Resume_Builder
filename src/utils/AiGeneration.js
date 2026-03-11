/**
 * Streams a response from the Claude API and calls onChunk with
 * the accumulated text as each delta arrives.
 *
 * @param {string} prompt
 * @param {(text: string) => void} onChunk
 * @returns {Promise<string>} full generated text
 */
export async function generateWithAI(prompt, onChunk) {
  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1000,
      stream: true,
      messages: [{ role: "user", content: prompt }],
      system:
        "You are an expert resume writer. Generate professional, ATS-optimized content. Be concise, impactful, and use strong action verbs. Return only the requested content, no preamble.",
    }),
  });

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let result = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    const chunk = decoder.decode(value);
    for (const line of chunk.split("\n")) {
      if (line.startsWith("data: ")) {
        try {
          const data = JSON.parse(line.slice(6));
          if (data.type === "content_block_delta" && data.delta?.text) {
            result += data.delta.text;
            onChunk(result);
          }
        } catch {
          // ignore malformed lines
        }
      }
    }
  }

  return result;
}

/**
 * High-level AI helpers – each returns a promise that resolves when
 * streaming is complete and keeps `setData` updated along the way.
 */
export async function aiEnhanceSummary({ data, setData, setAiLoading }) {
  setAiLoading("summary");
  try {
    const prompt = `Write a compelling 2-3 sentence professional summary for a ${
      data.title || "professional"
    } named ${
      data.name || "this person"
    }. Make it ATS-optimized and impactful.`;
    await generateWithAI(prompt, (text) =>
      setData((d) => ({ ...d, summary: text }))
    );
  } catch (e) {
    console.error("AI summary error:", e);
  }
  setAiLoading("");
}

export async function aiEnhanceBullets({ data, setData, setAiLoading, index }) {
  setAiLoading("bullets");
  try {
    const exp = data.experience[index];
    if (!exp?.role) return;
    const prompt = `Write 3 powerful resume bullet points for a ${exp.role} at ${
      exp.company || "a company"
    }. Start each with a strong action verb. Be specific and quantified where possible. Return just the 3 bullets, one per line, no numbering.`;
    await generateWithAI(prompt, (text) => {
      const bullets = text
        .split("\n")
        .map((b) => b.trim())
        .filter(Boolean)
        .slice(0, 3);
      setData((d) => {
        const newExp = [...d.experience];
        newExp[index] = { ...newExp[index], bullets };
        return { ...d, experience: newExp };
      });
    });
  } catch (e) {
    console.error("AI bullets error:", e);
  }
  setAiLoading("");
}

export async function aiEnhanceSkills({ data, setData, setAiLoading }) {
  setAiLoading("skills");
  try {
    const prompt = `List 8 relevant technical and soft skills for a ${
      data.title || "professional"
    }. Return only a comma-separated list of skills, nothing else.`;
    await generateWithAI(prompt, (text) => {
      const skills = text
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
      setData((d) => ({ ...d, skills }));
    });
  } catch (e) {
    console.error("AI skills error:", e);
  }
  setAiLoading("");
}