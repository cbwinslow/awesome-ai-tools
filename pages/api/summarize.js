import OpenAI from "openai";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }
  const { text } = req.body || {};
  if (!text) {
    res.status(400).json({ error: "Text is required" });
    return;
  }
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    res.status(500).json({ error: "Missing OPENAI_API_KEY" });
    return;
  }
  try {
    const client = new OpenAI({ apiKey });
    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: `Summarize: ${text}` }],
    });
    const summary = completion.choices[0].message.content;
    res.status(200).json({ summary });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
