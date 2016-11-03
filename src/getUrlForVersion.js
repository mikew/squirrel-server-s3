import config from './config'

export default function getUrlForVersion (version, platform, opts = {}) {
  let namePart = config.APP_NAME
  let ext = '.zip'
  let versionPart = `-${version}`
  let platformPart = `-${platform}`

  if (!opts.isInstaller && !opts.isUpdate) {
    opts.isInstaller = true
    opts.isUpdate = false
  }

  if (opts.isInstaller) {
    if (platform.indexOf('win32') !== -1) {
      namePart = `${namePart} Setup`
      ext = '.exe'
      platformPart = ''
      versionPart = ` ${version}`
    }

    if (platform.indexOf('darwin') !== -1) {
      ext = '.dmg'
      platformPart = ''
    }
  }

  if (opts.isUpdate) {
    if (platform.indexOf('win32') !== -1) {
      namePart = namePart.toLowerCase().replace(/\s+/, '-')
      ext = '-full.nupkg'
      platformPart = ''
    }

    if (platform.indexOf('darwin') !== -1) {
      platformPart = '-mac'
    }
  }

  const fileName = `${namePart}${versionPart}${platformPart}${ext}`

  // eslint-disable-next-line max-len
  return `https://${config.BUCKET}.${config.S3_ENDPOINT}/${version}/${global.encodeURIComponent(fileName)}`
}
