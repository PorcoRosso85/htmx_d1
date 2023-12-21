import { afterAll, beforeAll, describe, expect, test } from 'vitest'
import { endpoints, testHonoApp } from './route'

describe('/test', () => {
  test('get /, 200, header, message', async () => {
    const res = await testHonoApp.app.request(testHonoApp.endpoint)
    expect(res.status).toBe(201)
    expect(res.headers.get('X-Custom')).toBe('Thanks')
    expect(await res.json()).toEqual({ message: '/test' })
  })

  describe('post /get-jobs', () => {
    test('status 200', async () => {
      const res = await testHonoApp.app.request(`${testHonoApp.endpoint}${endpoints.getJobs}`, {
        method: 'POST',
      })
      expect(res.status).toBe(200)
      expect(res.headers.get('Content-Type')).toBe('text/html; charset=UTF-8')
    })

    test('status 404', async () => {
      const res = await testHonoApp.app.request('/test/invalid', {
        method: 'POST',
      })
      expect(res.status).toBe(404)
    })
  })

  describe('get /performance', () => {
    test('many time requesting', async () => {
      const responseTimes = []
      for (let i = 0; i < 10; i++) {
        const startTime = performance.now()

        // TODO: find url
        await fetch(`http://localhost:8787/${endpoints.performance.root}`)
        const endTime = performance.now()
        responseTimes.push(endTime - startTime)
      }

      const avgResponseTime = responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length

      expect(avgResponseTime).toBeLessThan(100)
    })
  })

  describe('get /ratelimit', () => {
    test('レートリミット以下のリクエスト', async () => {
      for (let i = 0; i < 100; i++) {
        const res = await testHonoApp.app.request(endpoints.ratelimit)
        expect(res.status).toBe(200)
      }
    })

    test('レートリミットを超えるリクエストは429', async () => {
      const res = await testHonoApp.app.request(endpoints.ratelimit)
      expect(res.status).toBe(429)
    })
  })
})
