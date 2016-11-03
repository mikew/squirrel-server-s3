import assert from 'assert'
import getUrlForVersion from '../src/getUrlForVersion'
import config from '../src/config'

function getFilenameFromURL (url) {
  const parts = url.split('/')
  return global.decodeURIComponent(parts[parts.length - 1])
}

describe.only('getUrlForVersion', () => {
  beforeEach(() => {
    config.BUCKET = 'example-app'
    config.APP_NAME = 'Example App'
    config.S3_ENDPOINT = 's3-accelerated.amazonaws.com'
  })

  describe('isInstaller', () => {
    it('works for all platforms', () => {
      const platformsAndFilenames = {
        darwin_x64: 'Example App-1.0.0.dmg',
        win32_x64: 'Example App Setup 1.0.0.exe',
        linux_x86: 'Example App-1.0.0-linux_x86.zip',
      }

      Object.keys(platformsAndFilenames).forEach(platform => {
        const expectedFilename = platformsAndFilenames[platform]
        assert.strictEqual(
          expectedFilename,
          getFilenameFromURL(getUrlForVersion('1.0.0', platform, { isInstaller: true }))
        )
      })
    })
  })

  describe('isUpdate', () => {
    it('works for all platforms', () => {
      const platformsAndFilenames = {
        darwin_x64: 'Example App-1.0.0-mac.zip',
        win32_x64: 'example-app-1.0.0-full.nupkg',
        linux_x86: 'Example App-1.0.0-linux_x86.zip',
      }

      Object.keys(platformsAndFilenames).forEach(platform => {
        const expectedFilename = platformsAndFilenames[platform]
        assert.strictEqual(
          expectedFilename,
          getFilenameFromURL(getUrlForVersion('1.0.0', platform, { isUpdate: true }))
        )
      })
    })
  })
})
