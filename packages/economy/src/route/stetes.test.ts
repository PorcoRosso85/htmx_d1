import path from 'path'
import { afterAll, beforeAll, describe, expect, test } from 'vitest'
import type { UnstableDevWorker } from 'wrangler'
import { unstable_dev } from 'wrangler'
import { app, feats } from './states'

describe('結合テスト', () => {
  let res
  let worker: UnstableDevWorker

  beforeAll(async () => {
    const filePath = path.resolve(__dirname, './states.tsx')
    console.debug('filePath', filePath)
    worker = await unstable_dev(filePath, {
      experimental: { disableExperimentalWarning: false },
    })
    console.debug('worker', filePath, worker)
  })

  afterAll(async () => {
    if (worker) {
      await worker.stop()
    }
  })

  describe('get /bank', () => {
    test('get /bank, connection', async () => {
      await app.request('/bank')
    })
    test('get /bank, 200 and html', async () => {
      res = await worker.fetch('/bank')
      expect(res.status).toBe(200)
      expect(res.headers.get('content-type')).toBe('text/html; charset=UTF-8')
      expect(await res.text()).toContain('<h1>GetBank</h1>')
    })
  })
})
