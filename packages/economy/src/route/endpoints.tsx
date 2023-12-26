import * as crypto from 'crypto'
import { tbValidator } from '@hono/typebox-validator'
import { Bindings } from '@quantic/config'
import { type Static } from '@sinclair/typebox'
import { Context } from 'hono'
import { Hono } from 'hono'
import * as schema from '../dao/schema'

export const endpoints = {
  /**
   * @alias /economy
   * ポイントエコノミーシステムの初期ページを表示するためのHTMLとTailwindCSS, ハイドレーションするJavascriptを作成します。
   * javascriptのスクリプトは、scriptタグの中に記載します。
   *
   */
  root: {
    endpoint: '/economy',
    middleware: [],
    handler: (app: Hono<{ Bindings: Bindings }>) => async (c: Context) => {
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
    },
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
      handler: (app: Hono<{ Bindings: Bindings }>) => async (c: Context) => {
        const { email, user_name, user_role } = await c.req.parseBody()
        const user_id = new crypto.randomUUID().toString()
        const query = endpoints.user.register.query.insert_user({
          email,
          user_id,
          user_name,
          user_role,
        })
        await c.env.D1DB.prepare(query)

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
        // TODO: Add a return statement for the successful case
      },
      query: {
        // TODO: not nullのキーが欠けているとき静的型検査でエラーを出してほしい
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
