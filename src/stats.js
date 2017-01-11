import config from './config'
import { s3Instance } from './aws'

export function getStats () {
  const params = {
    Bucket: config.BUCKET,
    Key: 'stats.json',
  }

  return new Promise(resolve => {
    s3Instance.getObject(params, (err, data) => {
      if (err) {
        // eslint-disable-next-line no-console
        console.error(err)

        resolve('{}')

        return
      }

      resolve(new Buffer(data.Body).toString())
    })
  })
}

export function putStats (data) {
  const params = {
    Bucket: config.BUCKET,
    Key: 'stats.json',
    Body: JSON.stringify(data),
  }

  return new Promise((resolve, reject) => {
    s3Instance.putObject(params, err => {
      if (err) {
        reject(err)

        return
      }

      resolve(data)
    })
  })
}
