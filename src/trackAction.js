import {
  getStats,
  putStats,
} from './stats'

export function recordAction (data, action, version) {
  data[version] = data[version] || {}

  if (data[version][action]) {
    data[version][action]++
  } else {
    data[version][action] = 1
  }

  return data
}

export default function trackAction (action, version) {
  return getStats()
    .then(data => putStats(
      recordAction(JSON.parse(data), action, version)
    ))
}
