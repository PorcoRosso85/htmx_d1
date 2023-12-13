import { todoHonoApp } from '@quantic/todo'
import { Hono } from 'hono'
import { joinHonoApp } from '@quantic/join'
import { html } from 'hono/html'
import { renderer } from './renderer'
import { logger } from 'hono/logger'
import { insentiveHonoApp } from '@quantic/insentive'

const app = new Hono()

app
  .use('*', logger())

  .get('*', renderer)

  .get('/', (c) =>
    c.html(html`
           <div hx-boost="true" hx-ext="debug">
                          <a href="/todo">todo</a>
                          <a href="/join">join</a>
                          <a href="/insentive">insentive</a>
          </div>
  `),
  )

  .route('/', todoHonoApp.app)
  .route('/', joinHonoApp.app)
  .route('/', insentiveHonoApp.app)

export default app
