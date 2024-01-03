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

/**
 * 生成するためのテスト一覧
 * すべてのテストを含む
 */
const testFunctions = {
  /**
   * libs
   * 以下に定義するテストに使用される共通の変数や関数を定義する
   */
  libs: {},
  /**
   * example:
   * browserWorkerTest: (end: string) => void
   */

  // [] 各testを書くのではなく、各describeについて書くことにした、要件次第ではtestに戻す
  browserWorkerConn: ({ method, end, body }: TestParams) => {
    let res
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

    test('browserWorkerConn', async () => {
      switch (method) {
        case 'GET':
          console.debug('end', end)
          res = await worker.fetch(end)
          // console.debug('res', res)
          expect(res.status).toBe(200)
          expect(res.statusText).toBe('OK')
          // [] text合わない
          break
        case 'POST':
          console.debug('endpoint', end)
          res = await worker.fetch(end, {
            method: 'POST',
            // body: new URLSearchParams(body).toString(),
          })
          expect(res.status).toBe(200)
          // expect(await res.text()).toBe(expected)
          break
        case 'PUT':
          res = await app.request(end, {
            method: method,
            body: JSON.stringify(body),
          })
          expect(res.status).toBe(200)
          break
        case 'DELETE':
          res = await app.request(end, {
            method: method,
            body: JSON.stringify(body),
          })
          expect(res.status).toBe(200)
          break
        default:
          break
      }
    })
  },
}

/**
 * 生成するためのテスト対象のマッピング定義
 * @type {Ends}
 * @param end
 * @returns [testFunction, testFunction, ...]
 */
const testFunctionMap: TestfunctionMapType = {
  /**
   * example:
   * 'get /bank': [browserWorkerConn, notFound, renderingContain],
   */
  // []メソッドを取得して入れるか
  'get /bank': [testFunctions.browserWorkerConn],
  'post /user/register': [testFunctions.browserWorkerConn],
}

/**
 * テスト関数を生成するファクトリー関数
 * @param end
 * @returns void
 */
const testFactory = (testFunctionMap: TestfunctionMapType): void => {
  // methodEndはtestFunctionMapのkey
  const methodEnds = Object.keys(testFunctionMap)
  // extract testFunctions from testFunctionMap
  for (const methodEnd of methodEnds) {
    console.debug('methodEnd', methodEnd)
    const testFunctions = testFunctionMap[methodEnd]
    for (const testFunction of testFunctions) {
      // 関数であることをチェック
      if (typeof testFunction === 'function') {
        // 関数であれば実行
        // extract end from 'method end' syntax
        const extractedEnd = (methodEnd) => {
          return methodEnd.split(' ')
        }
        let [method, end] = extractedEnd(methodEnd)
        // uppercase of method
        method = method.toUpperCase()
        testFunction({ method, end } as TestParams)
      }
      testFunction
    }
  }
}

testFactory(testFunctionMap)

type TestParams = {
  method: string
  end: string
  body?: any
  expected?: any
}

type TestFunc = (params: TestParams) => void | Promise<void>

type TestfunctionMapType = {
  [K in keyof Ends]: TestFunc[]
}

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
