import config from './config'

export default function getUrlForVersion (version, platform, opts = {}) {
  let namePart = config.APP_NAME
  let ext = '.zip'

  if (opts.isInstaller) {
    if (platform.indexOf('win32') !== -1) {
      namePart = `${namePart} Setup`
      ext = '.exe'
    }

    if (platform.indexOf('darwin') !== -1) {
      ext = '.dmg'
    }
  }

  if (opts.isUpdate) {
    if (platform.indexOf('win32') !== -1) {
      namePart = namePart.toLowerCase().replace(/\s+/, '-')
      ext = '-full.nupkg'
    }
  }

  // eslint-disable-next-line max-len
  return `https://${config.BUCKET}.${config.S3_ENDPOINT}/${version}/${global.encodeURIComponent(namePart)}-v${version}-${platform}${ext}`
}
