import path from 'path'
import { Hono } from 'hono'
/**
 * このファイルは
 * テスト関数を生成するファクトリー関数
 * 生成するためのテスト対象のマッピング定義
 * 生成するためのテスト一覧
 * を含みます。
 */
import { SuiteCollector, afterAll, beforeAll, describe, expect, test } from 'vitest'
import { unstable_dev } from 'wrangler'
import type { UnstableDevWorker } from 'wrangler'
import { Ends } from './states'

type TestParamsType = {
  method: string
  end: string
  body?: any
  toContain?: string
}

type TestFuncParamsType = string[]

type TestFuncType = (params: TestParamsType) => void | Promise<void>

type TestFuncAndParamsType = [TestFuncType, TestFuncParamsType]

type TestMapType = {
  [K in keyof Ends]: TestFuncAndParamsType[]
}

/**
 * 生成するためのテスト一覧
 * すべてのテストを含む
 */
// []各keyの型を定義する
const testFunctions: { [key: string]: TestFuncType } = {
  /**
   * libs
   * 以下に定義するテストに使用される共通の変数や関数を定義する
   */
  // libs: {},
  /**
   * example:
   * browserWorkerTest: (end: string) => void
   */

  // [] 各testを書くのではなく、各describeについて書くことにした、要件次第ではtestに戻す
  browserWorkerConn: ({ method, end, toContain }) => {
    let res: any
    let worker: UnstableDevWorker

    beforeAll(async () => {
      // relative path from project root to app file
      // index.ts/x should export app as default
      const filePath = path.resolve(__dirname, '../route/states.tsx')
      // console.debug('filePath', filePath)
      worker = await unstable_dev(filePath, {
        experimental: { disableExperimentalWarning: false },
      })
      // console.debug('worker', filePath, worker)
    })

    afterAll(async () => {
      if (worker) {
        await worker.stop()
      }
    })

    test(`responseToContain ${toContain}`, async () => {
      switch (method) {
        case 'GET':
          console.debug('end', end)
          res = await worker.fetch(end)
          // console.debug('res', res)
          // [] text合わない
          break
        case 'POST':
          res = await worker.fetch(end, {
            method: 'POST',
            // body: new URLSearchParams(body).toString(),
          })
          break
        case 'PUT':
          res = await worker.fetch(end, {
            method: 'PUT',
            // body: new URLSearchParams(body).toString(),
          })
          break
        case 'DELETE':
          res = await worker.fetch(end, {
            method: 'DELETE',
            // body: new URLSearchParams(body).toString(),
          })
          break
        default:
          break
      }

      expect(res.status).toBe(200)
      expect(res.statusText).toBe('OK')
      console.debug('toContain', toContain)
      expect(await res.text()).toContain(toContain)
    })
  },

  // e2e: [
  //   test('異なるブラウザとデバイスでの表示の一貫性', () => {}),
  //   test('レスポンシブデザイン', () => {}),
  //   describe.skip('コンポーネント内部のrendering必須項目テスト', () => {
  //     beforeAll(() => {
  //       const jsdom = require('jsdom')
  //       const { JSDOM } = jsdom

  //       const dom = new JSDOM()
  //       global.document = dom.window.document
  //       global.window = dom.window
  //     })

  //     test('GetBank returns a button for each endpoint', () => {
  //       const endpoints = ['a', 'b', 'c']

  //       /**
  //        * 仮にコンポーネントをインポートしたとする
  //        * 下記はコンポーネントの例である
  //        */
  //       const GetBank = (endpoints) => {
  //         const buttons = buttonComponents({ endpoints })
  //         return (
  //           <div>
  //             {buttons.a}
  //             {buttons.b}
  //             {buttons.c}
  //           </div>
  //         )
  //       }

  //       for (const endpoint of endpoints) {
  //         console.debug('endpoint', endpoint)

  //         const { getByRole } = render(<GetBank endpoints={endpoints} />)
  //         const button = getByRole('button')

  //         expect(button).toHaveAttribute('type', 'button')
  //       }
  //     })

  //     test.skip('GetBank returns a button for each endpoint', () => {
  //       const endpoints = ['a', 'b', 'c']
  //       const buttons = buttonComponents({ endpoints })

  //       for (const endpoint of endpoints) {
  //         console.debug('endpoint', endpoint)

  //         console.debug('buttons[endpoint]', buttons[endpoint])
  //         const { getByRole } = render(buttons[endpoint])
  //         const button = getByRole('button')

  //         expect(button).toHaveAttribute('type', 'button')
  //       }
  //     })

  //     describe.skip('compoA', () => {
  //       const CompoA = () => {
  //         return (
  //           <div>
  //             <h1>Endpoint A</h1>
  //             <p>Access Endpoint B or C using the links below:</p>
  //             <ul>
  //               <li>
  //                 <a href="/endpoint-b">Link to Endpoint B</a>
  //               </li>
  //               <li>
  //                 <a href="/endpoint-c">Link to Endpoint C</a>
  //               </li>
  //             </ul>
  //           </div>
  //         )
  //       }

  //       describe.skip('CompoA Component', () => {
  //         test('contains links to Endpoint B and Endpoint C', () => {
  //           render(<CompoA />)

  //           const linkToB = screen.getByRole('link', { name: /link to endpoint b/i })
  //           expect(linkToB).toBeInTheDocument()
  //           expect(linkToB).toHaveAttribute('href', '/endpoint-b')

  //           const linkToC = screen.getByRole('link', { name: /link to endpoint c/i })
  //           expect(linkToC).toBeInTheDocument()
  //           expect(linkToC).toHaveAttribute('href', '/endpoint-c')
  //         })
  //       })
  //     })
  //   }),
  //   // miniflareでシミュレーション不可能であり、dploy後に実施する
  //   describe('ユーザーアクションからデータストレージまでの流れ', () => {
  //     test('ハイドレーションが読み込まれている', () => {})
  //     test('ヘッダーが認識されている', () => {})
  //     test('ボタンが正しく設定されている', () => {
  //       // ボタンが正しく設定されている
  //     })
  //   }),

  //   test.skip('パフォーマンスの測定（レイテンシ、スループット）', async () => {
  //     const start = performance.now()

  //     // APIリクエストの実行
  //     // deloy先にアクセスする
  //     // const url = 'https://example.com'
  //     // const app = new URL(url)
  //     const response = await fetch(app, url)
  //     const end = performance.now()

  //     // レスポンスタイムの計測
  //     const responseTime = end - start

  //     // レスポンスタイムが500ミリ秒未満であることを確認
  //     expect(responseTime).toBeLessThan(500)
  //   }),
  // ],

  // frameworkFunctionalityTests: [
  //   test.skip('c.req.parseBody is working', async () => {
  //     const req = new Request('/economy/user/register', {
  //       method: 'POST',
  //       // formの場合は, body: new URLSearchParams({
  //       body: new URLSearchParams({
  //         name: 'test',
  //         email: 'test@mail.com',
  //       }).toString(),
  //       headers: {
  //         'Content-Type': 'application/x-www-form-urlencoded',
  //       },
  //     })

  //     const parsedBody = await req.body()
  //     expect(parsedBody.name).toBe('test')
  //     expect(parsedBody.email).toBe('test@mail.com')
  //   }),
  // ],
}

/**
 * 生成するためのテスト対象のマッピング定義
 * @type {Ends}
 * @param end
 * @returns [testFunction, testFunction, ...]
 */
const testMap: TestMapType = {
  /**
   * example:
   * 'get /bank': [browserWorkerConn, notFound, renderingContain],
   */
  // []メソッドを取得して入れるか
  // 'get /bank': [testFunctions.browserWorkerConn],
  'post /user/register': [
    [testFunctions.browserWorkerConn, ['<button type="button">', 'Register', '<a', 'href="/user"']],
  ],
}

/**
 * テスト関数を生成するファクトリー関数
 * @param end
 * @returns void
 */
const testFactory = (testMap: TestMapType): void => {
  // methodEndはtestFunctionMapのkey
  const methodEnds = Object.keys(testMap)
  // extract testFunctions from testFunctionMap
  for (const methodEnd of methodEnds) {
    console.debug('methodEnd', methodEnd)
    const testFuncAndParams: TestFuncAndParamsType[] = testMap[methodEnd]

    for (const testFuncAndParam of testFuncAndParams) {
      const testFunction: TestFuncType = testFuncAndParam[0]
      const testFuncParams: TestFuncParamsType = testFuncAndParam[1]

      const extractedEnd = (methodEnd) => {
        return methodEnd.split(' ')
      }
      let [method, end] = extractedEnd(methodEnd)
      // uppercase of method
      method = method.toUpperCase()
      for (const toContain of testFuncParams) {
        // console.debug('toContain', toContain)
        testFunction({ method, end, toContain })
      }
    }
  }
}

testFactory(testMap)

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
