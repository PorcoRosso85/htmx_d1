import { afterAll, beforeAll, describe, expect, test } from 'vitest'
import type { UnstableDevWorker } from 'wrangler'
import { unstable_dev } from 'wrangler'
import { authHonoApp } from './route'

describe.skip('Wrangler unstable_dev', () => {
  let worker: UnstableDevWorker

  beforeAll(async () => {
    worker = await unstable_dev('src/index.ts', {
      experimental: { disableExperimentalWarning: true },
    })
  })
  // afterAll(async () => {
  //   await worker.stop()
  // })

  test('get /', async () => {
    const res = await worker.fetch('/')
    expect(res.status).toBe(200)
    expect(await res.text()).toBe('Hello Hono!')
  })
})
