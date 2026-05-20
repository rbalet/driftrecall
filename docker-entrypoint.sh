#!/bin/sh
set -e

# Run Drizzle migrations (use push or migrate as needed)
npx drizzle-kit migrate

# Start the NestJS app
exec node .output/server/index.mjs
