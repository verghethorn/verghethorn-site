// Deployed with the edge function only (never public): hands secrets and the DB driver to the app.
import postgres from 'npm:postgres@3.4.5';
import { ZTOKEN, KEY, ANAM, XI } from './secrets.ts';
(globalThis as any).__VERGHE__ = { ZTOKEN, KEY, ANAM, XI, postgres };
