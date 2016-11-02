import assert from 'assert'
import getUrlForVersion from '../src/getUrlForVersion'
import config from '../src/config'

describe('getUrlForVersion', () => {
  beforeEach(() => {
    config.BUCKET = 'example-app'
    config.APP_NAME = 'Example App'
    config.S3_ENDPOINT = 's3-accelerated.amazonaws.com'
  })

  it('works', () => {
    assert.strictEqual(
      getUrlForVersion('1.0.0', 'darwin_x64'),
      `https://example-app.s3-accelerated.amazonaws.com/1.0.0/Example%20App-v1.0.0-darwin_x64.zip`
    )

    assert.strictEqual(
      getUrlForVersion('1.0.0', 'linux_x86'),
      `https://example-app.s3-accelerated.amazonaws.com/1.0.0/Example%20App-v1.0.0-linux_x86.zip`
    )
  })
})
