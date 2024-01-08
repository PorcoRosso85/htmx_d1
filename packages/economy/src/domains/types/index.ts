import { Context } from 'hono'
import { describe, expect, test } from 'vitest'
import { createMachine } from 'xstate'
import { feats } from '../../route/states'
import { states } from '../states'

export { TestFunctionItems, TestFunction, TestMap, TestTypeStates } from './test'
export { LogLevelConst, LogEntry, LogLevel, logger } from './logger'

type Types = {
  AnyMethodEnd: {
    end: string
    // error: LogCalling
    [key: string]: any
    component?: JSX.Element
    query?: Types['QueryStringToDatabase']
    client?: {
      anchors: string[]
      elements: {
        [key: string]: () =>
          | (JSX.Element | undefined)
          | (JSX.Element | undefined)[]
          | ((props: any) => JSX.Element | undefined)
      }
      contain?: string[]
    }
    handler?: <T>(c: Context<T>) => void
  }

  GetMethodEnd: <T>(type: T) => Types['AnyMethodEnd'] & T

  PostMethodEnd: <T>(type: T) => Types['AnyMethodEnd'] & T & { validate?: (c: Context) => void }

  DeleteMethodEnd: <T>(type: T) => Types['AnyMethodEnd'] & T

  PutMethodEnd: <T>(type: T) => Types['AnyMethodEnd'] & T & { validate: (c: Context) => void }

  MethodEnds: {
    [K in keyof typeof states]: K extends `get /${string}`
      ? Types['GetMethodEnd']
      : K extends `post /${string}`
        ? Types['PostMethodEnd']
        : K extends `delete /${string}`
          ? Types['DeleteMethodEnd']
          : K extends `put /${string}`
            ? Types['PutMethodEnd']
            : Types['AnyMethodEnd']
  }

  QueryStringToDatabase: (params: any) => string

  HandlerOfHonoEndpoint: JSX.Element

  Context: Context

  /** For Tests */
  TestsMap: {
    [K in keyof typeof feats]: {
      [L in keyof (typeof feats)[K]]: {
        testFunction: Types['TestFunction']
        testTarget: any
        testParams: {
          type: 'toBe' | 'toEqual' | 'toMatchObject' | 'toContain' | 'toContainEqual'
          params: string[]
        }[]
      }[]
    }
  }

  TestFunctionItems: 'browserWorkerConn' | 'queryToContain'

  TestFunction: (params: Types['ParamsForTestFunction']) => void

  TestFunctionsObject: {
    [K in Types['TestFunctionItems']]: Types['TestFunction']
  }

  ParamsForTestFunction: {
    method: string
    end: string
    body?: string
    query?: string | string[]
    match: {
      type: string
      params: string[]
    }
  }

  /** map(とfunctionItems)から実行 */
  // TestFactory: (map: Types['TestsMap']) => Types['TestFunction'][]
  TestFactory: (map: Types['TestsMap']) => void
}

// []関数型だけをマッピングすればいいかもしれない, 変数型は経由地点でしかない
const typesStates: { [K in keyof Types]: { on?: { [L in string]: keyof Types } } } = {
  AnyMethodEnd: {},
  MethodEnds: {
    on: {
      1: 'GetMethodEnd',
      2: 'PostMethodEnd',
      3: 'DeleteMethodEnd',
      4: 'PutMethodEnd',
      0: 'AnyMethodEnd',
    },
  },
  GetMethodEnd: {},
  PostMethodEnd: {},
  DeleteMethodEnd: {},
  PutMethodEnd: {},
  QueryStringToDatabase: {},
  HandlerOfHonoEndpoint: {
    on: { 'feats[methoEnd].handler': 'Context', 'feats[methoEnd].query': 'QueryStringToDatabase' },
  },
  Context: {},

  TestFunction: {
    on: {
      'TestFunctionsObject[testFunction]': 'TestFunctionsObject',
      'TestFunctionItems[testFunction]': 'TestFunctionItems',
    },
  },
  TestFunctionsObject: {},
  TestFunctionItems: {},
  TestsMap: {},
  ParamsForTestFunction: {},
  TestFactory: {},
}

export const typeStateMachine = createMachine({
  /** @xstate-layout N4IgpgJg5mDOIC5QDcCWYDusAEBDAdhNmADZgC2Y+ALrAHQCC+AngLJjUAWA9hAKKEAxAGNu5AA7d8VagG0ADAF1EoSbFTVUUlSAAeiAOwBmA3SMA2AByWjtgwBYb9gIwAaEM0TOAnJbrejZ3t5cwBWS3sjACZnI3sAX3j3NEwcAiJSChl6di5eAQhYQXkFZSQQNQ0tfB19BCN5P0sAg3Mo7yj5A1D5Nw8vX39A4LCI6NiEpJAUrDxCYjJKGhyOHn5CIudSnUrNbXK6hqaWto6unr7PBEtnfxvA0IMoi295b1DE5PRZ9IWs5bouTWBSKUW25V21VqiCOdGaJlOnW6vXcVyC8jo9lC5gszmcoWCIXxn2m3zS80yS1ogNW+Q2giM4NU3HUexqBxhjThJ3aSIuqMQUUemJCJm8o3M9naJJm5Iyi2yNLy60KgnsTIqLKq+1Ahy58NavPOKP69XxcJuUp61neNxlZLm8v+1IAEukyAAnADyADMXVJuAVJKgaIIfWBcLRZJQ8gVFHROO6wB6NZCdXpOccEUbkZcYQ4zNjouEulFLOZnPbUo6-lT6G7CJ7ff78IHCMHQ+HI7Bo7S43QAI4AV2TzFTWrZ0IQPToeKijlaETCxlCAvqnVnlkX8h69nMkssHxJrYgcB0sprlOyOwnUI5CAAtLcnjd584wr1Oj57GuH+Y6PIgFBM4QFSnEoSVlMF6-FeAIAFKwLofAKjQN6sneuqINYtx2OE4ogQ475rj4fhtD0BjYVEbRvJYVY-BSKHUkwbC0iqaHauymHTqE3hmHu3jOFRPQ7rExGDGRXSUdRvh0XKtaKkCdKFOxk73rEURwiYEFdPuvSWGWa7ePYdDCSJthRN0lhvLJl6MfQADiHCKWxEK3umdShKEGmOIJAQ2DcBJRGuNx0OYDi+AY7w+K8OI2TBdl0AACiy1DOQUKkYRm3Hea+flGAFUrEcEs4XDuxj6d4RlxQxzr0AAIpk1BgGlhAZe5iCeTlvn5fl+KFaaQqmCBvTijxzTtK01VOnWSVDqlrHpa56HtdlmK5T1BVBaaDwmd077isYQqxAYU3yQCACKI4eswADK1AeiGUAACrcHVka4AARrgsBgG1nFZXudAWc4W7hHEEW+GukQaV5EH4vpINGUeXzVvFtV0A2EBNn6AZBtwIbUH9U72AYa4mMZO69FKDjdMYp2wdSADCUhNbohNLRxU6dWt3X+X1W1XOTAEXNTJOPEYiSJEAA */
  id: 'views and elements',
  tsTypes: {} as import('./index.typegen').Typegen0,
  schema: {
    // context: {} as { contextType },
    events: {} as { type: 'eventType' },
  },
  context: {
    // initialContextValue,
  },
  initial: 'HandlerOfHonoEndpoint',
  states: typesStates,
})

const testFunctionsObject: Types['TestFunctionsObject'] = {
  browserWorkerConn: ({ method, end, body, query }) => {},

  queryToContain: ({ method, end, body, query, match }) => {
    console.debug('match', match)
    const { type, params } = match
    switch (type) {
      case 'toBe':
        break
      case 'toEqual':
        break
      case 'toMatchObject':
        break
      case 'toContain':
        for (const param of params) {
          // if query is array, then check all to contain or not
          if (Array.isArray(query)) {
            for (const q of query) {
              test(`queryContain of ${q}`, () => {
                console.debug('param', param)
                console.debug('q', q)
                expect(q).toContain(param)
              })
            }
          } else {
            test(`queryContain of ${query}`, () => {
              expect(query).toContain(param)
            })
          }
        }
        break
      case 'toContainEqual':
        break
      default:
        break
    }
  },
}

const testMap: Types['TestsMap'] = {
  'get /transaction': {
    query: [
      {
        testFunction: testFunctionsObject.queryToContain,
        testTarget: feats['get /transaction'].query.insert_transaction({ from: 'from' })[0],
        testParams: [{ type: 'toContain', params: ['insert', 'transaction', '(from)'] }],
      },
      {
        testFunction: testFunctionsObject.queryToContain,
        testTarget: feats['get /transaction'].query.insert_transaction({ to: 'to' })[1],
        testParams: [{ type: 'toContain', params: ['insert', 'transaction', '(to)'] }],
      },
    ],
  },
}

const testFactory: Types['TestFactory'] = (map) => {
  const testFunctions: Types['TestFunction'][] = []

  for (const [methodEnd, features] of Object.entries(map)) {
    // extract method and end
    const { method, end } = methodEnd.split(' ') as [string, string]

    for (const [feature, tests] of Object.entries(features)) {
      switch (feature) {
        case 'query': {
          for (const test of tests) {
            const { testFunction, testTarget, testParams } = test
            for (const { type, params } of testParams) {
              testFunction({
                method,
                end,
                query: testTarget,
                match: { type: type, params: params },
              })
            }
          }
        }
        break
        case 'handler':
          break
        case 'client':
          break
        case 'component':
          break
        case 'validate':
          break
        default:
          break
      }
    }
  }
  // return testFunctions
}

export { testFactory, testMap }
