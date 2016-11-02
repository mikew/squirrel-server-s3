import express from 'express'
import morgan from 'morgan'
import semver from 'semver'

import getVersions from './getVersions.js'
import getUrlForVersion from './getUrlForVersion'
import getReleasesFile from './getReleasesFile'

export const app = express()

if (typeof describe === 'undefined') {
  app.use(morgan('combined'))
}

app.get('/download/:platform/:version', (req, res) => {
  res.redirect(getUrlForVersion(req.params.version, req.params.platform))
})

app.get('/download/:platform', (req, res) => {
  getVersions()
    .then(versions => {
      res.redirect(getUrlForVersion(versions[0], req.params.platform))
    })
    .catch(_ => {
      res.status(500)
      res.end()
    })
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
          url: getUrlForVersion(latestVersion, req.params.platform),
        })

        return
      }

      res.status(204)
      res.end()
    })
    .catch(_ => {
      res.status(500)
      res.end()
    })
})
