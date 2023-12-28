import path from 'path'
import { PreviewServer, preview } from 'vite'
import { afterAll, beforeAll, describe, expect, test } from 'vitest'
import type { UnstableDevWorker } from 'wrangler'
import { unstable_dev } from 'wrangler'
import { economyHonoApp, endpoints } from '../index'

export { browserWorkerTest, e2eTest, apiTest }

const browserWorkerTest = (
  endpoint: string,
  method = 'GET',
  body: { [key: string]: any } = {},
  expected?: string,
) => {
  console.debug('endpoint', endpoint)
  describe('200,', () => {
    let res
    let worker: UnstableDevWorker

    beforeAll(async () => {
      // relative path from project root to app file
      // index.ts/x should export app as default
      const filePath = path.resolve(__dirname, './index.tsx')
      // console.debug('filePath', filePath)
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

    test('then 200', async () => {
      switch (method) {
        case 'GET':
          res = await economyHonoApp.app.request(endpoint)
          expect(res.status).toBe(200)
          break
        case 'POST':
          console.debug('endpoint', endpoint)
          res = await worker.fetch(endpoint, {
            method: 'POST',
            body: new URLSearchParams(body).toString(),
          })
          expect(res.status).toBe(200)
          expect(await res.text()).toBe(expected)
          break
        case 'PUT':
          res = await economyHonoApp.app.request(endpoint, {
            method: method,
            body: JSON.stringify(body),
          })
          expect(res.status).toBe(200)
          break
        case 'DELETE':
          res = await economyHonoApp.app.request(endpoint, {
            method: method,
            body: JSON.stringify(body),
          })
          expect(res.status).toBe(200)
          break
        default:
          break
      }
    })
  })

  test.skip('invalid method, post method to get endpoint', async () => {
    const res = await economyHonoApp.app.request(endpoint, { method: 'POST' })
    expect(res.status).toBe(404)
  })

  test.skip('エラーレスポンス（404、500）のテスト', () => {
    // 404のエンドポイント、500のエンドポイントを実装済み
  })
}

const e2eTest = () => {
  // miniflareでシミュレーション不可能であり、dploy後に実施する
  describe('ユーザーアクションからデータストレージまでの流れ', () => {
    test('ハイドレーションが読み込まれている', () => {})
    test('ヘッダーが認識されている', () => {})
    test('ボタンが正しく設定されている', () => {
      // ボタンが正しく設定されている
    })
  })
  test.skip('パフォーマンスの測定（レイテンシ、スループット）', async () => {
    const start = performance.now()

    // APIリクエストの実行
    // deloy先にアクセスする
    // const url = 'https://example.com'
    // const app = new URL(url)
    const response = await fetch(app, url)
    const end = performance.now()

    // レスポンスタイムの計測
    const responseTime = end - start

    // レスポンスタイムが500ミリ秒未満であることを確認
    expect(responseTime).toBeLessThan(500)
  })
}

const apiTest = () => {
  test('APIの契約テスト', () => {})
  describe.skip('APIの機能テスト', () => {
    let server: PreviewServer
    let browser: Browser
    let page: Page
    let context: BrowserContext

    const PORT = 8787

    beforeAll(async () => {
      // start server
      server = await preview({
        root: './',
        server: {
          port: PORT,
        },
      })
      // check with all browser
      const launchOptions = {
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
      }
      browser = await chromium.launch(launchOptions)

      page = await browser.newPage()
    })

    afterAll(async () => {
      await browser.close()
      await new Promise<void>((resolve, reject) => {
        server.httpServer.close((err) => {
          if (err) {
            reject(err)
            return
          }
          resolve()
        })
      })
    })

    test('count updated when button clicked', async () => {
      await page.goto(`http://localhost:${PORT}/economy}`)
      const button = await page.$('button')
      await button?.click()
      const count = await page.$eval('p', (el) => el.textContent)
      expect(count).toBe('1')
    })

    test('should change count when button clicked', async () => {
      await page.goto(`http://localhost:${PORT}`)
      const button = page.getByRole('button', { name: /Clicked/ })
      await expectPlayWright(button).toBeVisible()

      await expectPlayWright(button).toHaveText('Clicked 0 time(s)')

      await button.click()
      await expectPlayWright(button).toHaveText('Clicked 1 time(s)')
    }, 60_000)

    test('hx- エンドポイントが正しく設定されている', () => {
      // https://github.com/vitest-dev/vitest/blob/userquin/feat-isolate-browser-tests/examples/react-testing-lib-browser/src/App.test.tsx
    })
    test('hx- 正常な結果、適切な要素が更新されている', () => {})
    test('ボタンのレンダリングテスト', async () => {
      // ボタンのレンダリングテスト: コンポーネントが正しくレンダリングされるかをテストします。これには、レンダリングされたHTMLが期待通りであることを確認するアサーションが含まれます。

      // test対象は "get /economy"
      // check page resolve test endpoint
      test('ボタンのレンダリングテスト', async () => {
        try {
          await page.goto('http://localhost:8787/economy')
          const button = await page.$('button')
          // その他のテストコード
        } catch (error) {
          console.error('Error occurred during page navigation:', error)
          // 必要に応じてエラーハンドリングを行います
        }
      })
    })
    // イベントハンドラのテスト: ボタンのクリックイベントなどのイベントハンドラが正しく動作するかをテストします。これには、ボタンをクリックした際の挙動をシミュレートし、期待される結果が得られるかを検証するアサーションが含まれます。
    // 非同期動作のテスト: あるボタンが非同期リクエストを行う場合、その動作をテストします。これには、非同期リクエストが完了した後の状態を検証するアサーションが含まれます。
  })
  test('エンドポイントの検証とバリデーション', () => {})
  test('レート制限とスロットリング', () => {})
}
