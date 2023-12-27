import { tbValidator } from '@hono/typebox-validator'
import { Bindings, config } from '@quantic/config'
import { type Static } from '@sinclair/typebox'
/**
 * motivation: ポイントエコノミーシステムのルーティングを作成する
 */
import { Context, Hono } from 'hono'
import { cors } from 'hono/cors'
import { logger } from 'hono/logger'
import { queries } from '../dao'
import * as schema from '../dao/schema'

/**
 * endpointsは以下のような構造になっています。
 * すべてのエンドポイントを含んでいます。すなわち、これ以外のエンドポイントは存在しません。
 * 言い換えると、すべての機能一覧がここに記載されており、設計の全容が把握できます。
 * このような設計にすることで、開発者はどのような機能があるかを把握でき、
 * また、開発者はどのような機能がないかを把握できます。
 */

const endpoints = {
  /**
   * ポイントエコノミーシステムの初期ページを表示するためのHTMLとTailwindCSS, ハイドレーションするJavascriptを作成します。
   * javascriptのスクリプトは、scriptタグの中に記載します。
   *
   */
  root: {
    endpoint: '/economy',
    middleware: [],
    query: (id: string) => {
      return `select * from root where ID = ${id}`
    },
  },

  user: {
    /**
     * @alias /economy/user
     * ユーザー情報
     */
    root: {
      endpoint: '/economy/user',
      handler: async () => {},
    },

    /**
     * @alias /economy/user/register
     * ユーザー登録
     */
    register: {
      endpoint: '/economy/user/register', // ユーザー登録
      /**
       * @param c
       * - email
       * - user_id
       * - user_name
       * - user_role
       */
      middleware: {
        validation: tbValidator('form', schema.userTableTypeBox.columns, (result, c) => {
          // FIXME: not working
          if (!result.success) {
            return c.text('Invalid!', 400)
          }
        }),
      },
      /**
       * formデータを受け取るためのUIを提供し、
       * formデータを受け取り、
       * データベースに登録します。
       *
       * @returns
       * - status code 200
       * - status code 500
       * - html
       */
      query: {
        // FIXME: not nullのキーが欠けているとき静的型検査でエラーを出してほしい
        insert_user: (params: Static<typeof schema.userTableTypeBox.columns>) => {
          return `INSERT INTO user (user_id, user_name, user_role, email) VALUES ('${params.user_id}', '${params.user_name}', '${params.user_role}', ${params.email});`
        },
      },
    },

    /**
     * @alias /economy/user/update
     * ユーザー更新
     * formデータを受け取るためのUIを提供し、
     * formデータを受け取り、データベースを更新します。
     */
    update: '/economy/user/update', // ユーザー更新

    delete: '/economy/user/delete', // ユーザー削除

    info: {
      /** */
      balance: '/economy/balance', // 残高表示

      /** */
      history: '/economy/history', // 履歴表示
    },
    setting: {
      /** */
      root: '/economy/setting',

      /** */
      auto: '/economy/setting/auto', // 自動設定（分配率、配当率）
    },

    /** */
    notification: '/economy/notification', // 通知
  },

  transaction: {
    /**
     * @alias /economy/transaction
     * 取引
     * 取引を行うためのUIを提供し、
     * 取引を行うロジックを実行、データベースを更新します。
     *
     * @param {string} originatingEntityId - 取引元のID
     * @param {string} targetEntityId - 取引先のID
     * @param {string} amount - 取引金額
     * @param {string} reasonOfType - 取引の説明
     * @param {string} transactionType - 取引の種類
     * @param {string} transactionDate - 取引日
     * @param {string} transactionId - 取引ID
     *
     * 取引の種類は、取引の説明によって決定されます。
     *
     */
    root: '/economy/transaction',
  },

  external: '/economy/external', // 外部サービス連携

  point: {
    root: '/economy/point',
    expiry: '/economy/point/expiry', // ポイント有効期限
    rank: '/economy/point/rank', // ポイントランク
  },

  support: '/economy/support', // サポート
}

const app = new Hono<{ Bindings: Bindings }>()

app
  .use(logger())

  .use(cors())

  .use(
    // jwt auth middleware
    // if authed
    // if not authed
  )

  .get(endpoints.root.endpoint, (c) => {
    return c.html(
      <div hx-target="next div">
        <button type="button" hx-get={endpoints.user.root} />
        {/* {Object.keys(endpoints).map((key) => {
            if (typeof endpoints[key] === 'string') {
              return <button type="button" hx-get={endpoints[key]} />
            }
            return Object.keys(endpoints[key]).map((key2) => {
              return <button type="button" hx-get={endpoints[key][key2]} />
            })
          })} */}
        <div />
        <script>console.log('hello world')</script>
      </div>,
    )
  })

  .post(
    endpoints.user.register.endpoint,
    /**
     *
     * @param c
     * @returns
     * handler is required to
     * - parse body
     * - insert data to database
     * - check inserted or not
     * - return status code
     *  - 5xx
     *   - 500 if not inserted
     *   - 500 if database error
     *  - 4xx
     *   - 400 if validation error
     *   - 401 if not authorized
     *   - 403 if forbidden
     *   - 404 if not found
     *   - 405 if method not allowed
     *   - 406 if not acceptable
     *   - 409 if conflict
     *   - 415 if unsupported media type
     *   - 422 if unprocessable entity
     *   - 429 if too many requests
     *   - 451 if unavailable for legal reasons
     *  - 3xx
     *   - 301 if moved permanently
     *   - 302 if found
     *   - 303 if see other
     *   - 304 if not modified
     *
     *   - 307 if temporary redirect
     *   - 308 if permanent redirect
     *  - 2xx
     *   - 200 if ok
     *   - 201 if created
     *   - 202 if accepted
     *   - 203 if non-authoritative information
     */
    async (c: Context) => {
      const { email, user_name, user_role } = await c.req.parseBody()
      const user_id = crypto.getRandomValues(new Uint32Array(1))[0].toString(16)
      console.debug('user_id', user_id)

      // tested
      const query = endpoints.user.register.query.insert_user({
        email,
        user_id,
        user_name,
        user_role,
      })
      // TODO: when test this, 'unstable_dev' is required
      await c.env.D1DB.prepare(query)

      // TODO: test
      // check inserted or not
      const query2 = "select * from user where user_id = 'user_id'"
      const result = await c.env.D1DB.prepare(query2)
      if (result === null) {
        // return status code 500
        // TODO: check this or 'onError' in hono
        c.status(500)
        c.header('X-Status-Reason', 'User not inserted')
        c.header('X-Message', 'User not inserted')
        return c.html(<div>user not inserted</div>)
      }
      return c.html(<div>user inserted</div>)
    },
  )

const economyHonoApp = {
  endpoint: endpoints.root,
  app: app,
}

export { economyHonoApp, endpoints }

export default app
