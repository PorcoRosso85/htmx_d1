import { SuiteCollector, afterAll, beforeAll, describe, expect, test } from 'vitest'
import { buttonComponents } from '../components'
import { Ends, app, feats } from './states'
import { browserWorkerTest } from './tests/utils'

export const tests: Test = {
  'get /bank': {
    initial: {
      browserClient: {
        unitTests: [],
        uiUxTests: [],
        browserWorkerConn: [browserWorkerTest('get /bank 200', app, '/bank')],
        notFound: [],
      },
      webFramework: {
        frameworkFunctionalityTests: [],
        moduleIntegrationTests: [],
      },
      infrastructure: {
        basicPerformanceTests: [],
      },
    },
    mid: {
      browserClient: {
        crossBrowserTesting: [],
        accessibilityTests: [],
        e2e: [
          test('異なるブラウザとデバイスでの表示の一貫性', () => {}),
          test('レスポンシブデザイン', () => {}),
          describe.skip('コンポーネント内部のrendering必須項目テスト', () => {
            beforeAll(() => {
              const jsdom = require('jsdom')
              const { JSDOM } = jsdom

              const dom = new JSDOM()
              global.document = dom.window.document
              global.window = dom.window
            })

            test('GetBank returns a button for each endpoint', () => {
              const endpoints = ['a', 'b', 'c']

              /**
               * 仮にコンポーネントをインポートしたとする
               * 下記はコンポーネントの例である
               */
              const GetBank = (endpoints) => {
                const buttons = buttonComponents({ endpoints })
                return (
                  <div>
                    {buttons.a}
                    {buttons.b}
                    {buttons.c}
                  </div>
                )
              }

              for (const endpoint of endpoints) {
                console.debug('endpoint', endpoint)

                const { getByRole } = render(<GetBank endpoints={endpoints} />)
                const button = getByRole('button')

                expect(button).toHaveAttribute('type', 'button')
              }
            })

            test.skip('GetBank returns a button for each endpoint', () => {
              const endpoints = ['a', 'b', 'c']
              const buttons = buttonComponents({ endpoints })

              for (const endpoint of endpoints) {
                console.debug('endpoint', endpoint)

                console.debug('buttons[endpoint]', buttons[endpoint])
                const { getByRole } = render(buttons[endpoint])
                const button = getByRole('button')

                expect(button).toHaveAttribute('type', 'button')
              }
            })

            describe.skip('compoA', () => {
              const CompoA = () => {
                return (
                  <div>
                    <h1>Endpoint A</h1>
                    <p>Access Endpoint B or C using the links below:</p>
                    <ul>
                      <li>
                        <a href="/endpoint-b">Link to Endpoint B</a>
                      </li>
                      <li>
                        <a href="/endpoint-c">Link to Endpoint C</a>
                      </li>
                    </ul>
                  </div>
                )
              }

              describe.skip('CompoA Component', () => {
                test('contains links to Endpoint B and Endpoint C', () => {
                  render(<CompoA />)

                  const linkToB = screen.getByRole('link', { name: /link to endpoint b/i })
                  expect(linkToB).toBeInTheDocument()
                  expect(linkToB).toHaveAttribute('href', '/endpoint-b')

                  const linkToC = screen.getByRole('link', { name: /link to endpoint c/i })
                  expect(linkToC).toBeInTheDocument()
                  expect(linkToC).toHaveAttribute('href', '/endpoint-c')
                })
              })
            })
          }),
          // miniflareでシミュレーション不可能であり、dploy後に実施する
          describe('ユーザーアクションからデータストレージまでの流れ', () => {
            test('ハイドレーションが読み込まれている', () => {})
            test('ヘッダーが認識されている', () => {})
            test('ボタンが正しく設定されている', () => {
              // ボタンが正しく設定されている
            })
          }),

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
          }),
        ],
      },
      webFramework: {
        apiIntegrationTests: [],
        errorHandlingTests: [],
      },
      infrastructure: {
        loadTesting: [],
        securityTesting: [],
      },
    },
  },

  'post /user/register': {
    initial: {
      browserClient: {
        unitTests: [],
        uiUxTests: [],
        browserWorkerConn: [
          browserWorkerTest(
            'post /user/register 200',
            app,
            '/user/register',
            'POST',
            {},
            '<div><h1>hello post /user/register</h1></div>',
          ),
        ],
        notFound: [],
        renderingContain: [
          describe('ブラウザがレンダリングすべき項目を含めている', () => {
            test('anchor link to /user/*', () => {})
          }),
        ],
      },
      webFramework: {
        frameworkFunctionalityTests: [
          test.skip('c.req.parseBody is working', async () => {
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
          }),
        ],
        moduleIntegrationTests: [],
      },
      infrastructure: {
        basicPerformanceTests: [],
      },
    },
  },
}

type TestFunc = void | Promise<void> | SuiteCollector
type TestFuncs = TestFunc | TestFunc[]

type Test = {
  [K in keyof Ends]: {
    initial: InitialDevelopmentPhaseTests
    mid?: MidDevelopmentPhaseTests
    preRelease?: PreReleasePhaseTests
    operation?: OperationPhaseTests
  }
}

type InitialDevelopmentPhaseTests = {
  browserClient: {
    unitTests: TestFuncs // コンポーネントや機能のユニットテスト
    uiUxTests: TestFuncs // UI/UXテスト、初期モックアップの評価
    browserWorkerConn: TestFuncs // 追加: ブラウザとワーカー間の通信テスト
    notFound: TestFuncs // 追加: 404と500のテスト
    renderingContain: TestFuncs
  }
  webFramework: {
    frameworkFunctionalityTests: TestFuncs // ルーティングやリクエスト処理の基本機能テスト
    moduleIntegrationTests: TestFuncs // 他のライブラリやモジュールとの統合テスト
  }
  infrastructure: {
    basicPerformanceTests: TestFuncs // Cloudflare Workersの基本パフォーマンステスト
  }
}

type MidDevelopmentPhaseTests = {
  browserClient: {
    crossBrowserTesting: TestFuncs // 異なるブラウザでの動作テスト
    accessibilityTests: TestFuncs // アクセシビリティテスト
    e2e: TestFuncs // ユーザーのシナリオに沿ったE2Eテスト
  }
  webFramework: {
    apiIntegrationTests: TestFuncs // 外部APIとの統合テスト
    errorHandlingTests: TestFuncs // エラー処理テスト
  }
  infrastructure: {
    loadTesting: TestFuncs // 負荷テスト
    securityTesting: TestFuncs // セキュリティテスト（XSS、CSRFなど）
  }
}

type PreReleasePhaseTests = {
  browserClient: {
    performanceOptimizationTests: TestFuncs // パフォーマンス最適化テスト
    finalUserTesting: TestFuncs // 最終ユーザーテスト
    crossDeviceConsistencyTests: TestFuncs // 追加: 異なるブラウザとデバイスでの表示の一貫性テスト
  }
  webFramework: {
    stressTesting: TestFuncs // ストレステスト
    finalIntegrationTesting: TestFuncs // 最終統合テスト
  }
  infrastructure: {
    disasterRecoveryTests: TestFuncs // 災害復旧テスト
    scalingTests: TestFuncs // スケーリングテスト
  }
}

type OperationPhaseTests = {
  browserClient: {
    continuousMonitoring: TestFuncs // 継続的なモニタリング
    userFeedbackAnalysis: TestFuncs // ユーザーフィードバック分析
  }
  webFramework: {
    dependencyUpdateTests: TestFuncs // 依存関係更新テスト
    performanceMonitoring: TestFuncs // パフォーマンスモニタリング
  }
  infrastructure: {
    infrastructureAudit: TestFuncs // 基盤の監査
    complianceTesting: TestFuncs // コンプライアンステスト
  }
}
