const { validateHexRGB } = require('./utils')

module.exports = function () {
  console.log(`PROJECT Repo and documentation:
https://github.com/quasarframework/app-extension-icon-genie

--------------------------- ATTENTION! -----------------------------

 You must replace app-icon.png in the root folder of your project.
 If you plan on building for Cordova/Capacitor, you must also replace the
 app-splashscreen.png image in the same place. File details:

  -> app-icon.png           1240x1240   (with transparency)
  -> app-splashscreen.png   2436x2436   (transparency optional)
--------------------------------------------------------------------
`)

  return [
    {
      name: 'minify_dev',
      type: 'list',
      message: 'Minify strategy to be used for development:',
      choices: [
        {
          name: 'pngquant    => quality: lossless     |  time: 1x',
          value: 'pngquant'
        },
        {
          name: 'pngcrush  => quality: lossless+    |  time: 10x',
          value: 'pngcrush'
        },
        {
          name: 'optipng   => quality: lossless+   |  time: 4x',
          value: 'optipng'
        },
        {
          name: 'zopfli    => quality: lossless++  |  time: 80x',
          value: 'zopfli'
        }
      ],
      default: 'pngquant'
    },
    {
      name: 'minify_build',
      type: 'list',
      message: 'Minify strategy to be used for production: ',
      choices: [
        {
          name: 'pngquant  => quality: lossy        |  time: 1x',
          value: 'pngquant'
        },
        {
          name: 'pngcrush  => quality: lossless+    |  time: 10x',
          value: 'pngcrush'
        },
        {
          name: 'optipng   => quality: lossless+    |  time: 4x',
          value: 'optipng'
        },
        {
          name: 'zopfli    => quality: lossless++   |  time: 80x',
          value: 'zopfli'
        }
      ],
      default: 'zopfli'
    },
    {
      name: 'cordova.background_color',
      type: 'input',
      required: true,
      message: `Please type a background color to use for Cordova/Capacitor Icons / Splashscreens (no transparency): `,
      default: '#000074',
      validate: validateHexRGB
    },
    /*
    {
      name: 'theme_color',
      type: 'input',
      required: true,
      message: `Please enter a highlight color to use for Duochrome SVGs (no transparency): `,
      default: '#02aa9b',
      validate: validateHexRGB
    },
    */
    {
      name: 'cordova.splashscreen_type',
      type: 'list',
      message: 'Build strategy for Cordova/Capacitor Splashscreen:',
      choices: [
        {
          name: 'Use app-splashscreen.png as-is',
          value: 'pure'
        },
        {
          name: 'Generate with background color and icon',
          value: 'generate'
        },
        {
          name: 'Overlay app-icon.png centered on top of app-splashscreen.png',
          value: 'overlay'
        }
      ],
      default: 'pure'
    },
    {
      name: 'build_always',
      type: 'confirm',
      required: true,
      message: 'Always rebuild (useful for fine-tuning):',
      default: false
    }
  ]
}
