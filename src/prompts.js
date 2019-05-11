const { validateHexRGB } = require('./utils')

module.exports = function() {
  console.log(`PROJECT Repo and documentation:
https://github.com/quasarframework/app-extension-icon-factory

--------------------------- ATTENTION! -----------------------------

 You must replace app-icon.png in the root folder of your project.
 If you plan on building for Cordova, you must also replace the    
 app-splashscreen.png image in the same place. File details:
 
  -> app-icon.png           1240x1240   (with transparency)
  -> app-splashscreen.png   2436x2436   (transparency optional)
--------------------------------------------------------------------
`)

  return [
    {
      name: 'confirm_icon',
      type: 'confirm',
      required: true,
      message: 'Have you replaced the app assets?',
      default: false,
    },
    {
      name: 'minify_dev',
      type: 'list',
      message: 'Minify strategy to be used for development:',
      choices: [
        {
          name: 'pngout    => quality: lossless     |  time: 1x',
          value: 'pngout'
        },
        {
          name: 'pngquant  => quality: lossy        |  time: 2x',
          value: 'pngquant'
        },
        {
          name: 'pngcrush  => quality: lossless+    |  time: 10x',
          value: 'pngcrush'
        },
        {
          name: 'optipng   => quality: lossless++   |  time: 4x',
          value: 'optipng'
        },
        {
          name: 'zopfli    => quality: lossless+++  |  time: 80x',
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
          name: 'pngquant  => quality: lossy        |  time: -',
          value: 'pngquant'
        },
        {
          name: 'pngout    => quality: lossless     |  time: +',
          value: 'pngout'
        },
        {
          name: 'pngcrush  => quality: lossless+    |  time: ++',
          value: 'pngcrush'
        },
        {
          name: 'optipng   => quality: lossless++   |  time: +',
          value: 'optipng'
        },
        {
          name: 'zopfli    => quality: lossless+++  |  time: ++++',
          value: 'zopfli'
        }
      ],
      default: 'zopfli'
    },
    {
      name: 'background_color',
      type: 'input',
      required: true,
      message: `Please type a background color to use for Cordova Icons / Splashscreens (no transparency): `,
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
      name: 'splashscreen_type',
      type: 'list',
      message: 'Build strategy for Cordova Splashscreen:',
      choices: [
        {
          name: 'Generate with background color and icon',
          value: 'generate'
        },
        {
          name: 'Overlay app-icon.png centered on top of app-splashscreen.png',
          value: 'overlay'
        },
        {
          name: 'Only use app-splashscreen.png',
          value: 'pure'
        }
      ],
      default: 'generate'
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
