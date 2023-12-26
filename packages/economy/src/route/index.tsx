import * as crypto from 'crypto'
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
import { endpoints } from './endpoints'

/**
 * endpointsは以下のような構造になっています。
 * すべてのエンドポイントを含んでいます。すなわち、これ以外のエンドポイントは存在しません。
 * 言い換えると、すべての機能一覧がここに記載されており、設計の全容が把握できます。
 * このような設計にすることで、開発者はどのような機能があるかを把握でき、
 * また、開発者はどのような機能がないかを把握できます。
 */

const app = new Hono<{ Bindings: Bindings }>()

app
  .use(logger())

  .use(cors())

  .use(
    // jwt auth middleware
    // if authed
    // if not authed
  )

  .get(endpoints.root.endpoint, endpoints.root.handler)

  .post(
    endpoints.user.register.endpoint,
    // handler which can access to app's generics
    async (c) => await endpoints.user.register.handler(c),
  )

const economyHonoApp = {
  endpoint: endpoints.root,
  app: app,
}

export { economyHonoApp, endpoints }
