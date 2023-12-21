import { Hono } from 'hono'
import { rateLimit } from 'hono/rate-limit'

const endpoints = {
  root: '/test',
  getJobs: '/test/get-jobs',
  performance: {
    root: '/test/performance',
  },
  ratelimit: '/test/ratelimit',
}

const app = new Hono().basePath(endpoints.root)

app
  .use(
    `${endpoints.root}/*`,
    rateLimit({
      max: 100, // 100 reqs per ...
      window: 60 * 60 * 1000, // 1hour
    }),
  )

  .get(endpoints.root, (c) => {
    return c.json({ message: '/test' }, 201, { 'X-Custom': 'Thanks' })
  })

  .post(endpoints.getJobs, async (c) => {
    // c.header('', '')
    return c.html(<>hi</>)
  })

  .get(endpoints.performance.root, async (c) => {
    const result = await {
      message: 'performance',
      timestamp: Date.now(),
    }
    return await c.json(result)
  })

  .get(endpoints.ratelimit, (c) => {
    return c.text('rate limit endpoint')
  })

const testHonoApp = {
  endpoint: endpoints.root,
  app: app,
}

export { testHonoApp, endpoints }
