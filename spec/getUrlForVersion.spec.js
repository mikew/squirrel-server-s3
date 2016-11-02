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
      `https://example-app.s3-accelerated.amazonaws.com/1.0.0/Example%20App-v1.0.0-darwin_x64.zip`,
      getUrlForVersion('1.0.0', 'darwin_x64')
    )

    assert.strictEqual(
      `https://example-app.s3-accelerated.amazonaws.com/1.0.0/Example%20App-v1.0.0-linux_x86.zip`,
      getUrlForVersion('1.0.0', 'linux_x86')
    )
  })

  it('takes a `isInstaller` prop', () => {
    assert.strictEqual(
      `https://example-app.s3-accelerated.amazonaws.com/1.0.0/Example%20App-v1.0.0-darwin_x64.dmg`,
      getUrlForVersion('1.0.0', 'darwin_x64', { isInstaller: true })
    )

    assert.strictEqual(
      `https://example-app.s3-accelerated.amazonaws.com/1.0.0/Example%20App%20Setup-v1.0.0-win32_x64.exe`,
      getUrlForVersion('1.0.0', 'win32_x64', { isInstaller: true })
    )
  })

  it('takes a `isUpdate` prop', () => {
    assert.strictEqual(
      `https://example-app.s3-accelerated.amazonaws.com/1.0.0/example-app-v1.0.0-win32_x86-full.nupkg`,
      getUrlForVersion('1.0.0', 'win32_x86', { isUpdate: true })
    )
  })
})
