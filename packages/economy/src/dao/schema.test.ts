/**
 * vitest
 * test for schema.ts
 *
 */

import { Miniflare } from 'miniflare'
import { describe, expect, test } from 'vitest'

import * as schema from './schema'

describe.skip('typebox runtime check', () => {})

describe('schema', async () => {
  const mf = new Miniflare({
    name: 'main',
    modules: true,
    script: `
                export default {
                  async fetch(request, env, ctx){
                    return new Response('Hello World!');
                  },};
                `,
    // kvNamespaces: ['KV'],
    d1Databases: ['D1'],
    // r2Buckets: ['R2'],
    // Binding of `wrangler.toml`
  })
  const d1db = await mf.getD1Database('D1')

  describe('d1', () => {
    describe('user_master ddl', async () => {
      const sql = schema.generateDDL(schema.userMasterTable.tableName, schema.userMasterTable)
      await d1db.exec(sql)
      const { results } = await d1db.prepare('SELECT * FROM sqlite_master;').all()

      test('show table', () => {
        const tableNames = results.map((result) => result.name)
        expect(tableNames).toContain('user_master')
      })

      test.skip('show columns', async () => {
        const { results } = await d1db.prepare('PRAGMA table_info(user_master);').all()
        const columnNames = results.map((result) => result.name)
        // TODO: 余計なものまで帰ってきてしまうので、テストを書き直す
        expect(columnNames).toEqual([
          'userId',
          'userName',
          'passwordHash',
          'emailAddress',
          'affiliation',
          'distributorBranchId',
          'passInitKey',
          'passInitKeyLimit',
        ])
      })

      describe('user_master dml', () => {
        // TODO: insert文は実行はされるが、incomplete input
        test.skip('insert data => check ddl and `query` function', async () => {
          const sql = `
            INSERT INTO user_master (
              userId,
              userName,
              passwordHash,
              emailAddress,
              affiliation,
              distributorBranchId,
              passInitKey,
              passInitKeyLimit
            ) VALUES (
              'user1',
              'user1',
              'password1',
              'user1@example.com',
              'affiliation1',
              'distributorBranch1',
              'passInitKey1',
              '2023-01-01 00:00:00'
            );
          `
          await d1db.exec(sql)
          const { results } = await d1db.prepare('SELECT * FROM user_master;').all()
          expect(results.length).toBe(1)
          expect(results[0].userId).toBe('user1')
          expect(results[0].userName).toBe('user1')
          expect(results[0].passwordHash).toBe('password1')
        })

        test.skip('validate inseted data', async () => {
          const { results } = await d1db.prepare('SELECT * FROM user_master;').all()
          expect(results.length).toBe(1)
          expect(results[0].userId).toBe('user1')
          expect(results[0].userName).toBe('user1')
          expect(results[0].passwordHash).toBe('password1')
        })
      })
    })
  })
})
