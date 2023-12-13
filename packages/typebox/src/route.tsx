import { Hono } from 'hono'
import { logger } from 'hono/logger'

const endpoint = '/typebox'

const endpoints = {
  root: '/',
}

const app = new Hono().basePath(endpoint)

app.use(logger())

.get(endpoints.root, async (c) =>
  c.html(
    // TODO: popup, toast,
    <>typebox</>,
  ),
)

const typeboxHonoApp = {
  endpoint: endpoint,
  app: app,
}

export { typeboxHonoApp }
