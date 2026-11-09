#!/usr/bin/env bash
# Commit + push the bridge, then pin the edge-function entry to that commit. Prints index.ts to deploy (with setup.ts + secrets.ts).
set -e
cd "$(dirname "$0")/../.."
git add tools/agent-bridge/app.ts tools/agent-bridge/more.ts tools/agent-bridge/crm.ts tools/agent-bridge/setup.ts tools/agent-bridge/release.sh
git -c user.name=verghethorn -c user.email=verghethorn@gmail.com commit -q -m "${1:-VERGHE bridge update}

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01BhYsySb1bmSKj6zxDYmtro" || true
git pull -q --rebase && git push -q
SHA=$(git log -1 --format=%H -- tools/agent-bridge)
cat > tools/agent-bridge/index.ts <<EOT
// VERGHE tool bridge entry: secrets + driver first, then the app from the repo at a pinned commit.
import './setup.ts';
import 'https://cdn.jsdelivr.net/gh/verghethorn/verghethorn-site@$SHA/tools/agent-bridge/app.ts';
EOT
cat tools/agent-bridge/index.ts
