import { createMachine } from 'xstate'

export { states }

/**
 * このオブジェクトにエンドポイントを定義しないと
 * featsの型が正しくなくなり
 * webサーバーにエンドポイントを登録できません
 */
const states = {
  /**
   * from /
   * to [/user, /bank, /transaction, /support]
   */
  'get /': {
    on: {
      'get /user.200': 'get /user',
      'get /bank.200': 'get /bank',
      'get /transaction.200': 'get /transaction',
      'get /support.200': 'get /support',
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
  'post /user/register': {},

  'post /user/update': {},

  'post /user/delete': {},

  'get /user/setting': {},

  /** every api for each items to be registerd/updated */
  'post /user/setting': {},

  'post /setting/auto': {},

  'get /notification': {},

  'get /bank': {},

  'post /bank/create': {},

  'post /bank/update': {},

  'post /bank/delete': {},

  'get /transaction': {},

  'post /transaction/validornot': {},

  'post /transaction/duplicatedornot': {},

  'post /transaction/execute': {},

  'post /open/algorithm/basic/oneToOne': {},

  'post /open/algorithm/accountingStandards/jpn': {},

  'post /open/algorithm/accountingStandards/global': {},

  'get /support': {},
}

export const viewStateMachine = createMachine({
  /** @xstate-layout N4IgpgJg5mDOIC5QDcCWYDusAEBDAdhNmADZgC2Y+ALrAHQzXYD0AxIywK6xgBOdAJgAMQgNpCAuolAAHAPaxU1VHPzSQAD0QAWABwBGQQICsQgMxCAbNv1CAnLu0AaEAE9EAdg8C6+s7sczOzMPXTt9bQBfSJc0TBwCIlIKKloGMCY2DmYAIwIAa0ERcSkkEHlFZVV1LQQ9QwETcysbe0cXdwRdCzpLP0ddY3DTIQFo2PQsPEJiMkoaemz2DJZqXgJYXABjKvwisUl1CqUVNTLa+qNTC2tbB2c3Tz9ey38ggUcPgSiYkDipxKzFILdKZZaZWCcGTyXjUfYlI4KE7Vc46AxXZq3NoPToBOx0IQBQZmb7GO5jcYgfByCBwdT-BIzZLzWiIyqnGqIAC0lg63MsBJEQuFwo8lIZ0ySc1SixWzDZyLOoFqZm0Qjo3Q8ZIcwVVQhxnm+dDsQvCQn0jV0o3Fk0ZUuBaWy1OoADE5JxCArdpyEPoPGY6GZjGY-NohnZvhFeY9fUItXQteb9GEzEFVTb4pKgSzZZlVABRXi8OS8L0c1G+q3Gj5+Yy6AReV7GPkISxx40jAweISmSwCMwZgFM6Ug7LcPhllHKxCWCOCAwWC0huzGYwCFteQzdEx2bQCWdWyzGQd27MyugVTLj3jMXhgKCoWDUCdlY7eiv6YwCjyWXQ-809h4u6qi2+ihlcS51lqe66CeWbMuel5cDwN5QhAuDPpOSqaIgn74tov5at4+h2A4R4GggJrqiSZL6nY-q2GKvwSoCCEgkhzDXswtJkJhr5Iu+06+n2vihH4hJtq8QTRp0th+oIWpgTB5jfHYcGsSOjpylxPDUMo+BQFhPr6K8CbBrWwamFqDYttoJJ0GuvZeNoe5BumzG2vBmn0BxOkZPphn8eyU44b6QwOU0hIeNowSWhRITaASIyvPYVj7j8EyZhpDo+QoEL+agBnMLgnDUHIRkfuFn5Cn++4NjYHgtiuugaiIdx9pYHgmepw45aCLDOqgABmqBbBh5ayAJE2hSZArWFYJKWG2QHJi2JgeL4QrBqEeqDD19o5v1uQFBVQmzj4NaLv2JGruuMbdNRcZDGE-Y2MYGV-J52WHRxeT4PkzBbHeGFgKdM3hcSfghLOMX6qBaq+CMcl2eEFiwR5WW9T9eUsH9ANoSDYO1J+G1hiGJL2H0bV3bJDi9E0ERAdZwgDhjQ4HYhOPHf93HJHxk3BdhxNtqJyb1vuFMNs2MYhsYDmJnWdndn6x5s6ebFaZkawbNsgnlFNIW1Od87iUuN1rhuzxBlqYR9H09Gq5l7NnuxXPa-gmw7KczDILgJCoBAJbOkTuGNBqYkmGmISOI1MYxYYor9vRjguftLtpBx7ue7s3FQv7Y3PoHvDB0FirGeaEXJrO1wWhENOII4W6mLY5gkTFBhpxruVPqs6we7r3tgBoYBbKVoOl3rxM9GuBgNv4u4xdFLbop1IzvSaFg2KzTvq95F5c3IMhUMVJBQCWSgABbkMdihbMwqhgAAKnIADy+DjwLZcVoMGoEQEcYEW8KMWOnR150G0ImLwPYIjBg+ixLGnMe73yPvgE+Z9eCX2vtsLY7oaCFSgAAZWoIkXAvAICwGYAAKxkNhN801ahrmNH+a43huzdFWjGHagZEwriWnWMI+hO57w4ofY+ft0GYOKlsHBHoApEJIWQihUASByDyCQEOdR66tiWuApougmz6K6tvT6mMOajjlJCaEJZqAaONpdc010VwW3ugEBM9Y2zW27N8H40QgA */
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
