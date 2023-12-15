// キャッシュの名前を定義
const CACHE_NAME = 'v1'

// キャッシュするリソースのリスト
const urlsToCache = ['https://unpkg.com/htmx.org@1.9.9']

// Service Workerのインストール時にリソースをキャッシュする
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Opened cache')
      return cache.addAll(urlsToCache)
    }),
  )
})

// ネットワークリクエストをインターセプトしてキャッシュからリソースを提供する
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      // キャッシュが見つかれば、キャッシュのリソースを返す
      if (response) {
        return response
      }
      // そうでなければ、ネットワークリクエストを実行する
      return fetch(event.request)
    }),
  )
})

// キャッシュの更新と不要なキャッシュの削除
self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME]
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            // 古いキャッシュを削除
            return caches.delete(cacheName)
          }
        }),
      )
    }),
  )
})
