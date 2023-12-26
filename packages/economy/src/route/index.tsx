import { Bindings, config } from '@quantic/config'
/**
 * motivation: ポイントエコノミーシステムのルーティングを作成する
 */
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { logger } from 'hono/logger'
import { queries } from '../dao'
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

  .get(endpoints.root, async (c) => {
    /**
     * @see /economy
     */
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
        <script>console.log('hello world')</script>
      </div>,
    )
  })

  .post(endpoints.user.register, async (c) => {
    /**
     * @see /economy/user/register
     */
    // TODO: untested
    const { name, email } = c.req.parseBody()

    // register user
    const query = queries['user.register']
    const d1db = await c.env.D1DB.prepare(query)
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

/**
 * @import.meta.vitest
 * ```ts
 * assert(add(1, 2) === 3)
 * expect(add(1, 2)).toBe(3)
 * ```
 */
export const add = (a: number, b: number) => a + b
