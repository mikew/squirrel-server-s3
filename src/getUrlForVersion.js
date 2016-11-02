import config from './config'

export default function getUrlForVersion (version, platform) {
  return `https://${config.BUCKET}.${config.S3_ENDPOINT}/${version}/${global.encodeURIComponent(config.APP_NAME)}-v${version}-${platform}.zip`
}
