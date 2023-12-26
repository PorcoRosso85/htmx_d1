import path from 'path'
import { drizzle } from 'drizzle-orm/d1'
import { migrate } from 'drizzle-orm/d1/migrator'
import { Miniflare } from 'miniflare'
import { describe, expect, test } from 'vitest'
import * as schema from './schema'

describe('test ./schema functions', async () => {
  describe('genDdl', async () => {
    test('gen ddl', async () => {
      const ddl = schema.genDdl(schema.userTableTypeBox)
      console.debug(ddl)
      expect(ddl).toContain('CREATE TABLE user')
      expect(ddl).toContain('user_id TEXT')
      expect(ddl).toContain('user_name TEXT')
      expect(ddl).toContain('user_role TEXT')
    })
  })
})
