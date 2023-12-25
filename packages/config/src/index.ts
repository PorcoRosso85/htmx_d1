import { Bindings } from './binding'
import * as crypto from './crypto'

export { Bindings }

export const config = {
  //   url: 'file:local.db',
  database: {
    url: ':memory:',
  },

  // auth
  auth: {
    MAX_LOGIN_ATTEMPTS: 5,
    LOCK_TIME: 2 * 60 * 60 * 1000, // 2 hours, lock time is for duration of lock to login
  },
}
