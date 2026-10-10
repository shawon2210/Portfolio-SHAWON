/**
 * Floating Code Snippets for Phase 3 3D Background Scene
 * Original, generic, production-stack snippets:
 * React hook, Next.js route, NestJS service, FastAPI endpoint,
 * SQL indexing/CTE, Dockerfile, Git workflow, LLM stream helper.
 * Zero proprietary code or private keys.
 */

export interface CodeToken {
  text: string;
  type: 'keyword' | 'string' | 'type' | 'number' | 'comment' | 'dim' | 'plain';
}

export interface CodeSnippet {
  id: string;
  filename: string;
  language: string;
  lines: CodeToken[][];
}

export const FLOATING_SNIPPETS: CodeSnippet[] = [
  {
    id: 'react-hook',
    filename: 'useDebounce.ts',
    language: 'typescript',
    lines: [
      [
        { text: 'export function ', type: 'keyword' },
        { text: 'useDebounce', type: 'plain' },
        { text: '<', type: 'dim' },
        { text: 'T', type: 'type' },
        { text: '>(', type: 'dim' },
        { text: 'value: ', type: 'plain' },
        { text: 'T', type: 'type' },
        { text: ', delay = ', type: 'dim' },
        { text: '300', type: 'number' },
        { text: '): ', type: 'dim' },
        { text: 'T', type: 'type' },
        { text: ' {', type: 'dim' },
      ],
      [
        { text: '  const [state, setState] = ', type: 'keyword' },
        { text: 'useState', type: 'plain' },
        { text: '<', type: 'dim' },
        { text: 'T', type: 'type' },
        { text: '>(', type: 'dim' },
        { text: 'value', type: 'plain' },
        { text: ');', type: 'dim' },
      ],
      [
        { text: '  useEffect', type: 'keyword' },
        { text: '(() => {', type: 'dim' },
      ],
      [
        { text: '    const timer = ', type: 'keyword' },
        { text: 'setTimeout', type: 'plain' },
        { text: '(() => ', type: 'dim' },
        { text: 'setState', type: 'plain' },
        { text: '(value), delay);', type: 'dim' },
      ],
      [
        { text: '    return () => ', type: 'keyword' },
        { text: 'clearTimeout', type: 'plain' },
        { text: '(timer);', type: 'dim' },
      ],
      [
        { text: '  }, [value, delay]);', type: 'dim' },
      ],
      [
        { text: '  return state;', type: 'keyword' },
      ],
      [
        { text: '}', type: 'dim' },
      ],
    ],
  },
  {
    id: 'next-route',
    filename: 'app/api/route.ts',
    language: 'typescript',
    lines: [
      [
        { text: 'import { ', type: 'keyword' },
        { text: 'NextResponse', type: 'type' },
        { text: ' } from ', type: 'keyword' },
        { text: "'next/server'", type: 'string' },
        { text: ';', type: 'dim' },
      ],
      [
        { text: 'export async function ', type: 'keyword' },
        { text: 'POST', type: 'plain' },
        { text: '(req: ', type: 'dim' },
        { text: 'Request', type: 'type' },
        { text: ') {', type: 'dim' },
      ],
      [
        { text: '  const { payload } = await ', type: 'keyword' },
        { text: 'req.', type: 'plain' },
        { text: 'json', type: 'plain' },
        { text: '();', type: 'dim' },
      ],
      [
        { text: '  const session = await ', type: 'keyword' },
        { text: 'verifyAuthHeader', type: 'plain' },
        { text: '(req);', type: 'dim' },
      ],
      [
        { text: '  if (!session) return ', type: 'keyword' },
        { text: 'NextResponse.', type: 'plain' },
        { text: 'json({ err: ', type: 'dim' },
        { text: "'Unauthorized'", type: 'string' },
        { text: ' }, { status: ', type: 'dim' },
        { text: '401', type: 'number' },
        { text: ' });', type: 'dim' },
      ],
      [
        { text: '  return ', type: 'keyword' },
        { text: 'NextResponse.', type: 'plain' },
        { text: 'json({ ok: ', type: 'dim' },
        { text: 'true', type: 'number' },
        { text: ', data: payload });', type: 'dim' },
      ],
      [
        { text: '}', type: 'dim' },
      ],
    ],
  },
  {
    id: 'nestjs-controller',
    filename: 'cluster.service.ts',
    language: 'typescript',
    lines: [
      [
        { text: '@Injectable', type: 'type' },
        { text: '()', type: 'dim' },
      ],
      [
        { text: 'export class ', type: 'keyword' },
        { text: 'ClusterMetricsService', type: 'type' },
        { text: ' {', type: 'dim' },
      ],
      [
        { text: '  constructor(private readonly redis: ', type: 'keyword' },
        { text: 'RedisClient', type: 'type' },
        { text: ') {}', type: 'dim' },
      ],
      [
        { text: '  async ', type: 'keyword' },
        { text: 'recordThroughput', type: 'plain' },
        { text: '(nodeId: ', type: 'dim' },
        { text: 'string', type: 'type' },
        { text: ', rps: ', type: 'dim' },
        { text: 'number', type: 'type' },
        { text: ') {', type: 'dim' },
      ],
      [
        { text: '    const key = `telemetry:${nodeId}:window`;', type: 'string' },
      ],
      [
        { text: '    await this.redis.', type: 'plain' },
        { text: 'incrby', type: 'plain' },
        { text: '(key, rps);', type: 'dim' },
      ],
      [
        { text: '    await this.redis.', type: 'plain' },
        { text: 'expire', type: 'plain' },
        { text: '(key, ', type: 'dim' },
        { text: '60', type: 'number' },
        { text: ');', type: 'dim' },
      ],
      [
        { text: '  }', type: 'dim' },
      ],
      [
        { text: '}', type: 'dim' },
      ],
    ],
  },
  {
    id: 'fastapi-endpoint',
    filename: 'main.py',
    language: 'python',
    lines: [
      [
        { text: 'from ', type: 'keyword' },
        { text: 'fastapi ', type: 'plain' },
        { text: 'import ', type: 'keyword' },
        { text: 'FastAPI, Depends, HTTPException', type: 'type' },
      ],
      [
        { text: 'app = FastAPI(title=', type: 'plain' },
        { text: '"Gateway"', type: 'string' },
        { text: ', version=', type: 'plain' },
        { text: '"2.0"', type: 'string' },
        { text: ')', type: 'dim' },
      ],
      [
        { text: '@app.get', type: 'type' },
        { text: '("/v1/health")', type: 'string' },
      ],
      [
        { text: 'async def ', type: 'keyword' },
        { text: 'health_check', type: 'plain' },
        { text: '(db=Depends(get_db_pool)):', type: 'dim' },
      ],
      [
        { text: '    latency = await db.ping()', type: 'plain' },
      ],
      [
        { text: '    return {', type: 'dim' },
        { text: '"status"', type: 'string' },
        { text: ': ', type: 'dim' },
        { text: '"healthy"', type: 'string' },
        { text: ', ', type: 'dim' },
        { text: '"ping_ms"', type: 'string' },
        { text: ': latency}', type: 'dim' },
      ],
    ],
  },
  {
    id: 'sql-query',
    filename: 'query.sql',
    language: 'sql',
    lines: [
      [
        { text: 'WITH ', type: 'keyword' },
        { text: 'partitioned_telemetry ', type: 'plain' },
        { text: 'AS (', type: 'dim' },
      ],
      [
        { text: '  SELECT ', type: 'keyword' },
        { text: 'service_id, latency_p99, timestamp,', type: 'plain' },
      ],
      [
        { text: '         ROW_NUMBER() OVER (', type: 'keyword' },
      ],
      [
        { text: '           PARTITION BY ', type: 'keyword' },
        { text: 'service_id ', type: 'plain' },
        { text: 'ORDER BY ', type: 'keyword' },
        { text: 'timestamp DESC', type: 'plain' },
      ],
      [
        { text: '         ) as rank', type: 'dim' },
      ],
      [
        { text: '  FROM ', type: 'keyword' },
        { text: 'system_metrics_daily', type: 'plain' },
      ],
      [
        { text: ')', type: 'dim' },
      ],
      [
        { text: 'SELECT * FROM ', type: 'keyword' },
        { text: 'partitioned_telemetry ', type: 'plain' },
        { text: 'WHERE ', type: 'keyword' },
        { text: 'rank <= ', type: 'dim' },
        { text: '5', type: 'number' },
        { text: ';', type: 'dim' },
      ],
    ],
  },
  {
    id: 'dockerfile',
    filename: 'Dockerfile',
    language: 'dockerfile',
    lines: [
      [
        { text: 'FROM ', type: 'keyword' },
        { text: 'node:22-alpine ', type: 'plain' },
        { text: 'AS ', type: 'keyword' },
        { text: 'builder', type: 'type' },
      ],
      [
        { text: 'WORKDIR ', type: 'keyword' },
        { text: '/app', type: 'string' },
      ],
      [
        { text: 'COPY ', type: 'keyword' },
        { text: 'package*.json pnpm-lock.yaml ./', type: 'plain' },
      ],
      [
        { text: 'RUN ', type: 'keyword' },
        { text: 'npm ci --prefer-offline', type: 'plain' },
      ],
      [
        { text: 'COPY . .', type: 'plain' },
      ],
      [
        { text: 'RUN ', type: 'keyword' },
        { text: 'npm run build', type: 'plain' },
      ],
      [
        { text: 'FROM ', type: 'keyword' },
        { text: 'gcr.io/distroless/nodejs22', type: 'plain' },
      ],
      [
        { text: 'USER ', type: 'keyword' },
        { text: 'nonroot', type: 'string' },
      ],
      [
        { text: 'CMD ', type: 'keyword' },
        { text: '["server.js"]', type: 'string' },
      ],
    ],
  },
  {
    id: 'llm-helper',
    filename: 'streamCompletion.ts',
    language: 'typescript',
    lines: [
      [
        { text: 'export async function* ', type: 'keyword' },
        { text: 'streamCompletion', type: 'plain' },
        { text: '(', type: 'dim' },
        { text: 'prompt: ', type: 'plain' },
        { text: 'string', type: 'type' },
        { text: ') {', type: 'dim' },
      ],
      [
        { text: '  const stream = await ', type: 'keyword' },
        { text: 'aiClient.', type: 'plain' },
        { text: 'models.', type: 'plain' },
        { text: 'generateStream', type: 'plain' },
        { text: '({', type: 'dim' },
      ],
      [
        { text: '    model: ', type: 'plain' },
        { text: "'gemini-2.5-flash'", type: 'string' },
        { text: ', contents: prompt', type: 'dim' },
      ],
      [
        { text: '  });', type: 'dim' },
      ],
      [
        { text: '  for await (const chunk of stream) {', type: 'keyword' },
      ],
      [
        { text: '    yield ', type: 'keyword' },
        { text: 'chunk.text;', type: 'plain' },
      ],
      [
        { text: '  }', type: 'dim' },
      ],
      [
        { text: '}', type: 'dim' },
      ],
    ],
  },
  {
    id: 'git-workflow',
    filename: 'deploy.sh',
    language: 'bash',
    lines: [
      [
        { text: '#!/usr/bin/env bash', type: 'comment' },
      ],
      [
        { text: 'set -euo pipefail', type: 'plain' },
      ],
      [
        { text: 'echo ', type: 'keyword' },
        { text: '"==> Running tests & bundle check"', type: 'string' },
      ],
      [
        { text: 'npm run lint && npm run build', type: 'plain' },
      ],
      [
        { text: 'git status --porcelain', type: 'keyword' },
      ],
      [
        { text: 'echo ', type: 'keyword' },
        { text: '"==> Ready for zero-downtime deployment"', type: 'string' },
      ],
    ],
  },
];
