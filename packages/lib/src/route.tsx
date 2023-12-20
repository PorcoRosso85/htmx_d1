import { Bindings } from '@quantic/config'
import { Hono } from 'hono'
import { env } from 'hono/adapter'
import { logger } from 'hono/logger'

const endpoint = '/'

const endpoints = {
  root: '/',
}

const app = new Hono<{ Bindings: Bindings }>().basePath(endpoint)

app.use(logger())

.get('/env', (c) => {
  const { NAME } = env<{ NAME: string }>(c)
  return c.text(NAME)
})

const libHonoApp = {
  endpoint: endpoint,
  app: app,
}

export { libHonoApp }
