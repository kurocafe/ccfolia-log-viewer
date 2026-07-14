import type { VercelRequest, VercelResponse } from "@vercel/node";
import { sql } from "./_db";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method Not Allowed" });
    return;
  }

  // 合言葉チェック
  const { password } = req.body;
  if (password !== process.env.PASSWORD) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  // バリテーション
  const { scenario, content, contentHash } = req.body;
  if (!scenario || !content || !contentHash) {
    res.status(400).json({ error: "Bad Request" });
    return;
  }

  // ハッシュ確認
  const existing = await sql`SELECT id FROM logs WHERE content_hash = ${contentHash}`
  if (existing.length > 0) {
    res.status(409).json({ error: "Conflict" });
    return;
  }

  const maxRunResult = await sql`SELECT MAX(run) AS max_run FROM logs WHERE scenario = ${scenario}`;
  const nextRun = (maxRunResult[0].max_run ?? 0) + 1;

  const inserted = await sql`
    INSERT INTO logs (scenario, run, content, content_hash)
    VALUES (${scenario}, ${nextRun}, ${content}, ${contentHash})
    RETURNING id, scenario, run, created_at
    `;

  res.status(201).json(inserted[0]);
}