import { tbValidator } from '@hono/typebox-validator'
import { Type as T } from '@sinclair/typebox'
import { Hono } from 'hono'
import { logger } from 'hono/logger'

const endpoint = '/typebox'

const endpoints = {
  root: '/',
  user: '/user',
}

const userSchema = T.Object({
  userId: T.String({ minLength: 3, maxLength: 16 }),
  name: T.String({ minLength: 2, maxLength: 16 }),
  email: T.String(),
})

const app = new Hono().basePath(endpoint)

app
  .use(logger())

  .get(endpoints.root, async (c) =>
    c.html(
      // TODO: popup, toast,
      <>
        <input
          name="userId"
          placeholder="userId"
          hx-post={`${endpoint}${endpoints.user}/validate/userId`}
          hx-trigger="keyup changed delay:500ms"
          hx-target="next div"
        />
        <div />
        <input name="name" placeholder="name" />
        <input name="email" placeholder="email" />
        <button
          type="button"
          hx-include="[name='userId'], [name='name'], [name='email']"
          hx-post={`${endpoint}${endpoints.user}/send/all`}
          hx-target="next div"
        >
          send
        </button>
        <div />
      </>,
    ),
  )

  .post(
    `${endpoints.user}/:validation/:item`,
    tbValidator('form', userSchema, (result, c) => {
      // TODO : not working
      if (!result.success) {
        console.log('invalid response, 400')
        c.header('Content-Type', 'text/html')
        c.status(400)
        return c.html('invalid to input rules')
      }
    }),
    (c) => {
      const { userId, name, email } = c.req.valid('form')
      const alreadyTakenData = {
        userId: ['aaa', 'bbb', 'ccc'],
        name: ['aa', 'bb', 'cc'],
        email: ['a@mail.com', 'b@mail.com', 'c@mail.com'],
      }

      const { validation, item } = c.req.param()

      if (validation === 'validate') {
        if (item === 'userId' && alreadyTakenData.userId.includes(userId)) {
          return c.html('userId is already taken')
        }
      }

      return c.html(`id: ${userId} name: ${name} email: ${email}`)
    },
  )

const typeboxHonoApp = {
  endpoint: endpoint,
  app: app,
}

export { typeboxHonoApp }

/**
 * 
This snippet differ to example of this middleware, but mostly same are these I think.
If `form` request also accept tbValidator, how can I return html like inside `if` scope?

```
...

const user = T.Object({
  userId: T.String({ minLength: 3, maxLength: 16 }),
  name: T.String({ minLength: 2, maxLength: 16 }),
  email: T.String(),
})

...

  .post(
    "/user",
    tbValidator('form', user, (result, c) => {
      // TODO : not working
      if (!result.success) {
        console.debug('invalid, 400')
        return c.html('invalid', 400)
      }
    }),
    (c) => {
      const { userId, name, email } = c.req.valid('form')
      console.debug('id: ', userId, 'name: ', name, 'email: ', email)
      
      ...

    },
  
```
 */
