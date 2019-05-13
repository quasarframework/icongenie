const { existsSync } = require('fs')

const banner = `If you like this app-extension please leave a star at:
https://github.com/quasarframework/app-extension-icon-factory/stargazers

And consider becoming a Patreon Sponsor to support development:
https://patreon.com/quasarframework`

module.exports = function (api) {
  if (!existsSync(api.resolve.app('app-icon.png'))) {
    console.log('Creating demo icon.')
    api.render('./templates/icon')
  }

  if (!existsSync(api.resolve.app('app-splashscreen.png'))) {
    console.log('Creating demo splashscreen.')
    api.render('./templates/splashscreen')
  }

  api.setPersistentConf({
    dev: {},
    build: {}
  })

  api.onExitLog(banner)
}
