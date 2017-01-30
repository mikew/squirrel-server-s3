import config from './config'
import splitPlatformAndArch from './splitPlatformAndArch'

export default function getUrlForVersion (version, platformWithArch, opts = {}) {
  let namePart = config.APP_NAME
  let ext = '.zip'
  const [ platform, arch ] = splitPlatformAndArch(platformWithArch)
  let versionPart = `-${version}`
  let platformPart = `-${platform}`
  let filePrefix = ''

  if (!opts.isInstaller && !opts.isUpdate) {
    opts.isInstaller = true
    opts.isUpdate = false
  }

  if (opts.isInstaller) {
    if (platform === 'win32') {
      filePrefix = 'win/'
      namePart = `${namePart} Setup`
      ext = '.exe'
      platformPart = ''
      versionPart = ` ${version}`

      if (arch === 'ia32') {
        platformPart = '-ia32'
        filePrefix = 'win-ia32/'
      }
    }

    if (platform.indexOf('darwin') !== -1) {
      ext = '.dmg'
      filePrefix = 'mac/'
      platformPart = ''
    }

    if (platform === 'linux') {
      platformPart = ''
      filePrefix = 'linux/'

      if (arch === 'ia32') {
        platformPart = '-ia32'
        filePrefix = 'linux-ia32/'
      }
    }
  }

  if (opts.isUpdate) {
    if (platform === 'win32') {
      filePrefix = 'win/'
      namePart = namePart.toLowerCase().replace(/\s+/, '-')
      ext = '-full.nupkg'
      platformPart = ''

      if (arch === 'ia32') {
        filePrefix = 'win-ia32/'
      }
    }

    if (platform === 'darwin') {
      filePrefix = 'mac/'
      platformPart = '-mac'
    }

    if (platform === 'linux') {
      platformPart = ''
      filePrefix = 'linux/'

      if (arch === 'ia32') {
        platformPart = '-ia32'
        filePrefix = 'linux-ia32/'
      }
    }
  }

  const fileName = `${namePart}${versionPart}${platformPart}${ext}`

  // eslint-disable-next-line max-len
  return `https://${config.BUCKET}.${config.S3_ENDPOINT}/${version}/${filePrefix}${global.encodeURIComponent(fileName)}`
}
