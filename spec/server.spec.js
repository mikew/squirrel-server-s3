import assert from 'assert'
import request from 'supertest-as-promised'
import mock from 'simple-mock'
import { app } from '../src/server'

describe('/download', () => {
  beforeEach(() => {
    mock.mock(require('../src/getVersions'), 'default').resolveWith([
      '1.0.0',
      '0.9.0',
    ])
  })

  afterEach(() => {
    mock.restore()
  })

  describe('/download/:platform/:version', () => {
    it('get a specific version', () => {
      return request(app).get('/download/darwin_x64/1.0.0')
        .expect(302)
        .expect(r => {
          assert.strictEqual(
            r.header.location,
            `https://example-app.s3-accelerated.amazonaws.com/1.0.0/Example%20App-1.0.0.dmg`
          )
        })
    })
  })

  describe('/download/:platform', () => {
    it('gets the latest version', () => {
      return request(app).get('/download/darwin_x64')
        .expect(302)
        .expect(r => {
          assert.strictEqual(
            r.header.location,
            `https://example-app.s3-accelerated.amazonaws.com/1.0.0/Example%20App-1.0.0.dmg`
          )
        })
    })
  })
})

describe('/update', () => {
  beforeEach(() => {
    mock.mock(require('../src/getVersions'), 'default').resolveWith([
      '1.0.0',
      '0.9.0',
    ])

    mock.mock(require('../src/getReleasesFile'), 'default').resolveWith(
      'SHA FILENAME SIZE'
    )
  })

  afterEach(() => {
    mock.restore()
  })

  describe('/update/:platform/:version', () => {
    it('returns 204 when no update found', () => {
      return request(app).get('/update/darwin_x64/1.0.0')
        .expect(204)
    })

    it('returns an object with a url prop', () => {
      return request(app).get('/update/darwin_x64/0.9.9')
        .expect(200)
        .expect(r => {
          assert.deepStrictEqual(r.body, {
            url: 'https://example-app.s3-accelerated.amazonaws.com/1.0.0/Example%20App-1.0.0-mac.zip',
          })
        })
    })
  })

  describe('/update/:platform/:version/RELEASES', () => {
    it('shows the RELEASES file', () => {
      return request(app).get('/update/darwin_x64/0.9.9/RELEASES')
        .expect(200)
        .expect(r => {
          assert.deepStrictEqual(r.text, 'SHA FILENAME SIZE')
        })
    })
  })

  describe('/update/:platform/:version/*.nupkg', () => {
    it('forwards to the proper file', () => {
      return request(app).get('/update/win32_x64/0.0.1/dronefuse-client-0.9.0-full.nupkg')
        .expect(302)
        .expect(r => {
          assert.strictEqual(
            r.header.location,
            'https://example-app.s3-accelerated.amazonaws.com/0.9.0/example-app-0.9.0-full.nupkg'
          )
        })
    })
  })
})

describe('/*.nupkg', () => {
  it('forwards to the proper file', () => {
    return request(app).get('/update/win32_x64/0.0.1/dronefuse-client-0.9.0-full.nupkg')
      .expect(302)
      .expect(r => {
        assert.strictEqual(
          r.header.location,
          'https://example-app.s3-accelerated.amazonaws.com/0.9.0/example-app-0.9.0-full.nupkg'
        )
      })
  })
})

describe('/RELEASES', () => {
  beforeEach(() => {
    mock.mock(require('../src/getReleasesFile'), 'default').resolveWith(
      'SHA FILENAME SIZE'
    )
  })

  afterEach(() => {
    mock.restore()
  })

  it('shows the RELEASES file', () => {
    return request(app).get('/RELEASES')
      .expect(200)
      .expect(r => {
        assert.deepStrictEqual(r.text, 'SHA FILENAME SIZE')
      })
  })
})
