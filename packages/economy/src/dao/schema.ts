/**
 * this file is for top of the schema file.
 * define the schema of the table.
 *
 */
import { type Static, Type } from '@sinclair/typebox'
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core'
import { createInsertSchema, createSelectSchema } from 'drizzle-typebox'

/**
 * T containes the schema of the table, and all of column name
 * T will be used as a type of the schema.
 *
 */
const T = {
  accountId: Type.String({ minLength: 1, maxLength: 50 }),
  accountName: Type.String({ minLength: 1, maxLength: 100 }),
  accountType: Type.String({ minLength: 1, maxLength: 50 }),

  transactionId: Type.String({ minLength: 1, maxLength: 50 }),
  // accountId: Type.String({ minLength: 1, maxLength: 50 }),
  amount: Type.Number({ minimum: 0, maximum: 1000000000 }),
  debitCredit: Type.String({ minLength: 1, maxLength: 10 }),
  transactionDate: Type.String({ format: 'date-time' }),
  reason: Type.String({ minLength: 1, maxLength: 200 }),

  /**
   * 送信元entityId, 送信先entityId
   * 同じtxIdで、送信元のamountの減少と、送信先のamountの増加を表現する。
   */
  entityId: Type.String({ minLength: 1, maxLength: 50 }),

  userId: Type.String({ minLength: 1, maxLength: 50 }),
  userName: Type.String({ minLength: 1, maxLength: 100 }),
  userRole: Type.String({ minLength: 1, maxLength: 50 }),
  otherInfo: Type.Optional(Type.String({ minLength: 1, maxLength: 200 })),
}

/**
 * drizzle schema
 * snake_case
 */
const accountTable = sqliteTable('account', {
  accountId: text('account_id').notNull().primaryKey(),
  accountName: text('account_name').notNull(),
  accountType: text('account_type').notNull(),
})

const accountTableTypeBox = createInsertSchema(accountTable, {
  accountId: T.accountId,
  accountName: T.accountName,
  accountType: T.accountType,
})

const userTableTypeBox = {
  tableName: 'user',
  columns: Type.Object({
    user_id: T.userId,
    user_name: T.userName,
    user_role: T.userRole,
    other_info: T.otherInfo,
  }),
}

/**
 * generate DDL from typebox object
 * for all of the tables
 * @param typebox
 * @returns
 *
 * required type mapping for sqlite, from typebox to sqlite
 * such as
 * Type.String({ minLength: 1, maxLength: 50 }) => TEXT
 * Type.Number({ minimum: 0, maximum: 1000000000 }) => INTEGER
 * etc.
 */
const genDdl = (typebox: any) => {
  let ddl = `CREATE TABLE ${typebox.tableName} (`

  const columns = Object.keys(typebox.columns.properties)
  const columnDefs = columns.map((column) => {
    const typeDef = typebox.columns.properties[column]
    let sqliteType = ''

    if (typeDef.type === 'string') {
      sqliteType = 'TEXT'
    } else if (typeDef.type === 'number') {
      sqliteType = 'INTEGER'
    } else if (typeDef.type === 'boolean') {
      sqliteType = 'BOOLEAN'
    } else if (typeDef.type === 'blob') {
      sqliteType = 'BLOB'
    } else if (typeDef.type === 'array') {
      sqliteType = 'TEXT'
    } else if (typeDef.type === 'object') {
      sqliteType = 'TEXT'
    } else if (typeDef.type === 'integer') {
      sqliteType = 'INTEGER'
    } else {
      throw new Error(`Unsupported type: ${typeDef.type}`)
    }

    return `${column} ${sqliteType}`
  })

  ddl += columnDefs.join(', ')
  ddl += ');'

  return ddl
}

/**
 * queries for d1
 * refer to endpoints in ../routes.ts
 *
 */
const queries = {
  root: {
    topView: {
      query: `select * from account`,
    },
  },

  /**
   * @see /economy/user/register
   *
   */
  'user.register': {
    query: (params: Static<typeof userTableTypeBox.columns>) => {
      return `INSERT INTO user (user_id, user_name, user_role) VALUES ('${params.user_id}', '${params.user_name}', '${params.user_role}');`
    },
  },
}

export { accountTable, accountTableTypeBox, genDdl, userTableTypeBox, queries }
