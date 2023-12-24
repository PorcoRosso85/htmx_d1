/**
 * this file is for top of the schema file.
 * define the schema of the table.
 *
 */
import { Static, Type } from '@sinclair/typebox'
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

  journalId: Type.String({ minLength: 1, maxLength: 50 }),
  // accountId: Type.String({ minLength: 1, maxLength: 50 }),
  amount: Type.Number(),
  debitCredit: Type.String({ minLength: 1, maxLength: 10 }),
  transactionDate: Type.String({ format: 'date-time' }),
  reason: Type.String({ minLength: 1, maxLength: 200 }),

  userId: Type.String({ minLength: 1, maxLength: 50 }),
  userName: Type.String({ minLength: 1, maxLength: 100 }),
  userType: Type.String({ minLength: 1, maxLength: 50 }),
  otherInfo: Type.Optional(Type.String({ minLength: 1, maxLength: 200 })),

  transactionId: Type.String({ minLength: 1, maxLength: 50 }),
  originatingEntityId: Type.String({ minLength: 1, maxLength: 50 }),
  targetEntityId: Type.String({ minLength: 1, maxLength: 50 }),
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

const userTable = sqliteTable('user', {
  userId: text('user_id').notNull().primaryKey(),
  userName: text('user_name').notNull(),
  userType: text('user_type').notNull(),
  otherInfo: text('other_info'),
})

const userTableTypeBox = createInsertSchema(userTable, {
  userId: T.userId,
  userName: T.userName,
  userType: T.userType,
  otherInfo: T.otherInfo,
})

/**
 * queries for d1
 * refer to endpoints in ../routes.ts
 *
 */
const queries = {
  // endpoints.root
  root: {
    topView: {
      query: `select * from account`,
    },
  },

  // endpoints.user
}

export { accountTable, accountTableTypeBox, userTable, userTableTypeBox, queries }
