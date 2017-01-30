import assert from 'assert'
import getUrlForVersion from '../src/getUrlForVersion'
import config from '../src/config'

describe('getUrlForVersion', () => {
  beforeEach(() => {
    config.BUCKET = 'example-app'
    config.APP_NAME = 'Example App'
    config.S3_ENDPOINT = 's3-accelerated.amazonaws.com'
  })

  describe('isInstaller', () => {
    it('works for all platforms', () => {
      const platformsAndFilenames = {
        darwin_x64: 'mac/Example App-1.0.0.dmg',
        win32_x64: 'win/Example App Setup 1.0.0.exe',
        win32_ia32: 'win-ia32/Example App Setup 1.0.0-ia32.exe',
        linux_x64: 'linux/Example App-1.0.0.zip',
        linux_ia32: 'linux-ia32/Example App-1.0.0-ia32.zip',
      }

      Object.keys(platformsAndFilenames).forEach(platform => {
        const generated = getUrlForVersion('1.0.0', platform, { isInstaller: true })
        const expectedFilename = platformsAndFilenames[platform]

        assert.ok(
          global.decodeURIComponent(generated).endsWith(expectedFilename),
          `Expected ${generated} to end with ${expectedFilename}`
        )
      })
    })
  })

  describe('isUpdate', () => {
    it('works for all platforms', () => {
      const platformsAndFilenames = {
        darwin_x64: 'mac/Example App-1.0.0-mac.zip',
        win32_x64: 'win/example-app-1.0.0-full.nupkg',
        win32_ia32: 'win-ia32/example-app-1.0.0-full.nupkg',
        linux_x64: 'linux/Example App-1.0.0.zip',
        linux_ia32: 'linux-ia32/Example App-1.0.0-ia32.zip',
      }

      Object.keys(platformsAndFilenames).forEach(platform => {
        const generated = getUrlForVersion('1.0.0', platform, { isUpdate: true })
        const expectedFilename = platformsAndFilenames[platform]

        assert.ok(
          global.decodeURIComponent(generated).endsWith(expectedFilename),
          `Expected ${generated} to end with ${expectedFilename}`
        )
      })
    })
  })
})
