import express from 'express'
import morgan from 'morgan'
import semver from 'semver'
import semverRegex from 'semver-regex'

import getUrlForVersion from './getUrlForVersion'
import getReleasesFile from './getReleasesFile'
import getVersions from './getVersions.js'

export const app = express()
const PORT = process.env.PORT || 3000

if (typeof describe === 'undefined') {
  app.use(morgan('combined'))
}

function handleError (res) {
  return _ => {
    res.status(500)
    res.end()
  }
}

app.get('/download/:platform/:version', (req, res) => {
  res.redirect(getUrlForVersion(req.params.version, req.params.platform, { isInstaller: true }))
})

app.get('/download/:platform', (req, res) => {
  getVersions()
    .then(versions => {
      res.redirect(getUrlForVersion(versions[0], req.params.platform, { isInstaller: true }))
    })
    .catch(handleError(res))
})

app.get('/RELEASES', (req, res) => {
  getReleasesFile().then(x => res.send(x))
})

app.get('/update/:platform/:version/RELEASES', (req, res) => {
  getReleasesFile().then(x => res.send(x))
})

app.get('/update/:platform/:version', (req, res) => {
  getVersions()
    .then(versions => {
      const latestVersion = versions[0]

      if (semver.lt(req.params.version, latestVersion)) {
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
