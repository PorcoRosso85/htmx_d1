### 勘定科目テーブル:
科目ID
科目名
科目タイプ（資産、負債、収益、費用など）

### 仕訳テーブル:

仕訳ID
勘定科目ID（勘定科目テーブルとの関連）
金額
借方/貸方
取引日
仕分け理由（期末調整など）

### 主体テーブル:

主体ID
主体名
主体タイプ
その他情報

### 取引主体関連テーブル:

取引ID
発生主体ID
対象主体ID

```mermaid
erDiagram
    ACCOUNT ||--o{ JOURNAL : "has"
    ENTITY ||--o{ TRANSACTION : "has"
    TRANSACTION ||--o{ JOURNAL : "involves"

    ACCOUNT {
        string accountId PK
        string accountName
        string accountType
    }

    JOURNAL {
        string journalId PK
        string accountId FK
        float amount
        string debitCredit
        date transactionDate
        string reason
    }

    ENTITY {
        string entityId PK
        string entityName
        string entityType
        string otherInfo
    }

    TRANSACTION {
        string transactionId PK
        string originatingEntityId FK
        string targetEntityId FK
    }

```


### ポイントを送る
```sql
INSERT INTO 仕訳テーブル (勘定科目ID, 金額, 借方/貸方, 取引日, 仕分け理由)
VALUES
(/* 主体Aのポイント勘定科目ID */, /* 送るポイント量 */, '貸方', CURRENT_DATE, 'ポイント送付'),
(/* 主体Bのポイント勘定科目ID */, /* 受けるポイント量 */, '借方', CURRENT_DATE, 'ポイント受領');

INSERT INTO 取引主体関連テーブル (取引ID, 発生主体ID, 対象主体ID)
VALUES
(/* 新しい取引ID */, /* 主体AのID */, /* 主体BのID */);

```
#### トリガーを使用し、主体間取引が自動的に各主体仕訳を更新する
```sql
CREATE TRIGGER TransferPointsTrigger
AFTER INSERT ON 取引主体関連テーブル
FOR EACH ROW
BEGIN
   -- 主体Aのポイント減少を記録
   INSERT INTO 仕訳テーブル (勘定科目ID, 金額, 借方/貸方, 取引日, 仕分け理由)
   VALUES ((SELECT 科目ID FROM 勘定科目テーブル WHERE 科目名 = 'ポイント' AND 主体ID = NEW.発生主体ID),
           NEW.金額, '貸方', NEW.取引日, 'ポイント送付');

   -- 主体Bのポイント増加を記録
   INSERT INTO 仕訳テーブル (勘定科目ID, 金額, 借方/貸方, 取引日, 仕分け理由)
   VALUES ((SELECT 科目ID FROM 勘定科目テーブル WHERE 科目名 = 'ポイント' AND 主体ID = NEW.対象主体ID),
           NEW.金額, '借方', NEW.取引日, 'ポイント受領');
END;

```

```typescript

const T = {
const ACCOUNT = Type.Object({
    accountId: Type.String({ minLength: 1, maxLength: 50 }),
    accountName: Type.String({ minLength: 1, maxLength: 100 }),
    accountType: Type.String({ minLength: 1, maxLength: 50 }),
})

const JOURNAL = Type.Object({
    journalId: Type.String({ minLength: 1, maxLength: 50 }),
    accountId: Type.String({ minLength: 1, maxLength: 50 }),
    amount: Type.Number(),
    debitCredit: Type.String({ minLength: 1, maxLength: 10 }),
    transactionDate: Type.String({ format: 'date-time' }),
    reason: Type.String({ minLength: 1, maxLength: 200 }),
})

const ENTITY = Type.Object({
    entityId: Type.String({ minLength: 1, maxLength: 50 }),
    entityName: Type.String({ minLength: 1, maxLength: 100 }),
    entityType: Type.String({ minLength: 1, maxLength: 50 }),
    otherInfo: Type.Optional(Type.String({ minLength: 1, maxLength: 200 })),
})

const TRANSACTION = Type.Object({
    transactionId: Type.String({ minLength: 1, maxLength: 50 }),
    originatingEntityId: Type.String({ minLength: 1, maxLength: 50 }),
    targetEntityId: Type.String({ minLength: 1, maxLength: 50 }),
})
}

```

### エンドポイント設計
1. ユーザー登録・更新・削除
1. 取引、利用
    1.  圏外資産＞圏内資産
    1.  圏内資産＞圏外資産
1.  表示
    1. 残高
    1. 履歴
1. 自動設定
    1. 分配率、配当率
    1. 
1. 通知
1. 外部サービス連携
1. ポイント
    1. 有効期限
    1. ランク
1. サポート

#### エンドポイント一覧
```typescript
const endpoints = {
    root: '/economy', // 初期ページ表示
    user: {
        root: '/economy/user',
        register: '/economy/user/register', // ユーザー登録
        update: '/economy/user/update', // ユーザー更新
        delete: '/economy/user/delete', // ユーザー削除
    },
    transaction: {
        root: '/economy/transaction',
        in: '/economy/transaction/in', // 圏外資産＞圏内資産
        out: '/economy/transaction/out', // 圏内資産＞圏外資産
    },
    balance: '/economy/balance', // 残高表示
    history: '/economy/history', // 履歴表示
    setting: {
        root: '/economy/setting',
        auto: '/economy/setting/auto', // 自動設定（分配率、配当率）
    },
    notification: '/economy/notification', // 通知
    external: '/economy/external', // 外部サービス連携
    point: {
        root: '/economy/point',
        expiry: '/economy/point/expiry', // ポイント有効期限
        rank: '/economy/point/rank', // ポイントランク
    },
    support: '/economy/support' // サポート
}
```