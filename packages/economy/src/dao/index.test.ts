import { drizzle } from 'drizzle-orm/d1'
import { migrate } from 'drizzle-orm/d1/migrator'
import { Miniflare } from 'miniflare'
import { describe, expect, test } from 'vitest'
import * as schema from './schema'

describe('gen d1 instance', async () => {
  const mf = new Miniflare({
    name: 'main',
    modules: true,
    script: `
                    export default {
                    async fetch(request, env, ctx){
                        return new Response('Hello World!');
                    },};
                    `,
    d1Databases: ['D1'],
  })

  // env.Binding
  const d1db = await mf.getD1Database('D1')

  // drizzle client
  const drizzleClient = drizzle(d1db, { schema: { ...schema } })

  test('gen d1 instance', async () => {
    expect(d1db).toBeDefined()
  })

  test('gen drizzle d1 client', async () => {
    expect(drizzleClient).toBeDefined()
  })

  describe('real d1 instance without miniflare', async () => {})

  describe('migrate d1 using drizzle', async () => {
    await migrate(drizzleClient, { migrationsFolder: './d1' })

    test('assert table', async () => {
      const { results } = await d1db.prepare('SELECT * FROM sqlite_master;').all()
      const tableNames = results.map((result) => result.name)
      expect(tableNames).toContain('user')
      expect(tableNames).toContain('account')
    })

    test('assert columns', async () => {
      // assert columns
      const { results } = await d1db.prepare('PRAGMA table_info(user);').all()
      const columnNames = results.map((result) => result.name)
      expect(columnNames).toEqual(['userId', 'userName', 'userType', 'otherInfo'])
    })

    describe('test queries, dml to d1', () => {
      test('insert and validate', async () => {
        // insert a row to user table
        await d1db
          .prepare('INSERT INTO user (user_id, user_name, user_type) VALUES (?, ?, ?);')
          .bind(['1', 'user1', 'type1'])
        const { results } = await d1db.prepare('SELECT * FROM user;').all()
        expect(results.length).toEqual(1)
        expect(results[0].userId).toEqual('1')
        expect(results[0].userName).toEqual('user1')
        expect(results[0].userType).toEqual('type1')
      })
      test('schema.queries works or not', async () => {
        const { results } = await d1db.prepare(schema.queries.root.topView.query).all()
        expect(results.length).toEqual(1)
      })
    })

    describe('typebox runtime check', () => {})
  })
})
