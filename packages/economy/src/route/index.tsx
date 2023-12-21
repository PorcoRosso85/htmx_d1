import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { logger } from 'hono/logger'

/**
 * ユーザーの取得先へリクエスト
 * リクエスト結果をストア
 * ストアをアルゴリズムへ
 * アルゴリズム算出結果
 * ポイント移行
 * 手動ポイント移行
 *
 */

const endpoints = {
  root: '/economy',
  select: '/economy/select',
  update: {
    root: '/economy/update',
    // asset: '/economy/update/asset',
  },
  calc: '/economy/calc',
  migrate: {
    root: '/economy/migrate',
    auto: '/economy/migrate/auto',
    manual: '/economy/migrate/manual',
  },
}

const query = (endpoints, id) => {
  switch (endpoints) {
    case '/economy':
      return `select * from root where ID = ${id}`
    default:
      throw new Error()
  }
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

  .get(endpoints.root, async (c) => {
    // user main
    return c.text('')
  })

  .get(endpoints.select, async (c) => {
    // select, from database to user
  })

  .get(endpoints.update.root, (c) => {
    // update, from api to database
  })

  .get(endpoints.migrate.auto, (c) => {
    // migrate auto, with other hook
  })

  .get(endpoints.migrate.manual, (c) => {
    // migrate manually, from user to user
  })

const economyHonoApp = {
  endpoint: endpoints.root,
  app: app,
}

export { economyHonoApp, endpoints, query }
