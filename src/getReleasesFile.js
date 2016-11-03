import config from './config'
import { s3Instance } from './aws'

export default function getReleasesFile () {
  const params = {
    Bucket: config.BUCKET,
    Key: 'RELEASES',
  }

  return new Promise((resolve, reject) => {
    s3Instance.getObject(params, (err, data) => {
      if (err) {
        reject(err)

        return
      }

      resolve(new Buffer(data.Body).toString())
    })
  })
}
