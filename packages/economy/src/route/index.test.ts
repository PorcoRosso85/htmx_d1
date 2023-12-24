import {
  Browser,
  BrowserContext,
  Page,
  chromium,
  expect as expectPlayWright,
} from '@playwright/test'
import { PreviewServer, preview } from 'vite'
import { afterAll, beforeAll, describe, expect, test } from 'vitest'
import { economyHonoApp, endpoints, query } from './index'

describe('/economy', () => {
  describe('/', () => {
    describe('初期開発, 単体テスト', () => {
      describe('ブラウザとワーカー間の通信テスト', () => {
        browserWorkerTest()
      })
      describe('ワーカーとストレージ間の通信テスト', () => {
        describe('ストレージと通信シミュレーションができる', async () => {
          await kvd1r2Test()
        })
      })
    })

    describe('統合と機能テスト', () => {
      describe('エンドツーエンドのテスト', () => {
        e2eTest()
      })
      describe('APIテスト', () => {
        apiTest()
      })
    })

    describe.skip('ユーザビリティとインタフェーステスト', () => {
      describe('ユーザーインタフェース（UI）テスト', () => {
        test('異なるブラウザとデバイスでの表示の一貫性', () => {})
        test('レスポンシブデザイン', () => {})
        test('データバックアップと復元のテスト', () => {})
      })
    })

    describe.skip('セキュリティとリスク管理テスト', () => {
      describe('セキュリティテスト', () => {
        test('XSS、CSRF攻撃に対するテスト', () => {})
        test('認証と認可メカニズムのテスト', () => {})
        test('SSL/TLSによる通信のセキュリティ確認', () => {})
      })
    })

    describe.skip('パフォーマンスと負荷テスト', () => {
      describe('負荷テスト', () => {
        test('高トラフィックや多数リクエストの処理能力の評価', () => {})
        test('リソースリークテスト', () => {})
      })
    })

    describe.skip('拡張性とメンテナンステスト', () => {
      describe('データベーステスト', () => {
        test('SQLインジェクションなどのセキュリティテスト', () => {})
        test('トランザクション整合性の確認', () => {})
        test('スキーマ変更とマイグレーション', () => {})
      })
      describe('サービス間連携のテスト', () => {
        test('外部サービスとの連携（決済システム等）', () => {})
        test('メッセージキューの統合', () => {})
        test('タイムアウトとリトライメカニズム', () => {})
      })
    })

    describe.skip('運用とデプロイメントテスト', () => {
      describe('コンフィギュレーションとデプロイメントのテスト', () => {
        test('環境変数と設定ファイルの管理', () => {})
        test('デプロイメントプロセスの自動化とロールバック', () => {})
      })
    })
    // 追加テスト項目
    describe.skip('フェーズ 3: ユーザビリティとインタフェーステスト', () => {
      describe('互換性テスト、国際化と地域化テスト', () => {
        // ここにテストケースを記述
      })
    })

    describe.skip('フェーズ 4: セキュリティとリスク管理テスト', () => {
      describe('セキュリティ脆弱性テスト', () => {
        // ここにテストケースを記述
      })
      describe('カスタムヘッダーと認証テスト', () => {
        // ここにテストケースを記述
      })
      describe('フェールセーフとエラー処理のテスト', () => {
        // ここにテストケースを記述
      })
    })

    describe.skip('フェーズ 6: 拡張性とメンテナンステスト', () => {
      describe('ドキュメントとコントラクトの一貫性テスト', () => {
        // ここにテストケースを記述
      })
      describe('バージョン管理テスト', () => {
        // ここにテストケースを記述
      })
      describe('API依存性テスト', () => {
        // ここにテストケースを記述
      })
    })
  })
})

const browserWorkerTest = () => {
  test('get', async () => {
    const res = await economyHonoApp.app.request('/economy', { method: 'GET' })
    expect(res.status).toBe(200)
  })
  test('HTTPメソッドのハンドリング', async () => {
    const res = await economyHonoApp.app.request('/economy', { method: 'POST' })
    expect(res.status).toBe(404)
  })
  test.skip('エラーレスポンス（404、500）のテスト', () => {
    // 404のエンドポイント、500のエンドポイントを実装済み
  })
}

const kvd1r2Test = async () => {
  // miniflareでシミュレーション
  const { Miniflare } = await import('miniflare')

  const mf = new Miniflare({
    name: 'main',
    modules: true,
    script: `
                // export default {
                //   async fetch(request, env, ctx){
                //     return new Response('Hello World!');
                //   },};
                `,
    kvNamespaces: ['KV'],
    d1Databases: ['D1'],
    r2Buckets: ['R2'],
    // Binding of `wrangler.toml`
  })
  const kv = await mf.getKVNamespace('KV')
  const d1db = await mf.getD1Database('D1')
  const r2 = await mf.getR2Bucket('R2')

  describe.skip('データの整合性と永続性の確認', () => {
    test('query d1', async () => {
      await d1db.exec('DROP TABLE IF EXISTS root;')
      await d1db.exec(
        'CREATE TABLE IF NOT EXISTS root (ID INTEGER PRIMARY KEY, Name TEXT, Email TEXT);',
      )
      await d1db.exec(`INSERT INTO root (ID, Name, Email) VALUES (01, 'Tom', 'tom@example.com');`)

      const id = '01'
      const sql = query('/economy', id)
      const { results } = await d1db.prepare(sql).all()
      console.debug(results)
      expect(results).toEqual([{ ID: 1, Name: 'Tom', Email: 'tom@example.com' }])
    })

    test('query kv', async () => {
      await kv.put('foo', 'bar')
      expect(await kv.get('foo')).toBe('bar')
    })

    test('query r2', async () => {
      await r2.put('foo', 'bar')
      const object = await r2.get('foo')
      expect(await object?.text()).toBe('bar')
    })
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
