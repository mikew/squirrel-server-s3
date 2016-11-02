import semver from 'semver'
import { s3Instance } from './aws'

export default function getVersions () {
  return new Promise((resolve, reject) => {
    const bucketParams = {
      Bucket: process.env.BUCKET,
      MaxKeys: 10000,
    }

    s3Instance.listObjects(bucketParams, (err, data) => {
      if (err) {
        reject(err)

        return
      }

      const versions = []

      data.Contents.forEach(obj => {
        const version = obj.Key.split('/')[0]

        if (!semver.valid(version)) {
          return
        }

        if (versions.indexOf(version) !== -1) {
          return
        }

        versions.push(version)
      })

      resolve(versions.sort(semver.rcompare))
    })
  })
}
