import config from './config'
import getUrlForVersion from './getUrlForVersion'

function renderTableRow (version) {
  return `
<tr>
  <td>${version}</td>
  <td><a href="${getUrlForVersion(version, 'darwin_x64')}">macOS</a></td>
  <td><a href="${getUrlForVersion(version, 'win32_x64')}">Windows</a></td>
</tr>
`
}


export default function renderVersionsPage (versions = []) {
  return `
<!DOCTYPE html>

<html>
  <head>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css" />
  </head>
  <body>
    <div class="container">
      <h1>${config.APP_NAME} Releases</h1>
      <table class="table table-striped table-hover">
        <tbody>
          ${versions.map(renderTableRow).join('\n')}
        </tbody>
      </table>
    </div>
  </body>
</html>
`
}
