import config from './config'

function renderTableRow (version, baseurl) {
  const urls = {
    darwin_x64: `${baseurl}/download/darwin_x64/${version}`,
    win32_ia32: `${baseurl}/download/win32_ia32/${version}`,
    win32_x64: `${baseurl}/download/win32_x64/${version}`,
    linux_ia32: `${baseurl}/download/linux_ia32/${version}`,
    linux_x64: `${baseurl}/download/linux_x64/${version}`,
  }

  return `
<tr>
  <td>${version}</td>
  <td>
    <a href="${urls.linux_x64}" class="btn btn-primary">64-Bit</a>
    <a href="${urls.linux_ia32}" class="btn btn-link">32-Bit</a>
  </td>
  <td><a href="${urls.darwin_x64}" class="btn btn-primary">64-Bit</a></td>
  <td>
    <a href="${urls.win32_x64}" class="btn btn-primary">64-Bit</a>
    <a href="${urls.win32_ia32}" class="btn btn-link">32-Bit</a>
  </td>
</tr>
`
}


export default function renderVersionsPage (versions = [], baseurl = '') {
  const urls = {
    darwin_x64: `${baseurl}/download/darwin_x64`,
    win32_ia32: `${baseurl}/download/win32_ia32`,
    win32_x64: `${baseurl}/download/win32_x64`,
    linux_ia32: `${baseurl}/download/linux_ia32`,
    linux_x64: `${baseurl}/download/linux_x64`,
  }

  return `
<!DOCTYPE html>

<html>
  <head>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css" />
    <style>
    th, td {
      text-align: center;
      vertical-align: middle !important;
    }
    </style>
  </head>
  <body>
    <div class="container">
      <h1>${config.APP_NAME} Releases</h1>

      <p>
        Use these links to download the most recent version:
      </p>

      <div class="well well-sm">
        <div class="container-fluid">
          <div class="row">
            <div class="col-sm-4">
              <h4>Linux</h4>
              <a href="${urls.linux_x64}">${urls.linux_x64}</a>
              <br/>
              <a href="${urls.linux_ia32}">${urls.linux_ia32}</a>
            </div>
            <div class="col-sm-4">
              <h4>macOS</h4>
              <a href="${urls.darwin_x64}">${urls.darwin_x64}</a>
            </div>
            <div class="col-sm-4">
              <h4>Windows</h4>
              <a href="${urls.win32_x64}">${urls.win32_x64}</a>
              <br/>
              <a href="${urls.win32_ia32}">${urls.win32_ia32}</a>
            </div>
          </div>
        </div>
      </div>

      <h2>All Releases</h2>
      <table class="table table-striped table-hover">
        <thead>
          <tr>
            <th></th>
            <th>Linux</th>
            <th>macOS</th>
            <th>Windows</th>
          </tr>
        </thead>
        <tbody>
          ${versions.map(x => renderTableRow(x, baseurl)).join('')}
        </tbody>
      </table>
    </div>
  </body>
</html>
`
}
