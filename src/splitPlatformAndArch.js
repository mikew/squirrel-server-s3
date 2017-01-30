export default function splitPlatformAndArch (platform) {
  const parts = platform.split('_')
  const arch = parts.pop()

  return [ parts.join('_'), arch ]
}
