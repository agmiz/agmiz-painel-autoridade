import crypto from "node:crypto";
import { neon } from "@neondatabase/serverless";

let initialized = false;

function json(response, status, payload) {
  response.status(status).setHeader("Content-Type", "application/json; charset=utf-8");
  response.setHeader("Cache-Control", "no-store");
  response.end(JSON.stringify(payload));
}

function authorized(request) {
  const expected = process.env.DASHBOARD_SECRET || "";
  const received = (request.headers.authorization || "").replace(/^Bearer\s+/i, "");
  if (!expected || !received || expected.length !== received.length) return false;
  return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(received));
}

async function initialize(sql) {
  if (initialized) return;
  await sql`CREATE TABLE IF NOT EXISTS dashboard_state (
    id text PRIMARY KEY,
    payload jsonb NOT NULL,
    version integer NOT NULL DEFAULT 1,
    updated_at timestamptz NOT NULL DEFAULT now()
  )`;
  await sql`CREATE TABLE IF NOT EXISTS dashboard_history (
    id bigserial PRIMARY KEY,
    event_type text NOT NULL,
    payload jsonb NOT NULL,
    created_at timestamptz NOT NULL DEFAULT now()
  )`;
  initialized = true;
}

export default async function handler(request, response) {
  if (!process.env.DATABASE_URL) return json(response, 503, { error: "Banco ainda nao configurado." });
  if (!authorized(request)) return json(response, 401, { error: "Senha do painel incorreta." });
  if (!["GET", "PUT"].includes(request.method)) return json(response, 405, { error: "Metodo nao permitido." });

  try {
    const sql = neon(process.env.DATABASE_URL);
    await initialize(sql);

    if (request.method === "GET") {
      const rows = await sql`SELECT payload, version, updated_at FROM dashboard_state WHERE id = 'main' LIMIT 1`;
      if (!rows.length) return response.status(204).end();
      return json(response, 200, { state: rows[0].payload, version: rows[0].version, updatedAt: rows[0].updated_at });
    }

    const body = typeof request.body === "string" ? JSON.parse(request.body) : request.body;
    if (!body || !Array.isArray(body.tasks) || typeof body.metrics !== "object") {
      return json(response, 400, { error: "Dados invalidos para sincronizacao." });
    }
    const state = { tasks: body.tasks, metrics: body.metrics };
    const stateJson = JSON.stringify(state);
    const source = String(body.source || "browser").slice(0, 80);

    const rows = await sql`
      INSERT INTO dashboard_state (id, payload, version, updated_at)
      VALUES ('main', ${stateJson}::jsonb, 1, now())
      ON CONFLICT (id) DO UPDATE SET
        payload = EXCLUDED.payload,
        version = dashboard_state.version + 1,
        updated_at = now()
      RETURNING version, updated_at
    `;
    await sql`INSERT INTO dashboard_history (event_type, payload) VALUES (${source}, ${stateJson}::jsonb)`;
    return json(response, 200, { ok: true, version: rows[0].version, updatedAt: rows[0].updated_at });
  } catch (error) {
    return json(response, 500, { error: "Falha ao salvar no banco.", detail: process.env.NODE_ENV === "development" ? error.message : undefined });
  }
}
