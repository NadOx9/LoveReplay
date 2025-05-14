import { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === "OPTIONS") {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    return res.status(204).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { message, tone } = req.body;

  if (!message || !tone) {
    return res.status(400).json({ error: "Message and tone are required" });
  }

  try {
    const openaiRes = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: `You are a helpful assistant that generates replies to messages in a ${tone} tone.`,
          },
          {
            role: "user",
            content: `Reply to this message in a ${tone} tone: "${message}"`,
          },
        ],
        temperature: 0.7,
        max_tokens: 300,
      }),
    });

    const data = await openaiRes.json();
    const reply = data.choices?.[0]?.message?.content?.trim();

    return res.status(200).json({ reply });
  } catch (error) {
    return res.status(500).json({ error: "Failed to generate reply" });
  }
}
