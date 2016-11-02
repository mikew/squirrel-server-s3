import transformReleasesFile from '../src/transformReleasesFile'

describe('transformReleasesFile', () => {
  it('substitutes the URL part', () => {
    const result = transformReleasesFile('57DA0C4B6540AE2F0E39C97A6DDF322E2DEFD5FD dronefuse-client-0.9.0-full.nupkg 65891422\n57DA0C4B6540AE2F0E39C97A6DDF322E2DEFD5FD https://example-app.s3-accelerated.amazonaws.com/0.9.0/example-app-v0.9.0-win32_x64-full.nupkg 65891422')
    console.log(result)
  })
})
