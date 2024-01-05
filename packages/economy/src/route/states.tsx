import { Hono } from 'hono'
import { Ends } from '../domains/types'

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
    query: {
      insert_user: (params) => '',
    },
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

export { feats, app }

export default app
