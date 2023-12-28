/**
 * このファイルは、各種データベースの整合性と永続性を確認するためのテストファイルです。
 */
import { Miniflare } from 'miniflare'
import { describe, expect, test } from 'vitest'

describe('Miniflare and persistency', async () => {
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

  test('gen d1 instance', async () => {
    expect(d1db).toBeDefined()
  })

  describe.skip('real d1 instance without miniflare', async () => {})

  describe.skip('データの整合性と永続性の確認', () => {
    test('query d1', async () => {
      await d1db.exec('DROP TABLE IF EXISTS root;')
      await d1db.exec(
        'CREATE TABLE IF NOT EXISTS root (ID INTEGER PRIMARY KEY, Name TEXT, Email TEXT);',
      )
      await d1db.exec(`INSERT INTO root (ID, Name, Email) VALUES (01, 'Tom', 'tom@example.com');`)

      const id = '01'
      const sql = query('/economy', id)
      const { results } = await d1db.prepare(sql).all()
      console.debug(results)
      expect(results).toEqual([{ ID: 1, Name: 'Tom', Email: 'tom@example.com' }])
    })

    test('query kv', async () => {
      await kv.put('foo', 'bar')
      expect(await kv.get('foo')).toBe('bar')
    })

    test('query r2', async () => {
      await r2.put('foo', 'bar')
      const object = await r2.get('foo')
      expect(await object?.text()).toBe('bar')
    })
  })
})
