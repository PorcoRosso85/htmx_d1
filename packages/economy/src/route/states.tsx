import { Context, Hono } from 'hono'
import { createMachine } from 'xstate'
import * as components from '../components'

/**
 * このオブジェクトにエンドポイントを定義しないと
 * featsの型が正しくなくなり
 * webサーバーにエンドポイントを登録できません
 */
const states = {
  /**
   * from /
   * to [/user, /notFound,/onError, /bank, /transaction]
   */
  'get /': {
    on: {
      'get /user.200': 'get /user',
    },
  },

  /** hono returns 404 */
  'get /notFound': {},

  /** hono returns 500 */
  'get /onError': {},

  /**
   * from /user
   * to [/user/*, /bank, /transaction]
   */
  'get /user': {},
  // [] postとgetの統合、postにリクエストボディがある場合はpostに、ない場合はgetにする
  'post /user/register': {
    on: {
      'post /user/register.200': 'get /user',
    },
  },
  'post /user/update': {},
  'post /user/delete': {},
  'get /setting': {},
  'post /setting/auto': {},
  'get /notification': {},
  'get /bank': {},
  'post /bank/create': {},
  'post /bank/update': {},
  'post /bank/delete': {},
  'post /transaction/validornot': {},
  'post /transaction/duplicatedornot': {},
  'post /transaction/execute': {},
  'post /open/algorithm/basic/oneToOne': {},
  'post /open/algorithm/accountingStandards/jpn': {},
  'post /open/algorithm/accountingStandards/global': {},
  'get /support': {},
}

export const nameOfMachine = createMachine({
  /** @xstate-layout N4IgpgJg5mDOIC5QDcCWYDusAEBDAdhNmADZgC2Y+ALrAHQzXYD0AxIywK6xgBOdAJgAMQgNpCAuolAAHAPaxU1VHPzSQAD0QAWAGwBGQQICsQ3cb36A7AIDM2gDQgAnoisAOW3V3v92-fq2xrZCxhYAvuFOaJg4BESkFFS0dPKwTMzcfMy8YFCo6XysaRlZvDl5BdR8giLiUkggaUoqao1aCJZGpuaWNvZOrp0AnIYhugLWVla2trrzkVEg+HIQcOoxWHiExGSUNPCNzcqq6h0AtLqDiOfGdMMPw1bD7lb6QrPC2pHR6FvxuySBwYYAy6mOrTOiHsQjoniswX8QkCVh81wQHi8tgRAm02mM1gM7l0PxAmziO0S+xSHGYK2oADE5JxCOCFC1Tu1ENYscE-PZdHpUY4XIh5ro6NoTPpdFYhO5jFZtLZSeTtgk9sl6LTVABRXi8OS8NmKE5tUAdfTuWHDAS+YwCeYO-QEgTogK2uhy5FCJ7uZWvKyqv4UjVAmmgrg8Y1HdlmqEIXSjOgfQK2F0+QLGYbo7QvQT44byh5fF4kpZqgFUrWpBSlaMVfKFGOyOOQrkIARvOjBBEhYzW3H2Ky55MiESvbRK-RF1HB2LqwHU+glKPZTgyCC4aomjnmzTc7OSnzTGdfXECN2ijG4+4iGW23oz4zz-6UzXA1eZBtrMg72Omu2FrchMdDWL4U6TDYwzYiO16+N4CIiAILwvBYKoViGi7VsCtI8NQyj4FAu7xh2VoCJKxgTD4sy+ro9gikMfiwi6IgeBeoSzO4r6hkuNZfvhhFQMwuCcNQcgkUBB4IC6wxgaYyL+DB5i2Dm14BPY3RWmY0x2LMPHYR+EYZPSqAAGaoAAxtuUkQpywEyfM3jaGYU5yhMYS2O46ImFYYHju4jqKWY2IGVWRnapGzAAEYEAA1pJ9nSTOsKhDBqF+O4tq2O6yJ+V2BKoumHjcZhC7heGK51iwsX4HFzCWbk25gIl+6WkeCrptogZ2MSUroroQh+cMCmjJ4QR4mF76VbW6Q1fFmSbs1rUJi6fn4umql6MixLzLlCJeqY7wWCYHxSlNYbLrNGS1fVv6gi1AF7qtg1gW8WUBC6Qqoui-qGAqQi4vMTwoQSF18Z+1XMNQvAELAuCWWazDILgJCoBARr0itZGXnCHgooDoz4jY6Ije4cL3j65g+L64M4SkX4w3DCNIxAG5o9Z1QY7wWNPaRDnvIYzqvEmIPucY6IWHJU5HeYvgMcMdMRddLBM-g8OI60zBgBoYCWWJj2toBSWWiEPZ2iixIzNT+i5rYFEOkdl6TA81hKzNX5yDIVAiSQUBGkoAAW5AxbgiiWcwqhgAAKnIADy+CG00bYm4gCpwno7iBQSoxA9515FrC9umCY8vdVa7tXZ73v4L7-u8EHIcI5ZzI0KgREAMrUPEuC8BAsDMAAVjI+52W1iAOvcrymH28IuRL17YtoKYl7Mx3Wvilf8VDXs+6j9eNyJlktyyQldz3fcD1AJByLFJDYw5-XqfmHlsfYtpDRhvzldNV14Ru8heDUAfslZ4gh8bl2JB8LKV4hjpjuIqAkipOqDQsC+RYQA */
  id: 'views and elements',
  tsTypes: {} as import('./states.typegen').Typegen0,
  schema: {
    // context: {} as { contextType },
    events: {} as { type: 'eventType' },
  },
  context: {
    // initialContextValue,
  },
  initial: 'get /',
  states: states,
})

type BaseType = {
  end: string
  error: object
  [key: string]: any
  component?: JSX.Element
  query?: (params: any) => string
  views?: {
    anchors: string[]
    elements: {
      anchors: () => (JSX.Element | undefined) | (JSX.Element | undefined)[]
    }
    contain?: string[]
  }
}

type GetType<T = {}> = BaseType & T

type PostType = BaseType & {
  validate?: (c: Context) => void
}

type DeleteType<T = {}> = BaseType & T

type PutType<T = {}> = BaseType & {
  validate: (c: Context) => void
} & T

type Ends = {
  [K in keyof typeof states]: K extends `get /${string}`
    ? GetType
    : K extends `post /${string}`
      ? PostType
      : K extends `delete /${string}`
        ? DeleteType
        : K extends `put /${string}`
          ? PutType
          : never
}

// これにより、FeatsオブジェクトはStatesのキーのみを含むことが保証されます
const feats: Ends = {
  'get /bank': {
    end: '/bank',
    error: {},
  },

  'get /user': {
    end: '/user',
    error: {},
  },

  /**
   *
   */
  'post /user/register': {
    end: '/user/register',
    /**
     *
     */
    error: {},
    validate: (c) => {
      const { name, email } = c.req.parseBody()
      if (!name || !email) {
        throw new Error('name or email is empty')
      }
    },
    /**
     * @param c
     * - email
     * - user_id
     * - user_name
     * - user_role
     */
    query: (params) => '',
    /**
     * component should render anchor tag to
     * - /user
     */
    views: {
      anchors: ['/user'],
      elements: {
        /** anchorsのリンクへのanchor要素 */
        // [] todo
        anchors: () => {
          return feats['post /user/register'].views?.anchors.map((url, index) => (
            <a key={index.toString} href={url}>
              {url}
            </a>
          ))
        },
      },
    },
  },
}

const app = new Hono()

app
  .notFound((c) => c.text('not found'))

  .onError((e, c) => {
    console.error(e)
    c.status(500)
    return c.text('on error')
  })

  .get(feats['get /bank'].end, (c) => {
    return c.text('get /bank')
  })

  .post(feats['post /user/register'].end, (c) => {
    return c.html(
      <>
        <button type="button">Register</button>
        {feats['post /user/register'].views?.elements.anchors()}
      </>,
    )
  })

export { feats, app, Ends }

export default app
