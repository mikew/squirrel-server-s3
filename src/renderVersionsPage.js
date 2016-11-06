import config from './config'

function renderTableRow (version, baseurl) {
  const urls = {
    darwin_x64: `${baseurl}/download/darwin_x64/${version}`,
    win32_x64: `${baseurl}/download/win32_x64/${version}`,
  }

  return `
<tr>
  <td>${version}</td>
  <td><a href="${urls.darwin_x64}">macOS</a></td>
  <td><a href="${urls.win32_x64}">Windows</a></td>
</tr>
`
}


export default function renderVersionsPage (versions = [], baseurl = '') {
  const urls = {
    darwin_x64: `${baseurl}/download/darwin_x64`,
    win32_x64: `${baseurl}/download/win32_x64`,
  }

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
      <p>
        Use these links to download the most recent version:
      </p>
      <p>
        <strong>macOS</strong><br />
        <a href="${urls.darwin_x64}">${urls.darwin_x64}</a>
      </p>
      <p>
        <strong>Windows</strong><br />
        <a href="${urls.win32_x64}">${urls.win32_x64}</a>
      </p>
      <h2>All Releases</h2>
      <table class="table table-striped table-hover">
        <tbody>
          ${versions.map(x => renderTableRow(x, baseurl)).join('')}
        </tbody>
      </table>
    </div>
  </body>
</html>
`
}
