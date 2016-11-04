# squirrel-server-s3

A Squirrel update server using S3 as a storage backend.

## Usage

### Running the server

```bash
docker run --rm \
  --env AWS_ACCESS_KEY_ID=1234 \
  --env AWS_SECRET_ACCESS_KEY=5678 \
  --env BUCKET=my-app-releases \
  --env APP_NAME="My App" \
  mikewhy/squirrel-server-s3
```

It expects your bucket to follow a certain structure:

```
/RELEASES
/1.0.0/My App-1.0.0.dmg
/1.0.0/My App-1.0.0-mac.zip
/1.0.0/My App Setup 1.0.0.exe
/1.0.0/my-app-1.0.0-full.nupkg
/1.0.0/My App-1.0.0-linux_x64.zip
```

### Usage in Electron

```js
import os from 'os'
import {
  autoUpdate,
} from 'electron'

autoUpdate.setFeedURL(`https://my-app-releases.example.com/update/${os.platform()}_${os.arch()}/${app.getVersion()}`)
autoUpdater.checkForUpdates()
```

### Endpoints

- `/`

	List of all releases.

- `/download/:platform/:version`

	Download a specific version for a platform.
- `/download/:platform`

	Download the most recent version for a platform.
- `/RELEASES`

	Used with `remoteReleases` option in `electron-builder`.

	Or combine it with a newly generated `RELEASES` file.
- `/update/:platform/:version`

	Checks for an update. Returns `204` if no update needed, otherwise an object with a `url` property
- `/update/:platform/:version/RELEASES`

	Acts the same as `/RELEASES`, supported so apps don't have to change their feed url on Windows.
