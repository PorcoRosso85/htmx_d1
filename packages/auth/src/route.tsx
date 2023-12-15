import jwt from '@tsndr/cloudflare-worker-jwt'
import { Hono } from 'hono'
import { logger } from 'hono/logger'
import { describe } from 'vitest'
import { genOTP } from './util'

const endpoint = '/auth'

const endpoints = {
  root: '/',
  jwt: {
    root: '/jwt',
    sign: '/jwt/sign',
    verify: '/jwt/verify',
    decode: '/jwt/decode',
  },
  basic: '/basic',
  oauth: '/oauth',
  otp: {
    root: '/otp',
    send: '/otp/send',
  },
  success: '/success',
}

const app = new Hono().basePath(endpoint)

app
  .use(logger())

  .get(endpoints.root, async (c) => {
    // route to 'jwt' or 'auth0/oauth'
    return c.text('Hello Hono!')
  })

  // .post(endpoints.otp.root, (c) => {
  //   const { email } = c.req.parseBody()
  //   const otp = genOTP()

  //   const mailOptions = {
  //     from: 'your-email@example.com',
  //     to: email,
  //     subject: 'Your OTP',
  //     html: `<p>Your OTP is: <strong>${otp}</strong></p>`,
  //   }

  //   const transporter = nodemailer.createTransport({
  //     SES: ses,
  //   })

  //   transporter.sendMail(mailOptions, (err, info) => {
  //     if (err) {
  //       console.error(err)
  //       res.status(500).send('Error sending OTP')
  //     } else {
  //       console.log('Email sent: ' + info.response)
  //       res.send('OTP sent successfully')
  //     }
  //   })
  // })

  .get(endpoints.jwt.root, (c) => {
    c.status(200)
    return c.text('/auth/jwt')
  })

  .post(endpoints.jwt.sign, async (c) => {
    // email検証後ここに来る
    // userIdでjwtを生成
    const { userId } = await c.req.parseBody()

    // TODO: このライブラリはnode上では動かしづらい
    // viteはNode前提
    const jwtToken = await jwt.sign(
      {
        name: userId,
        nbf: Math.floor(Date.now() / 1000) + 60 * 60,
        exp: Math.floor(Date.now() / 1000) + 2 * (60 * 60),
      },
      'secret',
    )
    c.status(200)
    return c.text('')
  })

  .get(endpoints.jwt.verify, async (c) => {
    // const isValid = await jwt.verify(c.req.header('token'), 'secret')
    // return !isValid ? c.json('', 200) : c.json('', 401)
  })

  .get(endpoints.jwt.decode, (c) => {
    // const { payload } = jwt.decode(c.req.header('token'))
    // // userのデータを返したり
  })

const authHonoApp = {
  endpoint: endpoint,
  app: app,
}

export { authHonoApp }

if (import.meta.vitest) {
  const { test, expect, beforeAll, afterAll, describe } = import.meta.vitest
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
}
