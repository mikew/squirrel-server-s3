import semverRegex from 'semver-regex'
import getUrlForVersion from './getUrlForVersion'

function transformLine (line) {
  const parts = line.split(/\s+/)
  const url = parts[1]

  if (url.indexOf('/') !== -1) {
    return line
  }

  const matches = url.match(semverRegex())

  if (!matches || matches.length === 0) {
    return line
  }

  const version = matches[0]
    .replace('-full.nupkg', '')

  return [
    parts[0],
    getUrlForVersion(version, 'win32_x64', { isUpdate: true }),
    parts[2],
  ].join(' ')
}

export default function transformReleasesFile (contents) {
  return contents
    .split(/\r?\n/)
    .map(transformLine)
    .join('\n')
}
