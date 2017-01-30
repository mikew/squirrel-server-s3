import express from 'express'
import morgan from 'morgan'
import semver from 'semver'
import semverRegex from 'semver-regex'

import getChangelog from './getChangelog'
import getUrlForVersion from './getUrlForVersion'
import getReleasesFile from './getReleasesFile'
import getVersions from './getVersions.js'
import renderVersionsPage from './renderVersionsPage'
import trackAction from './trackAction'
import { getStats } from './stats'

export const app = express()
const PORT = process.env.PORT || 3000

process.on('unhandledRejection', (reason, promise) => {
  if (typeof describe !== 'undefined') {
    return
  }

  // eslint-disable-next-line no-console
  console.log('Unhandled Rejection at: Promise', promise, 'reason:', reason)
})

if (typeof describe === 'undefined') {
  app.use(morgan('combined'))
}

function handleError (res) {
  return _ => {
    res.status(500)
    res.end()
  }
}

app.get('/', (req, res) => {
  const baseurl = `${req.protocol}://${req.headers.host}`
  getVersions()
    .then(versions => {
      res.send(renderVersionsPage(versions, baseurl))
    })
    .catch(handleError(res))
})

app.get('/download/:platform/:version', (req, res) => {
  trackAction(`download:${req.params.platform}`, req.params.version)
  res.redirect(getUrlForVersion(req.params.version, req.params.platform, { isInstaller: true }))
})

app.get('/download/:platform', (req, res) => {
  getVersions()
    .then(versions => {
      trackAction(`download:${req.params.platform}`, versions[0])
      res.redirect(getUrlForVersion(versions[0], req.params.platform, { isInstaller: true }))
    })
    .catch(handleError(res))
})

app.get('/changelog', (req, res) => {
  getChangelog().then(x => res.send(x))
})

app.get('/stats.json', (req, res) => {
  getStats().then(x => {
    res.header('Content-Type', 'application/json')
    res.send(x)
  })
})

app.get('/RELEASES', (req, res) => {
  // TODO Better way of determining platform here
  req.params.platform = 'win32_x64'
  getReleasesFile(req.params.platform).then(x => res.send(x))
})

app.get('/RELEASES-ia32', (req, res) => {
  // TODO Better way of determining platform here
  req.params.platform = 'win32_ia32'
  getReleasesFile(req.params.platform).then(x => res.send(x))
})

app.get('/update/:platform/:version/RELEASES', (req, res) => {
  getReleasesFile(req.params.platform)
    .then(x => res.send(x))
})

app.get('/update/:platform/:version', (req, res) => {
  getVersions()
    .then(versions => {
      if (!semver.valid(req.params.version)) {
        handleError(res)()

        return
      }

      const latestVersion = versions[0]

      if (semver.lt(req.params.version, latestVersion)) {
        trackAction(`update:${req.params.platform}`, latestVersion)
        res.json({
          url: getUrlForVersion(latestVersion, req.params.platform, { isUpdate: true }),
        })

        return
      }

      res.status(204)
      res.end()
    })
    .catch(err => {
      // eslint-disable-next-line no-console
      console.error(err)

      // Intentinally return an empty body on error
      res.body('')
    })
})

function handleWindowsUpdate (t, req, res) {
  const nupkg = `${t}.nupkg`
    .replace('-full.nupkg', '')
    .replace('-delta.nupkg', '')
  const matches = nupkg.match(semverRegex())
  const version = matches && matches[0]

  if (!version) {
    handleError(res)()

    return
  }

  trackAction(`update:${req.params.platform}`, version)
  res.redirect(getUrlForVersion(version, req.params.platform, { isUpdate: true }))
}

app.get('/update/:platform/:version/*.nupkg', (req, res) => {
  handleWindowsUpdate(req.params[0], req, res)
})

app.get('/*.nupkg', (req, res) => {
  // TODO Better way of determining platform here
  req.params.platform = 'win32_x64'
  handleWindowsUpdate(req.params[0], req, res)
})

if (typeof describe === 'undefined') {
  app.listen(PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`Listening on port ${PORT}`)
  })
}
