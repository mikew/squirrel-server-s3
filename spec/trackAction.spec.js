import assert from 'assert'

import { recordAction } from '../src/trackAction'

describe('recordAction', () => {
  it('initializes with 1', () => {
    const data = recordAction({}, 'download', '1.0.0')

    assert.strictEqual(data['1.0.0']['download'], 1)
  })

  it('increments values', () => {
    const data = recordAction({
      '1.0.0': { download: 1 },
    }, 'download', '1.0.0')

    assert.strictEqual(data['1.0.0']['download'], 2)
  })
})
