import type { VercelRequest, VercelResponse } from '@vercel/node';

export default function handler(req: VercelRequest, res: VercelResponse) {
  console.log("✅ API function hit");
  res.status(200).json({ status: "ok", message: "API is working!" });
}
