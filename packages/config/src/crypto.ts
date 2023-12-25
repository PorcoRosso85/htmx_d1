/**
 * this file is required for using jwt in vitest
 */

import * as crypto from 'crypto'
global.crypto = crypto
