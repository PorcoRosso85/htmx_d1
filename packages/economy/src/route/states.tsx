import { Context, Hono } from 'hono'
import { createMachine } from 'xstate'
import * as components from '../components'

/**
 * このオブジェクトにエンドポイントを定義しないと
 * featsの型が正しくなくなり
 * webサーバーにエンドポイントを登録できません
 */
const states = {
  /**
   * from /
   * to [/user, /notFound,/onError, /bank, /transaction]
   */
  'get /': {
    on: {
      'get /user.200': 'get /user',
    },
  },

  /** hono returns 404 */
  'get /notFound': {},

  /** hono returns 500 */
  'get /onError': {},

  /**
   * from /user
   * to [/user/*, /bank, /transaction]
   */
  'get /user': {},
  // [] postとgetの統合、postにリクエストボディがある場合はpostに、ない場合はgetにする
  'post /user/register': {
    on: {
      'post /user/register.200': 'get /user',
    },
  },
  'post /user/update': {},
  'post /user/delete': {},
  'get /setting': {},
  'post /setting/auto': {},
  'get /notification': {},
  'get /bank': {},
  'post /bank/create': {},
  'post /bank/update': {},
  'post /bank/delete': {},
  'post /transaction/validornot': {},
  'post /transaction/duplicatedornot': {},
  'post /transaction/execute': {},
  'post /open/algorithm/basic/oneToOne': {},
  'post /open/algorithm/accountingStandards/jpn': {},
  'post /open/algorithm/accountingStandards/global': {},
  'get /support': {},
}

export const nameOfMachine = createMachine({
  /** @xstate-layout N4IgpgJg5mDOIC5QDcCWYDusAEBDAdhNmADZgC2Y+ALrAHQzUD0AxI0wK6xgBOdATAAZBAbUEBdRKAAOAe1ipqqWfikgAHogAsAVgDsdLQE4AzAA4AjMIumzxgDQgAnoj1mTdAGyX+FnccE9PVMAXxDHNEwcAiJSCipaOjlYZi5eJh4wKFQU3hZk1O4eDKyc6l4BYTFJJBBkxWVVWs0EXQNjcytBG3MHZ20jCzoTQU8LPV0rPX4dIzDwkHxZCDg1SKw8QmIyShp4WvqlFTUWgFpPRxcEc7phO-v7o34wiPQNmO34vYYwZjVDxonRAmEwGKyeEYWfhGTxPTw6S6udzDCZGMyefhaCxmPTdF4gdbRLZxXaJdhLagAMVkHEI-3kDWOzUQ4w8Ji0oOmek8gnZZn8iIQnmFhkxRlMWghOgxWnxhM2sR2CXo7BUAFEeDxZDx6Qojk1QC1sYI6E9LFppuLLNizIKLDZ+HRcd12RYQdi5W8iYqvmTfpwirrGQaNIhvB5pWZLDzLE9JYKgp46FDBjpBPwRsLngt5R8ScqkvJCulMtlcjqDgz9UCEPw9EMdNjgrp0bDhYKAqbxUZdPwxtH3J6ogrPqT6AUA+kONIILhykHq8yEH4jIZvNyTEZG-beSYE5i6GZu7jxpLfJ4h+9iUrvhO0sUVmR55W9YClxYMcm3G67GZulZ+H4QVLC8PQ00EWYdHcKYdEvb1RwLdhuGoJR8CgBc30NFkzEdLRJSPC0wJ6EwLn6ZctBNPxhEA9MdDowY4JHfNbyLJhkNQqAmFwDhqFkDCmSw5dZmTcDsVZTwtD-ICyPtdkBBme0-3hUwLFlHMvSYm8-WYClUAAM1QABjOdMLqKtTKNEUIShTxuSMbo7B0PcyJmME7nZSSbDGExGLzLSVX9AAjAgAGt+JDI0jzoOiTCoiS7AhPs7W6Aw60bGZ+BxDFzF869fXHVjgvwEKmEMzI5zAcKaxXQ8OW5fx4TGSTBR5Awe3FIJN2snL1OHPz8sLFImCKkrp1nZ8ZHMgTQyE9onNUlt5rTLRkrAp00ysGw0XDXKfTHQbmBGphH1+SqX2DaqeWTDFG0GVTYuMUirjsIZ+TuDNBDu9FdoQlihuoHgCFgXBDP1JhkFwEhUAgbUKSq99AMPb92V5CFeXRQUtzMQ9rE+mjQX8H7mMSCcAaBkGwYgacoeM8oYZ4OHzsXQTNui3wj1UpzhEkp7EH8VcLUet1oVGJyif8g6mDJ-BgdBxomDAdQwEMnizsm19pqNEY2csEw018Yx7QRMiOUdHQxWhGxdHDC9eqvPaCwnWRpCoLiSCgbVFAAC3IYbcAUQymBUMAABVZAAeXwNWzI1iLEH5Q9QUkox63-VSLEx4RhhmT7Yvmvs5jt+DiYKobnddyGPZ4b3fZBwyaRoVA0IAZWoGJcB4CBYCYAAraQQwBTW+cdFOfGlRsJhw3mECT25jEGWK61i8VxYGp2XfwN2q5rrjDPr2kONb9vO+7qASFkYKSHhwStGkq4bGxm6HKxC0oUHIvNIGpDpzkHhqGvma4xVx1nNNCFOJESKCjztFSeKdRjCHrGpMIQA */
  id: 'views and elements',
  tsTypes: {} as import('./states.typegen').Typegen0,
  schema: {
    // context: {} as { contextType },
    events: {} as { type: 'eventType' },
  },
  context: {
    // initialContextValue,
  },
  initial: 'get /',
  states: states,
})

type BaseType = {
  end: string
  error: object
  [key: string]: any
  component?: JSX.Element
}

type GetType<T = any> = BaseType & {
  query?: (params: T) => string
}

type PostType = BaseType & {
  validate: (c: Context) => void
  query: any
}

type DeleteType<T = any> = BaseType & {
  query: (params: T) => string
}

type PutType<T = any> = BaseType & {
  validate: (c: Context) => void
  query: (params: T) => string
}

type Ends = {
  [K in keyof typeof states]: K extends `get /${string}`
    ? GetType
    : K extends `post /${string}`
      ? PostType
      : K extends `delete /${string}`
        ? DeleteType
        : K extends `put /${string}`
          ? PutType
          : never
}

// これにより、FeatsオブジェクトはStatesのキーのみを含むことが保証されます
const feats: Ends = {
  'get /bank': {
    end: '/bank',
    error: {},
  },
}

const app = new Hono()
app.get(feats['get /bank'].end, (c) => {
  return c.html(<components.GetBank />)
})

export { feats, app, Ends }

export default app
