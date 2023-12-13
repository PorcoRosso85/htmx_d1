import { doHonoApp } from '@quantic/durable-objects'
export { Counter } from '@quantic/durable-objects'
import { insentiveHonoApp } from '@quantic/insentive'
import { joinHonoApp } from '@quantic/join'
import { todoHonoApp } from '@quantic/todo'
import { Hono } from 'hono'
import { html } from 'hono/html'
import { logger } from 'hono/logger'

const app = new Hono()

app
  .use('*', logger())

  .use('*', async (c, next) => {
    c.setRenderer((children) => {
      return c.html(
        html`
          <!DOCTYPE html>
          <html>
            <head>
              <meta name="viewport" content="width=device-width, initial-scale=1.0" />
              <script src="https://unpkg.com/htmx.org@1.9.3"></script>
              <script src="https://unpkg.com/htmx.org/dist/ext/debug.js"></script>
              <script src="https://unpkg.com/hyperscript.org@0.9.9"></script>
              <script src="https://cdn.tailwindcss.com"></script>
              <title>Hono + htmx</title>
            </head>
            <body>
              <div class="p-4">
                ${children}
              </div>
            </body>
          </html>
        `,
      )
    })
    await next()
  })

  .get('/', (c) =>
    c.render(html`
           <div hx-boost="true" hx-ext="debug" hx-target="next div">
                          <button type="button" hx-get="/todo">todo</button>
                          <button type="button" hx-get="/join">join</button>
                          <button type="button" hx-get="/insentive">insentive</button>
                          <button type="button" hx-get="/do">do</button>
                          <div />
          </div>
          `),
  )

  .route('/', todoHonoApp.app)
  .route('/', joinHonoApp.app)
  .route('/', insentiveHonoApp.app)
  .route('/', doHonoApp.app)

export default app
