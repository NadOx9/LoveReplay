// deno-lint-ignore-file
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

interface RequestBody {
  message: string;
  tone: string;
}

serve(async (req) => {
  console.log("⚡ Function started");

  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: corsHeaders,
    });
  }

  try {
    const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY");
    console.log("🔑 OpenAI Key Present:", !!OPENAI_API_KEY);

    if (!OPENAI_API_KEY) {
      throw new Error("OPENAI_API_KEY is not configured");
    }

    const rawText = await req.text();
    console.log("📥 RAW BODY:", rawText);

    let body: RequestBody;
    try {
      body = JSON.parse(rawText);
    } catch (_) {
      return new Response(
        JSON.stringify({ error: "Invalid JSON in request body", raw: rawText }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    if (!body?.message || !body?.tone) {
      return new Response(
        JSON.stringify({ error: "Message and tone are required" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const { message, tone } = body;
    console.log("🧠 message:", message);
    console.log("🎭 tone:", tone);

    // 💬 Prompt version Coach en séduction
    const basePrompt = `You're a dating coach and seduction expert who writes the perfect replies to any message. You know how to control tone, rhythm, and emotional impact. You understand attraction, confidence, and subtle power dynamics. Never say you're an AI or assistant. Your response must sound 100% human — confident, natural, and socially sharp. Adapt the length to the message: short if it’s short, more detailed if the message is long. Keep it smart, stylish, and emotionally calibrated.`;

    let systemPrompt = "";
    switch (tone.toLowerCase()) {
      case "romantic":
        systemPrompt = `${basePrompt} Use a romantic tone: warm, sincere, emotionally attractive. Make it feel authentic, never cringe.`;
        break;
      case "cheeky":
        systemPrompt = `${basePrompt} Use a cheeky tone: flirty, confident, playful with light teasing. Spark attraction without being rude.`;
        break;
      case "distant":
        systemPrompt = `${basePrompt} Use a distant tone: brief, emotionally cool, mysterious. Give just enough to keep curiosity alive.`;
        break;
      case "savage":
        systemPrompt = `${basePrompt} Use a savage tone: bold, brutally honest, stylishly dismissive. Hit with confidence but keep it classy.`;
        break;
      case "crazy":
        systemPrompt = `${basePrompt} Use a crazy tone: wild, unpredictable, slightly absurd. Be chaotic but still make some sense.`;
        break;
      default:
        systemPrompt = `${basePrompt} Use a ${tone.toLowerCase()} tone.`;
    }

    const openAIResponse = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: message },
        ],
        max_tokens: 300,
        temperature: 0.85,
      }),
    });

    if (!openAIResponse.ok) {
      const errorData = await openAIResponse.text();
      console.error("❌ OpenAI API error:", errorData);
      return new Response(
        JSON.stringify({ error: "OpenAI API request failed", details: errorData }),
        {
          status: openAIResponse.status,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const data = await openAIResponse.json();
    console.log("✅ OpenAI API response received");

    const reply = data.choices[0]?.message?.content?.trim();
    if (!reply) {
      throw new Error("Invalid response from OpenAI");
    }

    return new Response(JSON.stringify({ reply }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });

  } catch (error) {
    console.error("🔥 Function error:", error instanceof Error ? error.message : error);
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : "An unexpected error occurred",
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
