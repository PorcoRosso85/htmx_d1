import { Hono } from 'hono'

const endpoint = '/test'

const endpoints = {
  root: '/',
  getJobs: '/get-jobs',
}

const app = new Hono().basePath(endpoint)

app
  .get(endpoints.root, (c) => {
    return c.json({ message: '/test' }, 201, { 'X-Custom': 'Thanks' })
  })

  .post(endpoints.getJobs, async (c) => {
    // c.header('', '')
    return c.html(<>hi</>)
  })

const testHonoApp = {
  endpoint: endpoint,
  app: app,
}

if (import.meta.vitest) {
  const { describe, test, expect, beforeAll, afterAll } = import.meta.vitest

  describe('/test', () => {
    test('get /, 200, header, message', async () => {
      const res = await testHonoApp.app.request(endpoint)
      expect(res.status).toBe(201)
      expect(res.headers.get('X-Custom')).toBe('Thanks')
      expect(await res.json()).toEqual({ message: '/test' })
    })

    describe('post /get-jobs', () => {
      test('status 200', async () => {
        const res = await testHonoApp.app.request(`${endpoint}${endpoints.getJobs}`, {
          method: 'POST',
        })
        expect(res.status).toBe(200)
        expect(res.headers.get('Content-Type')).toBe('text/html; charset=UTF-8')
      })

      test('status 404', async () => {
        const res = await testHonoApp.app.request('/test/invalid', {
          method: 'POST',
        })
        expect(res.status).toBe(404)
      })
    })
  })
}
