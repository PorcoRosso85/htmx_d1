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
    describe('user ddl', async () => {
      const sql = schema.generateDDL(schema.userTable.tableName, schema.userTable)
      await d1db.exec(sql)
      const { results } = await d1db.prepare('SELECT * FROM sqlite_master;').all()

      test('show table', () => {
        const tableNames = results.map((result) => result.name)
        expect(tableNames).toContain('user')
      })

      test('show columns', async () => {
        const { results } = await d1db
          .prepare(`PRAGMA table_info(${schema.userTable.tableName});`)
          .all()
        const columnNames = Object.keys(schema.userTable.typeObject.properties)
        expect(columnNames).toEqual(['userId', 'userName', 'userType', 'otherInfo'])
      })

      describe('user dml', () => {
        test('show columns', async () => {
          const { results } = await d1db
            .prepare(`PRAGMA table_info(${schema.userTable.tableName});`)
            .all()
          const columnNames = Object.keys(schema.userTable.typeObject.properties)
          expect(columnNames).toEqual(['userId', 'userName', 'userType', 'otherInfo'])
        })

        test('insert and validate', async () => {
          const columnNames = Object.keys(schema.userTable.typeObject.properties)
          console.debug('columnNames', columnNames)
          if (!columnNames.includes('userId')) {
            throw new Error('userId is not defined')
          }

          const sql = `
            INSERT INTO user (userId, userName, userType, otherInfo)
            VALUES ('user1', 'User One', 'type1', 'other info');
          `
          await d1db.prepare(sql).run()
          const { results } = await d1db.prepare('SELECT * FROM user;').all()
          expect(results.length).toBe(1)
          expect(results[0].userId).toBe('user1')
          expect(results[0].userName).toBe('User One')
          expect(results[0].userType).toBe('type1')
          expect(results[0].otherInfo).toBe('other info')
        })
      })
    })
  })
})
