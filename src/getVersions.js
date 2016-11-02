import AWS from 'aws-sdk'
import semver from 'semver'

// const S3_ENDPOINT = process.env.S3_ENDPOINT || 's3.amazonaws.com'

const s3Instance = new AWS.S3()

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
        //console.log(obj)
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

//getVersions().then(console.log)
