/**
 * this file is for top of the schema file.
 * define the schema of the table.
 *
 */
import { Static, Type } from '@sinclair/typebox'

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

const accountTable = {
  tableName: 'account',
  typeObject: Type.Object({
    accountId: T.accountId,
    accountName: T.accountName,
    accountType: T.accountType,
  }),
}

const journalTable = {
  tableName: 'journal',
  typeObject: Type.Object({
    journalId: T.journalId,
    accountId: T.accountId,
    amount: T.amount,
    debitCredit: T.debitCredit,
    transactionDate: T.transactionDate,
    reason: T.reason,
  }),
}

const userTable = {
  tableName: 'user',
  typeObject: Type.Object({
    userId: T.userId,
    userName: T.userName,
    userType: T.userType,
    otherInfo: T.otherInfo,
  }),
}

const transactionTable = {
  tableName: 'transaction',
  typeObject: Type.Object({
    transactionId: T.transactionId,
    originatingEntityId: T.originatingEntityId,
    targetEntityId: T.targetEntityId,
  }),
}

// generate DDL
const generateDDL = (tableName: string, table: { typeObject: Static<typeof Type.Object> }) => {
  const columns = Object.keys(table.typeObject).map((key) => `${key} ${table.typeObject[key].type}`)
  const sql = `CREATE TABLE ${tableName} (${columns.join(', ')})`
  return sql
}

export { T, accountTable, journalTable, userTable, transactionTable, generateDDL }
