import assert from 'assert'
import request from 'supertest'
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
    it('get a specific version', done => {
      request(app).get('/download/darwin_x64/1.0.0')
        .expect(302)
        .expect(r => {
          assert.strictEqual(
            r.header.location,
            `https://example-app.s3-accelerated.amazonaws.com/1.0.0/Example%20App-v1.0.0-darwin_x64.dmg`
          )
        })
        .end(done)
    })
  })

  describe('/download/:platform', () => {
    it('gets the latest version', done => {
      request(app).get('/download/darwin_x64')
        .expect(302)
        .expect(r => {
          assert.strictEqual(
            r.header.location,
            `https://example-app.s3-accelerated.amazonaws.com/1.0.0/Example%20App-v1.0.0-darwin_x64.dmg`
          )
        })
        .end(done)
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
    it('returns 204 when no update found', done => {
      request(app).get('/update/darwin_x64/1.0.0')
        .expect(204)
        .end(done)
    })

    it('returns an object with a url prop', done => {
      request(app).get('/update/darwin_x64/0.9.9')
        .expect(200)
        .expect(r => {
          assert.deepStrictEqual(r.body, {
            url: 'https://example-app.s3-accelerated.amazonaws.com/1.0.0/Example%20App-v1.0.0-darwin_x64.zip',
          })
        })
        .end(done)
    })
  })

  describe('/update/:platform/:version/RELEASES', () => {
    it('shows the RELEASES file', done => {
      request(app).get('/update/darwin_x64/0.9.9/RELEASES')
        .expect(200)
        .expect(r => {
          assert.deepStrictEqual(r.text, 'SHA FILENAME SIZE')
        })
        .end(done)
    })
  })

  describe('/update/:platform/:version/*.nupkg', () => {
    it('forwards to the proper file', done => {
      request(app).get('/update/win32_x64/0.0.1/dronefuse-client-0.9.0-full.nupkg')
        .expect(302)
        .expect(r => {
          assert.strictEqual(
            r.header.location,
            'https://example-app.s3-accelerated.amazonaws.com/0.9.0/example-app-v0.9.0-win32_x64-full.nupkg'
          )
        })
        .end(done)
    })
  })
})

describe('/*.nupkg', () => {
  it('forwards to the proper file', done => {
    request(app).get('/update/win32_x64/0.0.1/dronefuse-client-0.9.0-full.nupkg')
      .expect(302)
      .expect(r => {
        assert.strictEqual(
          r.header.location,
          'https://example-app.s3-accelerated.amazonaws.com/0.9.0/example-app-v0.9.0-win32_x64-full.nupkg'
        )
      })
      .end(done)
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

  it('shows the RELEASES file', done => {
    request(app).get('/RELEASES')
      .expect(200)
      .expect(r => {
        assert.deepStrictEqual(r.text, 'SHA FILENAME SIZE')
      })
      .end(done)
  })
})
