import OpenAI from "openai";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }
  const { prompt } = req.body || {};
  if (!prompt) {
    res.status(400).json({ error: "Prompt is required" });
    return;
  }
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    res.status(500).json({ error: "Missing OPENAI_API_KEY" });
    return;
  }
  try {
    const client = new OpenAI({ apiKey });
    const image = await client.images.generate({
      model: "gpt-image-1",
      prompt,
    });
    const url = `data:image/png;base64,${image.data[0].b64_json}`;
    res.status(200).json({ url });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
