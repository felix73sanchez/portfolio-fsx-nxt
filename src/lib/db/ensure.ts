import { initializeDatabase } from './init';

let initialized = false;

/**
 * Guarantees the SQLite schema exists before any read happens in a Server
 * Component. `initializeDatabase` is idempotent (CREATE TABLE IF NOT EXISTS),
 * but we guard it with a per-process flag so static generation and ISR don't
 * re-run the schema setup on every render.
 */
export function ensureDbReady(): void {
  if (initialized) return;
  initializeDatabase();
  initialized = true;
}
