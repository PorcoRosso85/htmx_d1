import { tbValidator } from '@hono/typebox-validator'
import { Bindings, config } from '@quantic/config'
import { type Static, Type } from '@sinclair/typebox'
import { Value } from '@sinclair/typebox/value'
/**
 * motivation: ポイントエコノミーシステムのルーティングを作成する
 */
import { Context, Hono } from 'hono'
import { cors } from 'hono/cors'
import { logger } from 'hono/logger'
import * as schema from '../dao/schema'
import { T } from '../dao/schema'

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
    query: (id: string) => {
      return `select * from root where ID = ${id}`
    },
  },

  user: {
    /**
     * ユーザー情報
     */
    root: {
      endpoint: '/economy/user',
      handler: async () => {},
    },

    /**
     * ユーザー登録
     * formデータを受け取るためのUIを提供し、
     * formデータを受け取り、データベースを更新します。
     */
    register: {
      /**
       * ユーザー登録
       */
      endpoint: '/economy/user/register',
      /**
       * @param c
       * - email
       * - user_id
       * - user_name
       * - user_role
       */
      middleware: {
        validation: tbValidator('form', schema.userTableTypeBox.columns, (result, c) => {
          // []untested
          console.debug('result', result)
          if (!result.success) {
            return c.text('Invalid!', 400)
          }
        }),
      },
      /**
       * formデータを受け取るためのUIを提供し、
       * formデータを受け取り、
       * データベースに登録します。
       */
      query: {
        insert_user: (params: Static<typeof schema.userTableTypeBox.columns>) => {
          return `INSERT INTO user (user_id, user_name, user_role, email) VALUES ('${params.user_id}', '${params.user_name}', '${params.user_role}', ${params.email});`
        },
      },
    },

    /**
     * ユーザー更新
     * formデータを受け取るためのUIを提供し、
     * formデータを受け取り、データベースを更新します。
     */
    update: {
      endpoint: '/economy/user/update',
      query: {},
    },

    /** */
    delete: '/economy/user/delete',

    setting: {
      /** */
      root: '/economy/setting',

      /** */
      auto: '/economy/setting/auto', // 自動設定（分配率、配当率）
    },

    /** */
    notification: '/economy/notification', // 通知
  },

  account: {
    /**
     * アカウント, 口座, 勘定科目
     * アカウントの作成、更新、削除を行います。
     * ユーザーは最低一つのアカウントを持ちます
     * アカウントは一意のIDを持ち、
     * IDは「ユーザーID＋アカウント名」で構成されます。
     */
    root: '/economy/account',

    /**
     * アカウント作成
     * アカウントの作成を行います。
     * アカウントは一意のIDを持ち、
     * IDは「ユーザーID＋アカウント名」で構成されます。
     *
     */
    create: {
      endpoint: '/economy/account/create',
      query: {
        insert_account: (params: Static<typeof schema.accountTableTypeBox.columns>) => {
          return `INSERT INTO account (account_id, account_name, account_type) VALUES ('${params.account_id}', '${params.account_name}', '${params.account_type}');`
        },
        /**
         *
         * 既存のaccount_idを取得します。
         * この関数は、account_idがユニークであることを保証するために必要です。
         * account_idがバリデーションされたときのみ、クエリを実行します。
         */
        select_account_id: (account_id: string) => {
          return Value.Check(T.accountId, account_id)
            ? `SELECT account_id FROM account WHERE account_id = '${account_id}';`
            : (() => {
                throw new Error('invalid account id')
              })()
        },
      },
      /**
       * account_idの生成
       * account_nameのバリデーションを強化し, バリデーションに成功した場合のみaccount_idを生成します。
       */
      account_id: (user_id: string, account_name: string) => {
        return Value.Check(T.accountName, account_name)
          ? `${user_id}_${account_name}`
          : (() => {
              throw new Error('invalid account name')
            })()
      },
      /**
       * 生成されたaccount_idがデータベースに存在しないことを保証
       * この関数は、account_idがユニークであることを保証するために必要です。
       *
       * @param {string} account_id - アカウントID
       * @returns {boolean} - アカウントIDが存在しない場合はtrueを返します。
       */
      // [] untested
      validateAccountIdInDatabase: (account_id: string) => {
        // query account_id
        const query = endpoints.account.create.query.select_account_id(account_id)
        query
      },
    },
    update: '/economy/account/update',
    delete: '/economy/account/delete',
  },

  transaction: {
    /**
     * 取引
     * 取引とは、ある口座から別の口座への数値の移動です。
     * この口座のユーザーは問わず、
     * 自らの別の口座への移動も取引として、あるいは、
     * 別のユーザーの口座への移動も取引として扱います。
     *
     * 取引を行うためのUIを提供し、取引を行うロジックを実行、データベースを更新します。
     */
    execute: {
      /**
       * 取引実行
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
      endpoint: '/economy/transaction/execute',
      query: {},
    },
    /**
     * ユーザー情報
     * ユーザーの各残高を表示します。
     */
    balance: {
      endpoint: '/economy/transaction/balance',
      query: {},
    },

    /**
     * ユーザー情報
     * ユーザーの各残高/各取引の履歴を表示します。
     */
    history: {
      endpoint: '/economy/transaction/history',
    },
  },

  open: {
    root: {
      endpoint: '/economy/open',
    },

    /**
     * アルゴリズムエンドポイントは、
     * 基準となる数値と選択されたアルゴリズムから計算された数値を返します。
     */
    algorithm: {
      basic: {
        /**
         * このエンドポイントは、リクエストした数値をそのまま返します。
         */
        oneToOne: {
          endpoint: '/economy/open/algorithm/basic/oneToOne',
        },
      },
      accountingStandards: {
        /**
         * 日本の会計基準
         */
        jpn: {
          endpoint: '/economy/open/algorithm/accountingStandards/jpn',
          middleware: {},
          query: {},
        },
        /**
         * 国際会計基準
         */
        global: {
          endpoint: '/economy/open/algorithm/accountingStandards/global',
          middleware: {},
          query: {},
        },
      },
    },
  },
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

      // TODO: untested
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

if (import.meta.vitest) {
  const { describe, test, expect } = await import('vitest')

  describe('account.create.account_id', () => {
    test('account_id', () => {
      const user_id = 'user_id'
      const account_name = 'account_name'
      const account_id = endpoints.account.create.account_id(user_id, account_name)
      expect(account_id).toBe('user_id_account_name')
    })
  })
}
