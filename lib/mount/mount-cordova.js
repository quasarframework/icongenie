const { readFileSync, writeFileSync, existsSync } = require('fs')
const elementTree = require('elementtree')
const { relative } = require('path')
const { red, green } = require('chalk')

const { resolveDir } = require('../utils/app-paths')
const { log } = require('../utils/logger')

const cordovaConfigXml = resolveDir('src-cordova/config.xml')
const srcCordovaDir = resolveDir('src-cordova')

const platformList = [ 'cordova-android', 'cordova-ios' ]
const handlerList = [ 'png', 'splashscreen' ]

function getNode (root, tag, selector) {
  return (
    root.find(`${tag}${selector}`) ||
    elementTree.SubElement(root, tag)
  )
}

function hasNode (root, tag, selector) {
  return root.find(`${tag}${selector}`)
}

function isCordovaFile (file) {
  return platformList.includes(file.platform) &&
    handlerList.includes(file.handler)
}

function getCordovaFiles (files) {
  const cordovaFiles = []

  files.forEach(file => {
    if (isCordovaFile(file)) {
      cordovaFiles.push(file)
    }
  })

  return cordovaFiles
}

function updateConfigXml (cordovaFiles) {
  const doc = elementTree.parse(readFileSync(cordovaConfigXml, 'utf-8'))
  const rootNode = doc.getroot()

  const androidNode = getNode(rootNode, 'platform', '[@name="android"]')
  const iosNode = getNode(rootNode, 'platform', '[@name="ios"]')

  cordovaFiles.forEach(file => {
    const isAndroid = file.platform === 'cordova-android'
    const node = isAndroid ? androidNode : iosNode
    const src = relative(srcCordovaDir, file.absoluteName)

    if (file.handler === 'splashscreen') {
      // <splash src="res/screen/android/splash-land-hdpi.png" density="land-hdpi"/>
      // <splash src="res/screen/ios/Default@2x~ipad~comany.png" />

      const entry = getNode(
        node,
        'splash',
        isAndroid ? `[@density="${file.density}"]` : `[@src="${src}"]`
      )

      entry.set('src', src)

      if (isAndroid) {
        entry.set('density', file.density)
      }
    }
    else if (file.handler === 'png') {
      // <icon src="res/android/ldpi.png" density="ldpi" />
      // <icon src="res/ios/icon-60@3x.png" width="180" height="180" />

      const entry = getNode(
        node,
        'icon',
        isAndroid
          ? `[@density="${file.density}"]`
          : `[@width="${file.width}"][@height="${file.height}"]`
      )

      entry.set('src', src)

      if (isAndroid) {
        entry.set('density', file.density)
      }
      else {
        entry.set('width', file.width)
        entry.set('height', file.height)
      }
    }
  })

  writeFileSync(cordovaConfigXml, doc.write({ indent: 4 }), 'utf-8')
  log(`Updated src-cordova/config.xml`)
}

module.exports.mountCordova = function mountCordova (files) {
  if (existsSync(cordovaConfigXml)) {
    const cordovaFiles = getCordovaFiles(files)

    if (cordovaFiles.length > 0) {
      updateConfigXml(cordovaFiles)
    }
  }
}

module.exports.isCordovaFile = isCordovaFile

module.exports.verifyCordova = function verifyCordova (file) {
  if (isCordovaFile(file) && existsSync(cordovaConfigXml)) {
    const doc = elementTree.parse(readFileSync(cordovaConfigXml, 'utf-8'))
    const isAndroid = file.platform === 'cordova-android'

    const node = doc.getroot()
      .find(`platform[@name="${isAndroid ? 'android' : 'ios'}"]`)

    // verify that the platform is installed
    if (!node) {
      return red('ERROR: platform not installed!')
    }

    const src = relative(srcCordovaDir, file.absoluteName)

    if (file.handler === 'splashscreen') {
      const selector = isAndroid
        ? `[@density="${file.density}"]`
        : `[@src="${src}"]`

      if (!hasNode(node, 'splash', selector)) {
        return red('ERROR: no entry for it in src-cordova/config.xml')
      }
    }
    else {
      const selector = isAndroid
        ? `[@density="${file.density}"]`
        : `[@width="${file.width}"][@height="${file.height}"]`

      if (!hasNode(node, 'icon', selector)) {
        return red('ERROR: no entry for it in src-cordova/config.xml')
      }
    }

    return green('mounted')
  }
}
