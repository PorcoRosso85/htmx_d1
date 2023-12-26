/**
 * this file is for top of the schema file.
 * define the schema of the table.
 *
 */
import { type Static, Type } from '@sinclair/typebox'

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

  userId: Type.Optional(Type.String({ minLength: 1, maxLength: 50 })),
  email: Type.String({ minLength: 1, maxLength: 50, format: 'email' }),
  userName: Type.String({ minLength: 1, maxLength: 100 }),
  userRole: Type.String({ minLength: 1, maxLength: 50 }),
  otherInfo: Type.Optional(Type.String({ minLength: 1, maxLength: 200 })),
}

const accountTableTypeBox = {
  tableName: 'account',
  columns: Type.Object({
    account_id: T.accountId,
    account_name: T.accountName,
    account_type: T.accountType,
  }),
}

const userTableTypeBox = {
  tableName: 'user',
  columns: Type.Object({
    user_id: T.userId,
    user_name: T.userName,
    user_role: T.userRole,
    email: T.email,
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

export { accountTableTypeBox, genDdl, userTableTypeBox }
