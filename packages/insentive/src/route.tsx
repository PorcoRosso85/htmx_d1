import { Hono } from 'hono'
import { logger } from 'hono/logger'

const endpoint = '/insentive'

const endpoints = {
  root: '/',
  employee: '/employee',
  executive: '/executive',
  manager: '/manager',
}

const app = new Hono().basePath(endpoint)

app
  .use(logger())

  .get(endpoints.root, (c) =>
    c.html(
      <div class="bg-gray-900 text-white">
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>ビデオ共有サイトのUI</title>
        <link
          href="https://cdn.jsdelivr.net/npm/tailwindcss@2.0.1/dist/tailwind.min.css"
          rel="stylesheet"
        />
        {/* Tailwind CSS Icons: https://heroicons.com/ からアイコンを追加 */}
        {/* サイドバー */}
        <div class="fixed inset-y-0 left-0 w-16 bg-gray-800 shadow-lg flex flex-col items-center py-4 space-y-4">
          {/* ここにSVGアイコンを挿入 */}
          <button type="button">🏠</button> {/* ホームアイコンの代わり */}
          <button type="button">🔍</button> {/* 検索アイコンの代わり */}
          <button type="button">▶️</button> {/* プレイリストアイコンの代わり */}
          {/* 他のアイコンも同様に追加 */}
        </div>
        {/* コンテンツエリア */}
        <div class="pl-20">
          {/* ナビゲーションバー */}
          <nav class="bg-gray-800 p-3 flex justify-between items-center">
            <div class="flex items-center space-x-4">
              {/* メニューアイコン */}
              <button>☰</button> {/* メニューアイコンの代わり */}
            </div>
            <div class="flex-1 max-w-xl mx-auto">
              <input
                type="search"
                class="w-full p-2 rounded bg-gray-700 text-white"
                placeholder="Search..."
              />
            </div>
            <div>
              {/* ユーザーアイコン */}
              <button>👤</button> {/* ユーザーアイコンの代わり */}
            </div>
          </nav>
          {/* ビデオリスト */}
          <div class="p-4 grid grid-cols-4 gap-4">
            {/* 動画カード */}
            <div class="max-w-xs rounded overflow-hidden shadow-lg bg-gray-800 p-4 space-y-2">
              <div class="font-bold text-lg mb-2">ビデオタイトル</div>
              <p class="text-gray-400 text-sm">視聴回数: 1.5K・1日前</p>
            </div>{' '}
            <div class="max-w-xs rounded overflow-hidden shadow-lg bg-gray-800 p-4 space-y-2">
              <div class="font-bold text-lg mb-2">ビデオタイトル</div>
              <p class="text-gray-400 text-sm">視聴回数: 1.5K・1日前</p>
            </div>{' '}
            <div class="max-w-xs rounded overflow-hidden shadow-lg bg-gray-800 p-4 space-y-2">
              <div class="font-bold text-lg mb-2">ビデオタイトル</div>
              <p class="text-gray-400 text-sm">視聴回数: 1.5K・1日前</p>
            </div>{' '}
            <div class="max-w-xs rounded overflow-hidden shadow-lg bg-gray-800 p-4 space-y-2">
              <div class="font-bold text-lg mb-2">ビデオタイトル</div>
              <p class="text-gray-400 text-sm">視聴回数: 1.5K・1日前</p>
            </div>{' '}
            <div class="max-w-xs rounded overflow-hidden shadow-lg bg-gray-800 p-4 space-y-2">
              <div class="font-bold text-lg mb-2">ビデオタイトル</div>
              <p class="text-gray-400 text-sm">視聴回数: 1.5K・1日前</p>
            </div>{' '}
            <div class="max-w-xs rounded overflow-hidden shadow-lg bg-gray-800 p-4 space-y-2">
              <div class="font-bold text-lg mb-2">ビデオタイトル</div>
              <p class="text-gray-400 text-sm">視聴回数: 1.5K・1日前</p>
            </div>{' '}
            <div class="max-w-xs rounded overflow-hidden shadow-lg bg-gray-800 p-4 space-y-2">
              <div class="font-bold text-lg mb-2">ビデオタイトル</div>
              <p class="text-gray-400 text-sm">視聴回数: 1.5K・1日前</p>
            </div>{' '}
            <div class="max-w-xs rounded overflow-hidden shadow-lg bg-gray-800 p-4 space-y-2">
              <div class="font-bold text-lg mb-2">ビデオタイトル</div>
              <p class="text-gray-400 text-sm">視聴回数: 1.5K・1日前</p>
            </div>
          </div>
        </div>
      </div>,
    ),
  )

  .get(endpoints.employee, (c) =>
    c.html(
      <>
        <title>従業員ダッシュボード</title>
        <link
          href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css"
          rel="stylesheet"
        />
        <div class="p-4">
          <h1 class="text-xl font-bold mb-4">従業員ダッシュボード</h1>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* <!-- リアルタイムの収入トラッキング --> */}
            <div class="bg-white shadow p-4">
              <h2 class="font-semibold mb-2">収入トラッキング</h2>
              <p>
                現在の収入: <span class="font-bold">¥XXX</span>
              </p>
              <p>
                予定収入: <span class="font-bold">¥YYY</span>
              </p>
              {/* <!-- プログレスバーで目標達成状況を表示 --> */}
              <div class="w-full bg-gray-200 rounded-full h-2.5 mb-4">
                <div class="bg-blue-600 h-2.5 rounded-full" style="width: 70%;" />
              </div>
              <p>
                目標進捗: <span class="font-bold">70%</span>
              </p>
            </div>

            {/* <!-- パフォーマンスフィードバック --> */}
            <div class="bg-white shadow p-4">
              <h2 class="font-semibold mb-2">パフォーマンスフィードバック</h2>
              <p>
                最近のフィードバック:{' '}
                <span class="italic">"良いパフォーマンスですが、さらに改善が必要です。"</span>
              </p>
            </div>
          </div>

          {/* <!-- シミュレーション機能 --> */}
          <div class="bg-white shadow p-4 mt-4">
            <h2 class="font-semibold mb-2">収入シミュレーション</h2>
            <label for="performance-level">パフォーマンスレベル:</label>
            <input
              type="range"
              id="performance-level"
              name="performance-level"
              min="0"
              max="100"
              class="w-full"
            />
            <p>
              予測収入: <span class="font-bold">¥ZZZ</span>
            </p>
          </div>

          {/* <!-- 通知とリマインダー --> */}
          <div class="bg-white shadow p-4 mt-4">
            <h2 class="font-semibold mb-2">通知とリマインダー</h2>
            <ul class="list-disc pl-5">
              <li>次の目標期限: YYYY-MM-DD</li>
              <li>重要なミーティング: YYYY-MM-DD</li>
            </ul>
          </div>
        </div>
      </>,
    ),
  )

  .get(endpoints.executive, (c) =>
    c.html(
      <>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>経営者ダッシュボード</title>
        <link
          href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css"
          rel="stylesheet"
        />
        <h1 class="text-xl font-bold mb-4">経営者ダッシュボード</h1>
        {/* パフォーマンス目標の設定 */}
        <div class="bg-white shadow p-4 mb-4">
          <h2 class="font-semibold mb-2">パフォーマンス目標の設定</h2>
          <form>
            <div class="mb-4">
              <label htmlFor="team-goal" class="block mb-2">
                チーム目標:
              </label>
              <input
                type="text"
                id="team-goal"
                name="team-goal"
                class="w-full p-2 border border-gray-300 rounded"
              />
            </div>
            <div class="mb-4">
              <label htmlFor="deadline" class="block mb-2">
                期限:
              </label>
              <input
                type="date"
                id="deadline"
                name="deadline"
                class="w-full p-2 border border-gray-300 rounded"
              />
            </div>
            <button
              type="submit"
              class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              目標を保存
            </button>
          </form>
        </div>
        {/* インセンティブの設定 */}
        <div class="bg-white shadow p-4 mb-4">
          <h2 class="font-semibold mb-2">インセンティブの設定</h2>
          <form>
            <div class="mb-4">
              <label htmlFor="incentive-amount" class="block mb-2">
                インセンティブ額:
              </label>
              <input
                type="number"
                id="incentive-amount"
                name="incentive-amount"
                class="w-full p-2 border border-gray-300 rounded"
              />
            </div>
            <div class="mb-4">
              <label htmlFor="incentive-conditions" class="block mb-2">
                条件:
              </label>
              <textarea
                id="incentive-conditions"
                name="incentive-conditions"
                class="w-full p-2 border border-gray-300 rounded"
                defaultValue={''}
              />
            </div>
            <button
              type="submit"
              class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              設定を保存
            </button>
          </form>
        </div>
        {/* 戦略的方針 */}
        <div class="bg-white shadow p-4 mb-4">
          <h2 class="font-semibold mb-2">戦略的方針</h2>
          <form>
            <div class="mb-4">
              <label htmlFor="strategic-vision" class="block mb-2">
                ビジョン:
              </label>
              <textarea
                id="strategic-vision"
                name="strategic-vision"
                class="w-full p-2 border border-gray-300 rounded"
                defaultValue={''}
              />
            </div>
            <button
              type="submit"
              class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              ビジョンを保存
            </button>
          </form>
        </div>
      </>,
    ),
  )

  .get(endpoints.manager, (c) =>
    c.html(
      <>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>事務員・経理ダッシュボード</title>
        <link
          href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css"
          rel="stylesheet"
        />
        <h1 class="text-xl font-bold mb-4">事務員・経理ダッシュボード</h1>
        {/* 給与情報 */}
        <div class="bg-white shadow p-4 mb-4">
          <h2 class="font-semibold mb-2">給与情報</h2>
          <form>
            <div class="mb-4">
              <label htmlFor="base-salary" class="block mb-2">
                基本給:
              </label>
              <input
                type="number"
                id="base-salary"
                name="base-salary"
                class="w-full p-2 border border-gray-300 rounded"
              />
            </div>
            <div class="mb-4">
              <label htmlFor="allowances" class="block mb-2">
                手当:
              </label>
              <input
                type="number"
                id="allowances"
                name="allowances"
                class="w-full p-2 border border-gray-300 rounded"
              />
            </div>
            <button
              type="submit"
              class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              情報を保存
            </button>
          </form>
        </div>
        {/* 勤怠データ */}
        <div class="bg-white shadow p-4 mb-4">
          <h2 class="font-semibold mb-2">勤怠データ</h2>
          <form>
            <div class="mb-4">
              <label htmlFor="attendance" class="block mb-2">
                出勤状況:
              </label>
              <input
                type="text"
                id="attendance"
                name="attendance"
                class="w-full p-2 border border-gray-300 rounded"
              />
            </div>
            <div class="mb-4">
              <label htmlFor="vacation" class="block mb-2">
                休暇情報:
              </label>
              <input
                type="text"
                id="vacation"
                name="vacation"
                class="w-full p-2 border border-gray-300 rounded"
              />
            </div>
            <button
              type="submit"
              class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              データを保存
            </button>
          </form>
        </div>
        {/* 財務データ */}
        <div class="bg-white shadow p-4 mb-4">
          <h2 class="font-semibold mb-2">財務データ</h2>
          <form>
            <div class="mb-4">
              <label htmlFor="financial-status" class="block mb-2">
                財務状況:
              </label>
              <input
                type="text"
                id="financial-status"
                name="financial-status"
                class="w-full p-2 border border-gray-300 rounded"
              />
            </div>
            <div class="mb-4">
              <label htmlFor="budget-management" class="block mb-2">
                予算と経費:
              </label>
              <input
                type="text"
                id="budget-management"
                name="budget-management"
                class="w-full p-2 border border-gray-300 rounded"
              />
            </div>
            <button
              type="submit"
              class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              財務情報を保存
            </button>
          </form>
        </div>
      </>,
    ),
  )

export const insentiveHonoApp = {
  endpoint: endpoint,
  app: app,
}
