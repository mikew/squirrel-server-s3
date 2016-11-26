import config from './config'
import { s3Instance } from './aws'

export default function getReleasesFile () {
  const params = {
    Bucket: config.BUCKET,
    Key: 'RELEASES',
  }

  return new Promise(resolve => {
    s3Instance.getObject(params, (err, data) => {
      if (err) {
        // eslint-disable-next-line no-console
        console.error(err)

        resolve('')

        return
      }

      resolve(new Buffer(data.Body).toString())
    })
  })
}
