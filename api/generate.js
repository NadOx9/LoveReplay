export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Only POST allowed" });
  }

  const { message, tone } = req.body;

  if (!message || !tone) {
    return res.status(400).json({ error: "Missing message or tone" });
  }

  try {
    const openaiRes = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: `You are an assistant that replies in a ${tone} tone.`,
          },
          {
            role: "user",
            content: `Reply to this message: "${message}"`,
          },
        ],
        max_tokens: 200,
        temperature: 0.7,
      }),
    });

    const data = await openaiRes.json();
    const reply = data.choices?.[0]?.message?.content?.trim();

    return res.status(200).json({ reply });
  } catch (err) {
    console.error("GPT error:", err);
    return res.status(500).json({ error: "OpenAI request failed" });
  }
}
