import { Bindings } from '@quantic/config'
import { Hono } from 'hono'
import { logger } from 'hono/logger'

const endpoint = '/d1'

const endpoints = {
  root: '/',
  employee: '/employee',
  executive: '/executive',
  manager: '/manager',
}

const query = (endpoint, id) => {
  switch (endpoint) {
    case '/':
      return `select * from root where ID = ${id}`
    default:
      throw new Error()
  }
}

const app = new Hono<{
  Bindings: Bindings
}>().basePath(endpoint)

app.use(logger())

.get(endpoints.root, async (c) => {
  const id = 'root'
  const sql = query(endpoints.root, id)
  const result = await c.env.D1DB.prepare(sql).all()
  console.debug(result)

  return c.html(<>{result}</>)
})

if (import.meta.vitest) {
  const { describe, test, expect } = import.meta.vitest
  const { Miniflare } = await import('miniflare')

  const mf = new Miniflare({
    name: 'main',
    modules: true,
    script: `
    // export default {
    //   async fetch(request, env, ctx){
    //     return new Response('Hello World!');
    //   },};
    `,
    kvNamespaces: ['KV'],
    d1Databases: ['D1'],
    r2Buckets: ['R2'],
  })
  const kv = await mf.getKVNamespace('KV')
  const d1db = await mf.getD1Database('D1')
  const r2 = await mf.getR2Bucket('R2')
  // const options = {}
  // const db = require('better-sqlite3')(':memory:', options)

  describe('get /', () => {
    test('query d1', async () => {
      await d1db.exec('DROP TABLE IF EXISTS root;')
      await d1db.exec(
        'CREATE TABLE IF NOT EXISTS root (ID INTEGER PRIMARY KEY, Name TEXT, Email TEXT);',
      )
      await d1db.exec(`INSERT INTO root (ID, Name, Email) VALUES (01, 'Tom', 'tom@example.com');`)

      const id = '01'
      const sql = query(endpoints.root, id)
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
}
