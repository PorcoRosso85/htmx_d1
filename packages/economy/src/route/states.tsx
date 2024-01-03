import { Context, Hono } from 'hono'
import { createMachine } from 'xstate'

/**
 * このオブジェクトにエンドポイントを定義しないと
 * featsの型が正しくなくなり
 * webサーバーにエンドポイントを登録できません
 */
const states = {
  /**
   * from /
   * to [/user, /bank, /transaction, /support]
   */
  'get /': {
    on: {
      'get /user.200': 'get /user',
      'get /bank.200': 'get /bank',
      'get /transaction.200': 'get /transaction',
      'get /support.200': 'get /support',
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
  'post /user/register': {},

  'post /user/update': {},

  'post /user/delete': {},

  'get /user/setting': {},

  /** every api for each items to be registerd/updated */
  'post /user/setting': {},

  'post /setting/auto': {},

  'get /notification': {},

  'get /bank': {},

  'post /bank/create': {},

  'post /bank/update': {},

  'post /bank/delete': {},

  'get /transaction': {},

  'post /transaction/validornot': {},

  'post /transaction/duplicatedornot': {},

  'post /transaction/execute': {},

  'post /open/algorithm/basic/oneToOne': {},

  'post /open/algorithm/accountingStandards/jpn': {},

  'post /open/algorithm/accountingStandards/global': {},

  'get /support': {},
}

export const nameOfMachine = createMachine({
  /** @xstate-layout N4IgpgJg5mDOIC5QDcCWYDusAEBDAdhNmADZgC2Y+ALrAHQzXYD0AxIywK6xgBOdAJgAMQgNpCAuolAAHAPaxU1VHPzSQAD0QAWABwBGQQICsIg9u1CA7AICc2gDQgAnomO7bdbQDYrugMza+hb6trZWAL4RTmiYOAREpBRUtAxgTGwczABGBADWgiLiUkgg8orKqupaCHqGAiZmwZY29k6utVaeVt7+3g3G-bq6QZHRILFYeITEZJQ09Fns6SzUvASwuADGlfiFYpLq5UoqaqU1dUamQuYtdo4ubv66gs-e2lZC3vp+fVEx6CmCVmyQWaQyywysE4MnkvGo+2KRwUJyq5x0BiuTQs1nu7R0Anqw28xgEXW0tn8-mMYwBcWmiTmKXo5Qy3D4zF4YCgqFg1D4rFZXB4vE53N5-P4wgOJVkKN21Qx9UaN2auLajwQthEdF6wX0N28vh8tii43wcggcHUk3iMyS81oyIqp0VCAAtN58R7vP8JoC7YzQakss7UWdQDVAkI6AErMZ9IF-IT9MZtP5vemBHRSXp7EJjFSrPpdH7bQyQY7FitmBbqAAxOScQhhhXohA-fx0an+RMFrqq2zGb2-bvx1MFw0k4xlgMVh3M8EsVQAUV4vDkvFbrvbJZjtgE5n03xGyap3v8Vm0dCEFN03iHaY+Jln9OBC7BWXZW9KxzbkcQYtDCEXtCW0AQgmedNvWMWxvC8axLDTB9tATfxXyBe0mTBIVmG-MUeT5PhtzRACEDJQxC3jG4bGeNMrG9bUY2TBMwlMd53n0DDA0rRdcPwmEIFwfkSIjTREFTTwfF0eN-FvDwhgYzUKX3MJbBLYxSQorjxnLd9sNSfiRWYK0yBE395R3Mjj2zH4DD6ElAggjNNSHF5dBEfRgjTQIjW4+cDOrNljJ4ahlHwKBRLdY8u1kxNhB8HpvWCGNglsYYDWEKwbHTfz9ODFkFGCjlQvCyKLJdUjxI7WCcxVCkgjCPpvUxY04NguNPkLPKsIKuhcNK1AIuYXBOGoOQot3WqJyELzSUGOTz01EZDF0UxDwsFD+nQ3S53yqsl1rORlAAM1QLZhKsspLKqmpj3g94vmeODwN0YQvU1UIXn6D44P7bKsx6oMDqyXJ8DySayKAm9QOCCDE1PTMui8GlqXeYsSQEX1drfXqDtwsG8mYLYuWEsBIeqyTY0LRNi3TbVUN0ZLE2vAY7Go96fiB3icKKlhCbwmQhPMuVKrEu6aRR3tnoTLyGgeDoTCsG8wjegtBl8PoZxxzDgb4vmcnyEykhF66xei7xUuLGT718ARLwLGCKS8K97Dk2XPm0bmPxDGs1g2bZ-zN8M3WhkD9DA+GoJcjoqLoSl7Y88J1dCb3Av6g3-fwTYdlOZhkFwEhUAgTc6wpu6GljPxE1JDyTAsJnNSNeDwITWa29t7G6V1nnDMz9Zs8DvOIBhIuLv5EveDLiqQ93Wa6pLYkIJAgt9BHCD488rGRHCPydZ4n3Cr5VYB5z3ZmDADQwC2MbyZnoO7rkur7IPUZGg+jpLeVocRGy2bQk1mnPquE5AyCoCNEgUBNxKAABbkENooLYzBVBgAACpyAAPL4DvqLWeZE1qxmkjJDaNh+gCGSrNZWZI0IM3ttOIB+MDagPAYXKBvBYHwO2FsJsNAhpQAAMrUASLgXgEBYDMAAFYyDEn+K6NRSTxxkhSGwPwPiWw-hJawxg6AcysHJcOP0GH62PsgsB+AIFsI4SNLY3DmxlUEcI0R4ioAkDkLkEg5cCQXlTDmK8ejNKUl8JpL2+8Ap9SyNCWEm5qCeIQGHWG4FIKI2UsIRREEgjph8KYUsZogA */
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
  client?: {
    anchors: string[]
    elements: {
      [key: string]: () =>
        | (JSX.Element | undefined)
        | (JSX.Element | undefined)[]
        | ((props: any) => JSX.Element | undefined)
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
  // const feats = {

  /**
   * /user, /bank, /transaction, /support機能のトリガーを提供する
   * トリガーは、各エンドポイントへのアンカー要素
   */
  'get /': {
    end: '/',
    error: {},

    // []リロードしたときbody以外リロードさせなければ、bodyにhtml（あるいは局所的css, js）を追加するだけでいい、body=htmlにできる
    client: {
      anchors: ['/user', '/bank', '/transaction', '/support'],
      elements: {
        /**
         * client側が持つ機能を一括で提供する
         * 機能一覧
         * - hx-boost
         * - htmx preload extension
         * - service-workerスクリプト, PWA
         * - layout
         */
        Root: (props = { children: null }) => {
          return (
            <div hx-boost="true" {...props}>
              {props.children}
            </div>
          )
        },
        anchors: (): JSX.Element[] | undefined => {
          return feats['get /'].client?.anchors.map((url, index) => (
            <>
              <a key={index.toString} href={url} hx-target="next main">
                {url}
              </a>
              <br />
            </>
          ))
        },
        Header: () => {
          return (
            <header>
              <h1>Header</h1>
            </header>
          )
        },
      },
    },
  },

  /**
   * /user/*機能のトリガーを提供する
   * トリガーは、各エンドポイントへのアンカー要素
   */
  'get /user': {
    end: '/user',
    error: {},
    client: {
      anchors: ['/user/setting', '/user/register', '/user/update', '/user/delete'],
      elements: {},
    },
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
    client: {
      anchors: ['/user'],
      elements: {
        /** anchorsのリンクへのanchor要素 */
        // [] todo
        anchors: () => {
          return feats['post /user/register'].client?.anchors.map((url, index) => (
            <a key={index.toString} href={url}>
              {url}
            </a>
          ))
        },
      },
    },
  },
  'get /bank': {
    end: '/bank',
    error: {},
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

  .get(feats['get /'].end, (c) => {
    const RootCompo = feats['get /'].client?.elements.Root
    return RootCompo !== undefined
      ? c.render(
          <div hx-target="next main">
            <RootCompo>{feats['get /'].client?.elements.anchors()}</RootCompo>
            <main />
          </div>,
        )
      : console.error('RootCompo is undefined')
  })

  .get(feats['get /user'].end, (c) => {
    return c.text('get /user')
  })

  .get(feats['get /bank'].end, (c) => {
    return c.text('get /bank')
  })

  .post(feats['post /user/register'].end, (c) => {
    return c.html(<>{feats['post /user/register'].client?.elements.anchors()}</>)
  })

export { feats, app, Ends }

export default app
