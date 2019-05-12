const { exists, createConfig } = require('./utils')

module.exports = async function (api) {
  // check if the files exist, if they do DO NOT create them
  let icon = await exists(api.resolve.app('app-icon.png'))
  let splashscreen = await exists(api.resolve.app('app-splashscreen.png'))
  if (icon === false) {
    console.log('Creating demo icon.')
    api.render('./templates/icon')
  }
  if (splashscreen === false) {
    console.log('Creating demo splashscreen.')
    api.render('./templates/splashscreen')
  }
  createConfig(api)

  let log = ''
  if (api.prompts.confirm_icon === false) {
    log = `
--------------------------------------------------------------------
     Don't forget to replace the icon and splashscreen files!
--------------------------------------------------------------------
`
  }
  log = log + `If you like this app-extension please leave a star at:
https://github.com/quasarframework/app-extension-icon-factory/stargazers

And consider becoming a Patreon Sponsor to support development:
https://patreon.com/quasarframework`

  api.onExitLog(log)
}
