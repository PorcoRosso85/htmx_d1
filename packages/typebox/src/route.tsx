import { tbValidator } from '@hono/typebox-validator'
import { HtmxElement } from '@por85/htmx'
import { Type as T } from '@sinclair/typebox'
import { Hono } from 'hono'
import { logger } from 'hono/logger'

const endpoint = '/typebox'

const endpoints = {
  root: '/',
  user: '/user',
}

const user = T.Object({
  userId: T.String(),
  name: T.String(),
  email: T.String(),
})

const app = new Hono().basePath(endpoint)

app

  .use(logger())

  .get(endpoints.root, async (c) =>
    c.html(
      // TODO: popup, toast,
      <>
        <input name="userId" placeholder="userId" />
        <input name="name" placeholder="name" />
        <input name="email" placeholder="email" />
        <button
          type="button"
          hx-include="[name='userId'], [name='name'], [name='email']"
          hx-post={`${endpoint}${endpoints.user}`}
          hx-target="next div"
        >
          send
        </button>
        <div />
      </>,
    ),
  )

  .post(endpoints.user, tbValidator('form', user), (c) => {
    const { userId, name, email } = c.req.valid('form')
    console.debug('id: ', userId, 'name: ', name, 'email: ', email)
    return c.html(name)
  })

const typeboxHonoApp = {
  endpoint: endpoint,
  app: app,
}

export { typeboxHonoApp }
