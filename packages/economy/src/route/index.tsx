import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { logger } from 'hono/logger'

const endpoints = {
  root: '/economy', // 初期ページ表示
  user: {
    root: '/economy/user',
    register: '/economy/user/register', // ユーザー登録
    update: '/economy/user/update', // ユーザー更新
    delete: '/economy/user/delete', // ユーザー削除
  },
  transaction: {
    root: '/economy/transaction',
    in: '/economy/transaction/in', // 圏外資産＞圏内資産
    out: '/economy/transaction/out', // 圏内資産＞圏外資産
  },
  balance: '/economy/balance', // 残高表示
  history: '/economy/history', // 履歴表示
  setting: {
    root: '/economy/setting',
    auto: '/economy/setting/auto', // 自動設定（分配率、配当率）
  },
  notification: '/economy/notification', // 通知
  external: '/economy/external', // 外部サービス連携
  point: {
    root: '/economy/point',
    expiry: '/economy/point/expiry', // ポイント有効期限
    rank: '/economy/point/rank', // ポイントランク
  },
  support: '/economy/support', // サポート
}

const app = new Hono()

app
  .use(logger())

  .use(cors())

  .use(
    // jwt auth middleware
    // if authed
    // if not authed
  )

  /**
  1. root
      - ポイントエコノミーシステムの初期ページを表示するためのHTMLとTailwindCSS, ハイドレーションするJavascriptを作成します。
      1. get
      1. 要素一覧
          - ボタン
              - ユーザー
              - 各エンドポイントボタン
          - hx-targetとなるターゲット要素
      1. スクリプト機能一覧
          - HTMXヘッダリスナー
          - Service Worker
  * 
  */
  .get(endpoints.root, async (c) => {
    return c.html(
      <div hx-target="next div">
        // ユーザー
        <button type="button" hx-get={endpoints.user.root} />
        // 各エンドポイントボタン // 世代数問わず再帰的にボタンを作成する
        {Object.keys(endpoints).map((key) => {
          if (typeof endpoints[key] === 'string') {
            return <button type="button" hx-get={endpoints[key]} />
          }
          return Object.keys(endpoints[key]).map((key2) => {
            return <button type="button" hx-get={endpoints[key][key2]} />
          })
        })}
        <div />
      </div>,
    )
  })

const economyHonoApp = {
  endpoint: endpoints.root,
  app: app,
}

export { economyHonoApp, endpoints, query }

const query = (endpoints, id) => {
  switch (endpoints) {
    case '/economy':
      return `select * from root where ID = ${id}`
    default:
      throw new Error()
  }
}
