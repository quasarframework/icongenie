const defaultImg = './logo-source.png'
const { validatePng } = require('./utils')

module.exports = function() {
  console.log('PROJECT REPO: https://github.com/quasarframework/app-extension-icon-factory\n')
  return [
    {
      name: 'source_dev',
      type: 'input',
      required: true,
      message: `Please type a relative path to the file you want to use as your source image.
Best results with a 1240x1240 png (using transparency): `,
      default: defaultImg,
      validate: validatePng
    },
    {
      name: 'minify_dev',
      type: 'list',
      message: 'Minify strategy to be used during development:',
      choices: [
        {
          name: 'pngquant (rate: 0.225 | quality: lossy | time: 01.4s)',
          value: 'pngquant'
        },
        {
          name: 'pngout (rate: 0.94 | quality: lossless | time: 10.7s)',
          value: 'pngout'
        },
        {
          name: 'optipng (rate: 0.61 | quality: lossless | time: 13.9s)',
          value: 'optipng'
        },
        {
          name: 'pngcrush (rate: 0.61 | quality: lossless | time: 28.1s)',
          value: 'pngcrush'
        },
        {
          name: 'zopfli (rate: 0.57 | quality: lossless | time: 33.2s)',
          value: 'zopfli'
        }
      ],
      default: 'pngquant'
    },
    {
      name: 'source_build',
      type: 'input',
      required: true,
      message:
        'If you want a separate file to be the source image during production, please specify it here: ',
      validate: validatePng,
      default: function(answers) {
        return answers.source_dev || defaultImg
      }
    },
    {
      name: 'minify_build',
      type: 'list',
      message: 'Minify strategy to be used during building for production:',
      choices: [
        {
          name: 'pngquant (rate: 0.225 | quality: lossy | time: 01.4s)',
          value: 'pngquant'
        },
        {
          name: 'pngout (rate: 0.94 | quality: lossless | time: 10.7s)',
          value: 'pngout'
        },
        {
          name: 'optipng (rate: 0.61 | quality: lossless | time: 13.9s)',
          value: 'optipng'
        },
        {
          name: 'pngcrush (rate: 0.61 | quality: lossless | time: 28.1s)',
          value: 'pngcrush'
        },
        {
          name: 'zopfli (rate: 0.57 | quality: lossless | time: 33.2s)',
          value: 'zopfli'
        }
      ],
      default: 'optipng'
    }
  ]
}
