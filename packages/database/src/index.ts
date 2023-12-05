// import { createClient } from '@libsql/client/web' // memory非対応
import { createClient } from '@libsql/client'
import { config } from '@quantic/config'

const db = createClient(config.database)
const rs = await db.execute(/*sql*/ `SELECT name FROM sqlite_master WHERE type='table'`)
console.log(rs)
