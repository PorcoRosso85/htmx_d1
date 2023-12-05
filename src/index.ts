import { todoHonoApp } from '@quantic/todo'
import { Hono } from 'hono'
import { joinHonoApp } from '@quantic/join'
import { html } from 'hono/html'
import { renderer } from './renderer'
import { logger } from 'hono/logger'

const app = new Hono()

app
  .use('*', logger())

  .get('*', renderer)

  .get('/', (c) =>
    c.html(html`
                          <a href="/todo">todo</a>
                          <a href="/join">join</a>
  `),
  )

  .route('/', todoHonoApp.app)
  .route('/', joinHonoApp.app)

export default app
