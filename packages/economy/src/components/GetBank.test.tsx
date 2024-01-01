import { render, screen } from '@testing-library/react'
import { afterAll, beforeAll, describe, expect, test } from 'vitest'
import { buttonComponents } from './GetBank'

describe.skip('GetBank', () => {
  beforeAll(() => {
    const jsdom = require('jsdom')
    const { JSDOM } = jsdom

    const dom = new JSDOM()
    global.document = dom.window.document
    global.window = dom.window
  })

  test('GetBank returns a button for each endpoint', () => {
    const endpoints = ['a', 'b', 'c']

    /**
     * 仮にコンポーネントをインポートしたとする
     * 下記はコンポーネントの例である
     */
    const GetBank = (endpoints) => {
      const buttons = buttonComponents({ endpoints })
      return (
        <div>
          {buttons.a}
          {buttons.b}
          {buttons.c}
        </div>
      )
    }

    for (const endpoint of endpoints) {
      console.debug('endpoint', endpoint)

      const { getByRole } = render(<GetBank endpoints={endpoints} />)
      const button = getByRole('button')

      expect(button).toHaveAttribute('type', 'button')
    }
  })

  test.skip('GetBank returns a button for each endpoint', () => {
    const endpoints = ['a', 'b', 'c']
    const buttons = buttonComponents({ endpoints })

    for (const endpoint of endpoints) {
      console.debug('endpoint', endpoint)

      console.debug('buttons[endpoint]', buttons[endpoint])
      const { getByRole } = render(buttons[endpoint])
      const button = getByRole('button')

      expect(button).toHaveAttribute('type', 'button')
    }
  })

  describe.skip('compoA', () => {
    const CompoA = () => {
      return (
        <div>
          <h1>Endpoint A</h1>
          <p>Access Endpoint B or C using the links below:</p>
          <ul>
            <li>
              <a href="/endpoint-b">Link to Endpoint B</a>
            </li>
            <li>
              <a href="/endpoint-c">Link to Endpoint C</a>
            </li>
          </ul>
        </div>
      )
    }

    describe.skip('CompoA Component', () => {
      test('contains links to Endpoint B and Endpoint C', () => {
        render(<CompoA />)

        const linkToB = screen.getByRole('link', { name: /link to endpoint b/i })
        expect(linkToB).toBeInTheDocument()
        expect(linkToB).toHaveAttribute('href', '/endpoint-b')

        const linkToC = screen.getByRole('link', { name: /link to endpoint c/i })
        expect(linkToC).toBeInTheDocument()
        expect(linkToC).toHaveAttribute('href', '/endpoint-c')
      })
    })
  })
})
