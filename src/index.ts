import { doHonoApp } from '@quantic/durable-objects'
import { serveStatic } from 'hono/cloudflare-workers'
export { Counter } from '@quantic/durable-objects'
import { insentiveHonoApp } from '@quantic/insentive'
import { joinHonoApp } from '@quantic/join'
import { todoHonoApp } from '@quantic/todo'
import { typeboxHonoApp } from '@quantic/typebox'
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
              <script>
                if ('serviceWorker' in navigator) {
                  navigator.serviceWorker.register('/static/sw.js').then(function(registration) {
                    // 登録成功
                    console.log('ServiceWorker registration successful with scope: ', registration.scope);
                  }).catch(function(error) {
                    // 登録失敗
                    console.log('ServiceWorker registration failed: ', error);
                  });
                }
              </script>
            </body>
          </html>
        `,
      )
    })
    await next()
  })

  .get('/', (c) =>
    c.render(html`
           <div hx-boost="true" hx-target="next div">
                          <button type="button" hx-get="/todo">todo</button>
                          <button type="button" hx-get="/join">join</button>
                          <button type="button" hx-get="/insentive">insentive</button>
                          <button type="button" hx-get="/do">do</button>
                          <button type="button" hx-get=${typeboxHonoApp.endpoint}>typebox</button>
                          <div />
          </div>
          `),
  )

  .get('/static/*', serveStatic({ root: './' }))
  .get('/favicon', serveStatic({ path: './favicon.ico' }))

  .route('/', todoHonoApp.app)
  .route('/', joinHonoApp.app)
  .route('/', insentiveHonoApp.app)
  .route('/', doHonoApp.app)
  .route('/', typeboxHonoApp.app)

export default app
