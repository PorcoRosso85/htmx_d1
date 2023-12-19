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
    `${endpoints.user}`,
    tbValidator('form', userSchema, (result, c) => {
      return c.html('valid')
    }),
    async (c) => {
      const { userId, name, email } = await c.req.parseBody()
      return c.html(`id: ${userId} name: ${name} email: ${email}`)
    },
  )

  .post(
    `${endpoints.user}/:validation/:item`,
    tbValidator('form', userSchema, (result, c) => {
      // TODO : not working
      if (!result.success) {
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

if (import.meta.vitest) {
  const { describe, test, expect } = import.meta.vitest
  const FormData = require('form-data')

  describe('get /typebox', () => {
    test('status 200', async () => {
      const res = await typeboxHonoApp.app.request('/typebox', { method: 'GET' })
      expect(res.status).toBe(200)
    })

    describe('post /user', () => {
      describe('/', () => {
        test.skip('status 200', async () => {
          // TODO: https://chat.openai.com/c/c0b5f9c8-95b3-448c-b48f-fd749732a87a
          const formData = new FormData()
          formData.append('userId', 'aaa')
          formData.append('name', 'aa')
          formData.append('email', 'a')
          console.debug('formData', formData._streams)

          const res = await typeboxHonoApp.app.request('/typebox/user', {
            method: 'POST',
            body: formData,
          })
          expect(res.status).toBe(200)
        })
      })

      describe('/:validation/:item', () => {
        test.skip('status 200 validated', async () => {
          const formData = new FormData()
          formData.append('userId', 'aaa')
          formData.append('name', 'aa')
          formData.append('email', 'a')
          // console.debug('formData', formData)

          const res = await typeboxHonoApp.app.request('/typebox/user/1/1', { method: 'POST' })
          expect(res.status).toBe(200)
        })

        test('no input return 400', async () => {
          const formData = new FormData()
          const res = await typeboxHonoApp.app.request('/typebox/user/1/1', { method: 'POST' })
          expect(res.status).toBe(400)
        })

        // TODO: return 200
        test('invalid input request return 400', async () => {
          const formData = new FormData()
          formData.append('userId', 'aaa')
          formData.append('name', 'aa')
          formData.append('email', 'a')
          const res = await typeboxHonoApp.app.request('/typebox/user/1/1', {
            method: 'POST',
            body: formData,
          })
          expect(res.status).toBe(400)
        })
      })
    })
  })
}
