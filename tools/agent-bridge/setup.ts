// Deployed with the edge function only (never public): hands secrets and the DB driver to the app.
// Every export of secrets.ts is passed on, so optional keys (CRON, BINANCE_*, BYBIT_*) work once they are added there.
import postgres from 'npm:postgres@3.4.5';
import * as S from './secrets.ts';
(globalThis as any).__VERGHE__ = { ...S, postgres };
