import { Bindings } from '@quantic/config'
import { Hono } from 'hono'
import { logger } from 'hono/logger'
import sql from 'sql-template-tag'
import { User, UserBasic, UserContact } from './schema'

const endpoint = '/join'

const endpoints = {
  root: ['/', ''],
  insert: ['/insert', ''],
  basic: ['/basic', ''],
  contact: ['/contact', ''],
  join: ['/join', ''],
}

const app = new Hono<{ Bindings: Bindings }>().basePath(endpoint)

app
  .use('*', logger())

  .get(endpoints.root[0], async (c) => {
    await c.env.D1DB.prepare(
      sql`
        CREATE TEMPORARY TABLE IF NOT EXISTS user_temp (
            id VARCHAR(255),
            username VARCHAR(255),
            birthdate DATE,
            email VARCHAR(255),
            phone VARCHAR(255)
        );`.sql,
    )
    const { results } = await c.env.D1DB.prepare(
      sql`
      SELECT name FROM sqlite_master WHERE type='table'
    `.sql,
    ).all()
    console.debug('show tables result: ', results)

    return c.html(
      <>
        <div hx-get={`${endpoint}${endpoints.insert[0]}`} hx-swap="none" hx-trigger="load" />
        <button type="button" hx-get={`${endpoint}${endpoints.basic[0]}`} hx-target="next div">
          basic
        </button>
        <button type="button" hx-get={`${endpoint}${endpoints.contact[0]}`} hx-target="next div">
          contact
        </button>
        <button type="button" hx-get={`${endpoint}${endpoints.join[0]}`} hx-target="next div">
          join
        </button>
        <div />
      </>,
    )
  })

  .get(endpoints.insert[0], async (c) => {
    const id = crypto.randomUUID()
    const username = 'insert'
    await c.env.D1DB.prepare(sql`INSERT INTO user_basic_info(id, username) VALUES(?, ?)`.sql)
      .bind(id, username)
      .run()
    const [email, phone] = ['a@b', '+81']
    await c.env.D1DB.prepare(
      sql`INSERT INTO user_contact_info(id, email, phone) VALUES(?, ?, ?)`.sql,
    )
      .bind(id, email, phone)
      .run()
    return c.html('done')
  })

  .get(endpoints.basic[0], async (c) => {
    const { results } = await c.env.D1DB.prepare(
      sql`
        SELECT
            ut.id,
            ut.username,
            ut.birthdate,
            ut.email,
            ut.phone
        FROM
            user_temp ut
        JOIN
            user_basic_info ubi ON ut.id = ubi.id;

      `.sql,
    ).all<UserBasic>()
    // console.debug('results: ', results)
    return c.html(
      <>
        {results.map((result) => (
          <p>
            {/* ID: {result.id},  */}
            Name: {result.username}, Birthdate: {result.birthdate ? result.birthdate : 'N/A'}
          </p>
        ))}
      </>,
    )
  })

  .get(endpoints.contact[0], async (c) => {
    const { results } = await c.env.D1DB.prepare(
      sql`
        SELECT
            ut.id,
            ut.username,
            ut.birthdate,
            ut.email,
            ut.phone
        FROM
            user_temp ut
        JOIN
            user_contact_info uci ON ut.id = uci.id;`.sql,
    ).all<UserContact>()
    // console.debug('results: ', results)
    return c.html(
      <>
        {results.map((result) => (
          <p>
            {/* ID: {result.id},  */}
            email: {result.email} phone: {result.phone}
          </p>
        ))}
      </>,
    )
  })

  .get(endpoints.join[0], async (c) => {
    const { results } = await c.env.D1DB.prepare(
      sql`
        SELECT
            user_basic_info.id,
            user_basic_info.username,
            user_basic_info.birthdate,
            user_contact_info.email,
            user_contact_info.phone
        FROM
            user_basic_info
        JOIN
            user_contact_info
        ON
            user_basic_info.id = user_contact_info.id;
      `.sql,
    ).all<User>()
    console.debug('results: ', results)
    return c.html(
      <>
        {results.map((result) => (
          <p>
            {result.username}/{result.email}
          </p>
        ))}
      </>,
    )
  })

export const joinHonoApp = {
  endpoint: endpoint,
  app: app,
}
