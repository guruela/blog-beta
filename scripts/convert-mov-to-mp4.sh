#!/usr/bin/env bash

set -euo pipefail

if ! command -v ffmpeg >/dev/null 2>&1; then
  echo "Error: ffmpeg is not installed or not available in PATH." >&2
  exit 1
fi

if [[ $# -lt 1 || $# -gt 2 ]]; then
  echo "Usage: $0 <input.mov> [output.mp4]" >&2
  exit 1
fi

input=$1
output=${2:-"${input%.*}.mp4"}

if [[ ! -f "$input" ]]; then
  echo "Error: input file does not exist: $input" >&2
  exit 1
fi

ffmpeg \
  -i "$input" \
  -c:v libx264 \
  -crf 23 \
  -preset medium \
  -c:a aac \
  -b:a 192k \
  -movflags +faststart \
  "$output"

echo "Created $output"
