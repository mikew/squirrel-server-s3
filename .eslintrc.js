const config = require('eslint-config-sst')

module.exports = {
  env: {
    es6: true,
    node: true,
    mocha: true,
  },
  extends: 'sst',
  parserOptions: {
    sourceType: 'module',
  },
  rules: {
    'no-process-env': 'off',
    'no-magic-numbers': ['warn', {
      ignore: config.rules['no-magic-numbers'][1].ignore.concat([
        200,
        204,
        301,
        302,
        400,
        403,
        404,
        500,
      ])
    }],
  }
}
