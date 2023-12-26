export const endpoints = {
  /**
   * @alias /economy
   * ポイントエコノミーシステムの初期ページを表示するためのHTMLとTailwindCSS, ハイドレーションするJavascriptを作成します。
   * javascriptのスクリプトは、scriptタグの中に記載します。
   *
   */
  root: '/economy',

  user: {
    /**
     * @alias /economy/user
     * ユーザー情報
     */
    root: '/economy/user',

    /**
     * @alias /economy/user/register
     * ユーザー登録
     * formデータを受け取るためのUIを提供し、
     * formデータを受け取り、データベースに登録します。
     */
    register: '/economy/user/register', // ユーザー登録

    /**
     * @alias /economy/user/update
     * ユーザー更新
     * formデータを受け取るためのUIを提供し、
     * formデータを受け取り、データベースを更新します。
     */
    update: '/economy/user/update', // ユーザー更新

    delete: '/economy/user/delete', // ユーザー削除

    info: {
      /** */
      balance: '/economy/balance', // 残高表示

      /** */
      history: '/economy/history', // 履歴表示
    },
    setting: {
      /** */
      root: '/economy/setting',

      /** */
      auto: '/economy/setting/auto', // 自動設定（分配率、配当率）
    },

    /** */
    notification: '/economy/notification', // 通知
  },

  transaction: {
    /**
     * @alias /economy/transaction
     * 取引
     * 取引を行うためのUIを提供し、
     * 取引を行うロジックを実行、データベースを更新します。
     *
     * @param {string} originatingEntityId - 取引元のID
     * @param {string} targetEntityId - 取引先のID
     * @param {string} amount - 取引金額
     * @param {string} reasonOfType - 取引の説明
     * @param {string} transactionType - 取引の種類
     * @param {string} transactionDate - 取引日
     * @param {string} transactionId - 取引ID
     *
     * 取引の種類は、取引の説明によって決定されます。
     *
     */
    root: '/economy/transaction',
  },

  external: '/economy/external', // 外部サービス連携

  point: {
    root: '/economy/point',
    expiry: '/economy/point/expiry', // ポイント有効期限
    rank: '/economy/point/rank', // ポイントランク
  },

  support: '/economy/support', // サポート
}
