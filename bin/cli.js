#!/usr/bin/env node
'use strict'

const fs = require('fs')
const info = require('../package.json')
const args = require('minimist')(process.argv.slice(2), {
  alias: {
    h: 'help',
    p: 'preset',
    s: 'source',
    t: 'target',
    m: 'minify',
    d: 'mode',
    o: 'options',
    v: 'version'
  },
  default: {
    dir: process.cwd()
  }
})

if (args.version) {
  console.log('Quasar Icon Factory: v.' + info.version)
  console.log('     License: MIT')
  process.exit(0)
}

if (args.help) {
  console.log('Quasar Icon Factory: v.' + info.version)
  console.log('     License: MIT')
  console.log(`
The Icon Factory is a node utility to create a batch of icons for your app. 
Designed to work seamlessly with the Quasar Framework, but probably
useful for other build pipelines.
    
Flags:    
  -p, --preset      Choose a preset output or make your own
                    [minify|splash|svg|svgduochrome|favicon]
                    [spa|pwa|cordova|electron|kitchensink|custom]
  -s, --source      Your source image as a large square png
  -t, --target      The destination directory for the files created
  -o, --options     path to file that overrides defaults (if custom)
  -m, --minify      Minify strategy to use. 
                    [pngcrush|pngquant|optipng|pngout|zopfli|advpng]
  -d, --mode        Minify mode if minify preset [folder|singlefile]
  -v, --version     display version information
  -h, --help        display this information
  
Usage:
    
$ iconfactory -p=kitchensink -s=icon-1280x1280.png -t=./outputFolder -m=pngquant  
$ iconfactory -p=minify -s=icon-1240x1240.png -t=./output -m=pngquant -d=singlefile  
    `)
  process.exit(0)
}

if (!args.preset) {
  console.log('Icon Factory: v.' + info.version)
  console.log('You must choose a preset or declare custom.')
  console.log(
    '  -p, --preset      [minify|splash|svg|svgduochrome|favicon]\n' +
      '                    [kitchensink|spa|pwa|cordova|electron|custom]\n'
  )
  process.exit(0)
}

if (!args.source) {
  console.log('Icon Factory: v.' + info.version)
  console.log('You must provide a source file.')
  console.log('  -s, --source      Your source image as a large square png\n')
  process.exit(0)
}

if (!fs.existsSync(args.source)) {
  console.log('Icon Factory: v.' + info.version)
  console.log('That is not a file, provide a source image.')
  console.log('  -s, --source      Your source image as a large square png\n')
  process.exit(0)
}

if (!args.target) {
  console.log('Icon Factory: v.' + info.version)
  console.log('You must provide a target folder.')
  console.log('  -t, --target      The destination directory for the files created\n')
  process.exit(0)
}

if (args.preset === 'custom' && !args.options) {
  console.log('Icon Factory: v.' + info.version)
  console.log('You must add a file that has the options if you use custom preset')
  console.log('  -o, --options     path to file that overrides defaults (if custom)\n')
  process.exit(0)
}

const iconfactory = require('../lib/index.js')

switch (args.preset) {
  case 'minify':
    iconfactory.minify(args.source, false, args.minify, args.mode)
    break
  case 'splash':
    iconfactory.splash(args.source, false, args.minify, args.mode)
    break
  case 'svg':
    iconfactory.svg(args.source, args.target)
    break
  case 'svgduochrome':
    iconfactory.svgDuochrome(args.source, args.target)
    break
  case 'favicon':
    iconfactory.favicon(args.source, args.target)
    break
  case 'kitchensink':
    iconfactory.kitchensink(args.source, args.target, args.minify)
    break
  case 'spa':
    iconfactory.spa(args.source, args.target, args.minify)
    break
  case 'pwa':
    iconfactory.pwa(args.source, args.target, args.minify)
    break
  case 'cordova':
    iconfactory.cordova(args.source, args.target, args.minify)
    break
  case 'electron':
    iconfactory.electron(args.source, args.target, args.minify)
    break
  case 'custom':
    iconfactory.custom(args.source, args.target, args.options)
    break
  default:
    console.log('You must supply a preset')
    break
}
