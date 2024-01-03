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
   * to [/user, /notFound,/onError, /bank, /transaction, /support]
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
  /** @xstate-layout N4IgpgJg5mDOIC5QDcCWYDusAEBDAdhNmADZgC2Y+ALrAHQzXYD0AxIywK6xgBOdAJgAMQgNpCAuolAAHAPaxU1VHPzSQAD0QAWAGwBGQQICsQgMzGz2swE4h2gQHYANCACeiRwA4zdXV-1hf21tIS8vXQBfSNc0TBwCIlIKKlo6eVgmZm4+Zl4wKFRMvlYMrJzePIKi6j5BEXEpJBAMpRU1Zq0EPUMBE3NLazsHF3cdG0MzIV0TYwCrKZtomJB8OQg4dTisPEJiMkoaeGbW5VV1LoBaXVcPBGu6ESfnl8do2PQdxP2Uo4YwLLqU7tC6IKxCOg+RyWfS6KZCGxeW6eHx0MzQoTCMy6bxed4gbYJPbJQ5pDjMNbUABick4hCBCja506iH0jl8FjMgRsU28tjCyIQumFdAc2hsjhsM2hOLeK0JuySB1S9HJqgAorxeHJeAzFGcOqAuvovBCbAJ5gYBDzjMYnIL9PpzXRHE8ZtpAn1rPiFd8SSr-uUeLqToyDaChRNHlyzGYBBYAvozEixt1EYJtHMhLaTT4zD7PkSlb80mUuMGqoViiHZGGQSyEE5DJZobDYVK+im7uLDM8ndNk9pJVF5YXFT9SfQy9kK5wZBBcLU9UzDZpWcYbKL-NCs9MswJBY4BNpITYz+eJUfbAX4uP-X9pxVmBsyEvQ-r60bWTM6GyArMuQiaZtEFAI-EccVHFdJ1THREcPlvP1lT+ckeGoZR8CgZdwwbE0BFFYwZlMOxdBCOxRjufRQl-cUbCHR0Zi8Qiby+YlkNLBQsjQjCoGYXBOGoORsM-NcEH0Ddf1MEQqNsLwj10YwHSTE8+lMBx7CCHwWKLCcA3JSlUAAM1QABjRcROBZkvzEkVSOmeMhGHPQLUFExHEec85KYhSJQibS73Y1UARYAAjAgAGthKs0T+0eDdkylcUfEIh0hDZQQMTSqY2VtJZR0QtiSynTjQoi5gTPyRcwCi1djQkpiYzSkJ2WhLtEF0Ry6Dos8Nzcj1YX8pCivSErmDC-BwuyecqpqiNxPczMYwEHKEQ6ijWUc4wXSk5acSdQJBsKycRsyUqJufZI31rD9ouNDrf0cXNM2zO1rRA1MvA9SFaNCfaLWhQ7i2O6dqF4AhYFwEyDWYZBcBIVAIB1SlZtwvpIW8QI2QsEIBH8QUbDmF1PIRLkNwlQHdIfUbQfByHoYgOd4bM2pEd4ZH3xXOa0roO1c1IgmRHjRTU2McVRQgnlwjk2ZjAp+8ONO5gafwCGofaZgwA0MATIE6qOZw6ykwhO15kdWwh3ZQVrHwu1aIiHldAmPF8tYoGA2nOQZCoPiSCgHUlAAC3IMbcEUEzmFUMAABU5AAeXwPXrs5hsmO+-wOumaVbTMfGRDRY8pWzAwQmxOXApOrJPe9uG-d4QPg8hkzaRoVBMIAZWoRJcF4CBYGYAArGRV0s2rEDtLq5KHCxs18mxBXRE97DPPkhYTMvho9r38B92v674kym7pHiO67nu+6gEg5DCkgUeshwHXTd0pQgiIQix9fjtQud5F4ahb5iyUGV-ywnFGKCw89xI8wlsYSUlh0Tk2WEAA */
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
      [key: string]: () => (JSX.Element | undefined) | (JSX.Element | undefined)[]
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
        root: () => {
          return <></>
        },
        anchors: (): JSX.Element[] | undefined => {
          return feats['get /'].client?.anchors.map((url, index) => (
            <>
              <a key={index.toString} href={url} hx-target="next main">
                {url}
              </a>
              <br />
              <main />
            </>
          ))
        },
        header: () => {
          return (
            <header>
              <h1>Header</h1>
            </header>
          )
        },
      },
    },
  },
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
    return c.html(<>{feats['get /'].client?.elements.anchors()}</>)
  })

  .get(feats['get /bank'].end, (c) => {
    return c.text('get /bank')
  })

  .post(feats['post /user/register'].end, (c) => {
    return c.html(<>{feats['post /user/register'].client?.elements.anchors()}</>)
  })

export { feats, app, Ends }

export default app
