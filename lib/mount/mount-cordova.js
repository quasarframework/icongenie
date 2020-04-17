const { readFileSync, writeFileSync, existsSync } = require('fs')
const elementTree = require('elementtree')
const { relative } = require('path')

const { resolveDir } = require('../utils/app-paths')
const { log } = require('../utils/logger')

const platformList = [ 'cordova-android', 'cordova-ios' ]
const handlerList = [ 'png', 'splashscreen' ]

function getNode (root, tag, selector) {
  return (
    root.find(`${tag}${selector}`) ||
    elementTree.SubElement(root, tag)
  )
}

function getCordovaFiles (files) {
  const cordovaFiles = []

  files.forEach(file => {
    if (
      platformList.includes(file.platform) &&
      handlerList.includes(file.handler)
    ) {
      cordovaFiles.push(file)
    }
  })

  return cordovaFiles
}

function updateConfigXml (cordovaConfigXml, cordovaFiles) {
  const srcCordovaDir = resolveDir('src-cordova')
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
          : `[@width="${file.resolution[0]}"][@height="${file.resolution[1]}"]`
      )

      entry.set('src', src)

      if (isAndroid) {
        entry.set('density', file.density)
      }
      else {
        entry.set('width', file.resolution[0])
        entry.set('height', file.resolution[1])
      }
    }
  })

  writeFileSync(cordovaConfigXml, doc.write({ indent: 4 }), 'utf-8')
  log(`Updated src-cordova/config.xml`)
}

module.exports = function mountCordova (files) {
  const cordovaConfigXml = resolveDir('src-cordova/config.xml')

  if (existsSync(cordovaConfigXml)) {
    const cordovaFiles = getCordovaFiles(files)

    if (cordovaFiles.length > 0) {
      updateConfigXml(cordovaConfigXml, cordovaFiles)
    }
  }
}
