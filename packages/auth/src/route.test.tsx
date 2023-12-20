import { afterAll, beforeAll, describe, expect, test } from 'vitest'
import { authHonoApp } from './route'

describe('/auth', () => {
  test('api', async () => {
    const res = await authHonoApp.app.request('/auth')
    expect(await res.text()).toBe('hi gpt')
  })

  describe.skip('', () => {
    describe('/auth Hello Hono!', () => {
      test('get /', async () => {
        const res = await authHonoApp.app.request('/auth')
        expect(res.status).toBe(200)
        expect(await res.text()).toBe('Hello Hono!')
      })
    })

    describe('/auth/jwt', () => {
      test('200', async () => {
        const res = await authHonoApp.app.request(`${endpoint}${endpoints.jwt.root}`)
        expect(res.status).toBe(200)
      })
      describe('/auth/jwt/sign', () => {
        test('200', async () => {
          const res = await authHonoApp.app.request(`${endpoint}${endpoints.jwt.sign}`, {
            method: 'POST',
          })
          expect(res.status).toBe(200)
        })
      })
    })
  })
})
