import config from './config'
import { s3Instance } from './aws'
import splitPlatformAndArch from './splitPlatformAndArch.js'

export default function getReleasesFile (platformWithArch) {
  const [ _, arch ] = splitPlatformAndArch(platformWithArch)
  const toAppend = arch === 'x64' ? '' : '-ia32'
  const params = {
    Bucket: config.BUCKET,
    Key: `RELEASES${toAppend}`,
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
