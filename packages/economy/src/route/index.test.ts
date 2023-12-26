import { PreviewServer, preview } from 'vite'
import { afterAll, beforeAll, describe, expect, test } from 'vitest'
import { economyHonoApp, endpoints } from './index'

describe('統合/機能テスト', () => {
  describe('ブラウザとワーカー間の通信テスト', () => {
    browserWorkerTest(endpoints.root.endpoint)
    browserWorkerTest(endpoints.user.register.endpoint, 'POST', {
      email: 'email',
      user_name: 'userName',
      user_role: 'userRole',
    })
  })
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

const browserWorkerTest = (endpoint: string, method = 'GET', body: { [key: string]: any } = {}) => {
  console.debug('endpoint', endpoint)
  describe('200,', () => {
    test('then 200', async () => {
      let res
      switch (method) {
        case 'GET':
          res = await economyHonoApp.app.request(endpoint)
          expect(res.status).toBe(200)
          break
        case 'POST':
          const formData = new FormData()
          for (const key in body) {
            formData.append(key, body[key])
          }
          res = await economyHonoApp.app.request(endpoint, {
            method: method,
            //
            // https://github.com/honojs/hono/issues/1840#issuecomment-1866906026
            body: formData,
          })
          expect(res.status).toBe(200)
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

  test('invalid method, post method to get endpoint', async () => {
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

describe('/economy/user', () => {
  describe.skip('/economy/user/register', () => {
    test('parseBody is working', async () => {
      const req = new Request('/economy/user/register', {
        method: 'POST',
        // formの場合は, body: new URLSearchParams({
        body: new URLSearchParams({
          name: 'test',
          email: 'test@mail.com',
        }).toString(),
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      })

      const parsedBody = await req.body()
      expect(parsedBody.name).toBe('test')
      expect(parsedBody.email).toBe('test@mail.com')
    })
  })
  describe('/economy/user/update', () => {
    test('ユーザー更新', () => {})
  })
  describe('/economy/user/delete', () => {
    test('ユーザー削除', () => {})
  })
})
