import { Hono } from 'hono'
import { z } from 'zod'
import { zValidator } from '@hono/zod-validator'
import { Bindings } from '@quantic/config'

import { AddTodo, Item } from './components'

import sql, { empty, join, raw } from 'sql-template-tag'

type Todo = {
  title: string
  id: string
}

const endpoint = '/todo'

const app = new Hono<{ Bindings: Bindings }>().basePath(endpoint)

app.get('/', async (c) => {
  const { results } = await c.env.D1DB.prepare(sql`SELECT id, title FROM todo`.sql).all<Todo>()
  const todos = results
  return c.render(
    <div>
      <AddTodo />
      {todos.map((todo) => {
        return <Item title={todo.title} id={todo.id} />
      })}
      <div id="todo" />
    </div>,
  )
})

app.post(
  '/',
  zValidator(
    'form',
    z.object({
      title: z.string().min(1),
    }),
  ),
  async (c) => {
    const { title } = c.req.valid('form')
    const id = crypto.randomUUID()
    await c.env.D1DB.prepare(sql`INSERT INTO todo(id, title) VALUES(?, ?);`.sql)
      .bind(id, title)
      .run()
    return c.html(<Item title={title} id={id} />)
  },
)

app.delete(':id', async (c) => {
  const id = c.req.param('id')
  await c.env.D1DB.prepare(sql`DELETE FROM todo WHERE id = ?;`.sql).bind(id).run()
  c.status(200)
  return c.body(null)
})

export const todoHonoApp = {
  endpoint: endpoint,
  app: app,
}
