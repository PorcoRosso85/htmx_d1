import { Hono } from 'hono'
import { generateHonoObject } from 'hono-do'
import { html } from 'hono/html'

const endpoint = '/do'

const endpoints = {
  root: '/',
  counter: {
    root: '/counter',
    increment: '/increment',
    decrement: '/decrement',
  },
}

const app = new Hono<{
  Bindings: {
    COUNTER: DurableObjectNamespace
  }
}>().basePath(endpoint)

// app.all(endpoints.counter.root, (c) => {
//   const id = c.env.COUNTER.idFromName('Counter')
//   const obj = c.env.COUNTER.get(id)
//   return obj.fetch(c.req.raw)
// })

app
  .get(endpoints.root, (c) =>
    c.html(
      <>
        <button type="button" hx-get="/do/counter">
          <p>counter</p>
        </button>
        <div />
      </>,
    ),
  )

  .get(endpoints.counter.root, (c) => {
    return c.html(
      <div hx-target="previous span">
        <h1>Counter</h1>
        <p>
          Current value: <span id="value" />
        </p>
        <button type="button" id="increment" hx-post="/do/counter/increment">
          Increment
        </button>
        <button type="button" id="decrement" hx-post="/do/counter/decrement">
          Decrement
        </button>
      </div>,
    )
  })

const Counter = generateHonoObject(`${endpoint}/${endpoints.counter.root}`, async (app, state) => {
  const { storage } = state
  let value = (await storage.get<number>('value')) ?? 0

  app
    // TODO: not found route
    .post(endpoints.counter.increment, (c) => {
      storage.put('value', value++)
      console.debug(value)
      return c.text(value.toString())
    })

    .get('/', (c) => {
      return c.text(value.toString())
    })
})

const doHonoApp = {
  endpoint: endpoint,
  app: app,
}

export { doHonoApp, Counter }
