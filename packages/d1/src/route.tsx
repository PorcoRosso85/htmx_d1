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

const app = new Hono<{
  Bindings: Bindings
}>().basePath(endpoint)

app.use(logger())

.get(endpoints.root, async (c) =>
  c.html(
    // TODO: popup, toast,
    <>d1do</>,
  ),
)
