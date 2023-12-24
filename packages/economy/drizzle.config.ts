import type { Config } from 'drizzle-kit'

export default ({
  schema: './src/dao/schema.ts',
  out: './d1',
  driver: 'd1',
  // dbCredentials: {}
} satisfies Config)
