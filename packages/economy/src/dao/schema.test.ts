/**
 * このファイルは、テスト用のファイルです。
 */

/**
 * Miniflareを使用して、すべてのテーブル・カラムが
 * 適切に作成されているかどうかを確認します。
 */
import { Miniflare } from 'miniflare'
import { afterAll, beforeAll, describe, expect, test } from 'vitest'
import { endpoints } from '../route/index'
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

describe('queries', async () => {
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

  const d1db = await mf.getD1Database('D1')
  const tables: any[] = []
  tables.push(schema.userTableTypeBox)
  tables.push(schema.accountTableTypeBox)

  for (const table of tables) {
    const ddl = schema.genDdl(table)
    // console.debug('ddl', ddl)
    await d1db.exec(ddl)
  }

  test('assert table', async () => {
    const { results } = await d1db.prepare('SELECT * FROM sqlite_master;').all()
    const tableNames = results.map((result) => result.name)
    console.debug('tableNames', tableNames)
    expect(tableNames).toContain('user')
    expect(tableNames).toContain('account')
  })

  describe('after ddl', () => {
    describe('user.register', async () => {
      const { results } = await d1db.prepare('PRAGMA table_info(user);').all()
      console.debug('results', results)
      const columnNames = results.map((result) => result.name)
      test('user.register column has been created', async () => {
        console.debug('columnNames', columnNames)
        expect(columnNames).toContain('email')
        expect(columnNames).toContain('user_id')
        expect(columnNames).toContain('user_name')
        expect(columnNames).toContain('user_role')
      })

      describe('validate inserted user.register', async () => {
        beforeAll(async () => {
          const query = endpoints.user.register.query.insert_user({
            email: 'email',
            user_id: 'user_id',
            user_name: 'user_name',
            user_role: 'user_role',
          })
          await d1db.prepare(query).run()
        })

        test('validate inserted user.register', async () => {
          const { results } = await d1db.prepare('SELECT * FROM user;').all()
          console.debug('results', results)
          expect(results.length).toEqual(1)
          expect(results[0].email).toEqual('email')
          expect(results[0].user_id).toEqual('user_id')
          expect(results[0].user_name).toEqual('user_name')
          expect(results[0].user_role).toEqual('user_role')
        })
      })
    })
  })
})

// []
/**
 * 実際のデータベースに接続して、
 * テーブル・カラムが適切に作成されているかどうかを確認します。
 */
