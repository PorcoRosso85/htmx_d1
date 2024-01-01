import { describe, expect, test } from 'vitest'
import { Ends, app, feats } from './states'

export const tests: Test = {
  'get /bank': {
    initial: {
      browserClient: {
        unitTests: [
          test('get /bank 200', async () => {
            const res = await app.request('/bank')
            expect(res.status).toBe(200)
          }),
        ],
        uiUxTests: [
          test('異なるブラウザとデバイスでの表示の一貫性', () => {}),
          test('レスポンシブデザイン', () => {}),
        ],
        browserWorkerCommunicationTests: [],
      },
      webFramework: {
        frameworkFunctionalityTests: [],
        moduleIntegrationTests: [],
      },
      infrastructure: {
        basicPerformanceTests: [],
      },
    },
  },
}

type TestFunc = void | Promise<void>
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
    browserWorkerCommunicationTests: TestFuncs // 追加: ブラウザとワーカー間の通信テスト
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
