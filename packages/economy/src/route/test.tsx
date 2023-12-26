import { Bindings } from '@quantic/config'
import { Hono } from 'hono'

const app = new Hono<{ Bindings: Bindings }>()

const ends = {
  endpoint: '/economy',
  handler: async (c) => {
    return c.html(
      <div hx-target="next div">
        <button type="button" hx-get={ends.user.root} />
        <div />
        <script>console.log('hello world')</script>
      </div>,
    )
  },
}

app.get(ends.endpoint, ends.handler)
