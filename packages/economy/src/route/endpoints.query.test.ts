import { TObject } from '@sinclair/typebox'
import { Miniflare } from 'miniflare'
import { describe, expect, test } from 'vitest'
import * as schema from '../dao/schema'
import { endpoints } from './endpoints'

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
    console.debug('ddl', ddl)
    await d1db.exec(schema.genDdl(table))
  }

  test('assert table', async () => {
    const { results } = await d1db.prepare('SELECT * FROM sqlite_master;').all()
    const tableNames = results.map((result) => result.name)
    console.debug('tableNames', tableNames)
    expect(tableNames).toContain('user')
    expect(tableNames).toContain('account')
  })

  describe('after ddl', async () => {
    describe('user.register', () => {
      test('user.register', async () => {
        await d1db
          .prepare(
            endpoints.user.register.query({
              user_id: 'user_id',
              user_name: 'user_name',
              user_role: 'user_role',
            }),
          )
          .all()
        const { results } = await d1db.prepare('SELECT * FROM user;').all()
        console.debug('results', results)
        expect(results.length).toEqual(1)
        expect(results[0].user_id).toEqual('user_id')
        expect(results[0].user_name).toEqual('user_name')
        expect(results[0].user_role).toEqual('user_role')
      })
    })
  })
})
