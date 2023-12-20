import { Hono } from 'hono'
import { logger } from 'hono/logger'

const endpoint = '/'

const endpoints = {
  root: '/',
}

const app = new Hono().basePath(endpoint)

app
  .use(logger())

  .notFound((c) => {
    c.status(404)
    return c.text('Custom 404 text')
  })

  .onError((err, c) => {
    c.status(500)
    console.error(`${err}`)
    return c.text('Custom Error')
  })

  .get('/error', (c) => {
    return c.text(id)
  })

const errorHonoApp = {
  endpoint: endpoint,
  app: app,
}

export { errorHonoApp }

if (import.meta.vitest) {
  const { test, expect, beforeAll, afterAll, describe } = import.meta.vitest

  describe('/error', () => {
    test('status 404', async () => {
      const res = await errorHonoApp.app.request('/nothing')
      expect(res.status).toBe(404)
    })

    test('status 500', async () => {
      const res = await errorHonoApp.app.request('/error')
      expect(res.status).toBe(500)
    })
  })
}
