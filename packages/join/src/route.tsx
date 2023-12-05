import { Hono } from 'hono'
import { logger } from 'hono/logger'
import sql from 'sql-template-tag'
import { UserBasic, UserContact } from './schema'
import { Bindings } from '@quantic/config'

const endpoint = '/join'

const endpoints = {
  root: ['/', ''],
}

const app = new Hono<{ Bindings: Bindings }>().basePath(endpoint)

app.use('*', logger())

.get(endpoints.root[0], async (c) => {
  // console.debug(await c.env.DB.prepare(sql``))
  const id = crypto.randomUUID()
  const username = 'test'
  await c.env.D1DB.prepare(sql`INSERT INTO user_basic_info(id, username) VALUES(?, ?)`.sql)
    .bind(id, username)
    .run()
  const { results } = await c.env.D1DB.prepare(
    sql`SELECT * FROM user_basic_info`.sql,
  ).all<UserBasic>()
  console.debug('results: ', results)
  return c.render(
    <>
      {results.map((result) => (
        <p>
          ID: {result.id}, Name: {result.name}, Birthdate:{' '}
          {result.birthdate ? result.birthdate : 'N/A'}
        </p>
      ))}
    </>,
  )
})

export const joinHonoApp = {
  endpoint: endpoint,
  app: app,
}
