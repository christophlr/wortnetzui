#!/usr/bin/env bash
OUTDIR=${1:-snapshots}
mkdir -p "$OUTDIR"
TS=$(date +%Y%m%dT%H%M%S)
printf "snapshot: %s\n" "$TS" > "$OUTDIR/summary-$TS.txt"
echo "--- ports (ss) ---" >> "$OUTDIR/summary-$TS.txt"
ss -ltnp | grep -E '5173|5174|5175' >> "$OUTDIR/summary-$TS.txt" 2>/dev/null || true
echo "--- lsof ---" >> "$OUTDIR/summary-$TS.txt"
lsof -iTCP -sTCP:LISTEN -P -n | grep -E '5173|5174|5175' >> "$OUTDIR/summary-$TS.txt" 2>/dev/null || true
echo "--- vite/node procs ---" >> "$OUTDIR/summary-$TS.txt"
pgrep -af 'vite|node' >> "$OUTDIR/summary-$TS.txt" 2>/dev/null || true
echo "Saved snapshot to $OUTDIR/summary-$TS.txt"
