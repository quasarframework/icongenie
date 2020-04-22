const iosIconRegex = /icon-(\d+\.?\d?)@?(\d+)?x?/

function getAndroidIcon (entry) {
  return {
    generator: 'png',
    name: entry[0],
    folder: 'src-cordova/res/android',
    sizes: [ entry[1] ],
    platform: 'cordova-android',
    density: entry[0]
  }
}

function getAndroidSplashscreens (entries) {
  const list = []

  entries.forEach(entry => {
    list.push({
      generator: 'splashscreen',
      name: `splash-land-${entry[0]}`,
      folder: 'src-cordova/res/screen/android',
      sizes: [
        [ entry[1], entry[2] ]
      ],
      platform: 'cordova-android',
      density: `land-${entry[0]}`
    })

    list.push({
      generator: 'splashscreen',
      name: `splash-port-${entry[0]}`,
      folder: 'src-cordova/res/screen/android',
      sizes: [
        [ entry[2], entry[1] ]
      ],
      platform: 'cordova-android',
      density: `port-${entry[0]}`
    })
  })

  return list
}

function getIosIcon (name) {
  const [,size,multiplier] = name.match(iosIconRegex)

  return {
    generator: 'png',
    name,
    folder: 'src-cordova/res/ios',
    sizes: [
      multiplier
        ? parseFloat(size) * parseInt(multiplier,10)
        : parseFloat(size)
    ],
    platform: 'cordova-ios',
    background: true
  }
}

function getIosSplashscreen (entry) {
  return {
    generator: 'splashscreen',
    name: entry[0],
    folder: 'src-cordova/res/screen/ios',
    sizes: [
      [ entry[1], entry[2] ]
    ],
    platform: 'cordova-ios'
  }
}

module.exports = [
  /***************
   *** Android ***
   ***************/

  ...[
    [ 'ldpi', 36 ],
    [ 'mdpi', 48 ],
    [ 'hdpi', 72 ],
    [ 'xhdpi', 96 ],
    [ 'xxhdpi', 144 ],
    [ 'xxxhdpi', 192 ],
  ].map(getAndroidIcon),

  ...getAndroidSplashscreens([
    [ 'ldpi', 320, 200 ],
    [ 'mdpi', 480, 320 ],
    [ 'hdpi', 800, 480 ],
    [ 'xhdpi', 1280, 720 ],
    [ 'xxhdpi', 1600, 960 ],
    [ 'xxxhdpi', 1920, 1280 ]
  ]),

  /**************
   **** iOS *****
   **************/

  {
    generator: 'png',
    name: 'icon',
    folder: 'src-cordova/res/ios',
    sizes: [ 57 ],
    platform: 'cordova-ios',
    background: true
  },
  {
    generator: 'png',
    name: 'icon@2x',
    folder: 'src-cordova/res/ios',
    sizes: [ 114 ],
    platform: 'cordova-ios',
    background: true
  },

  ...[
    'icon-20@2x',
    'icon-20@3x',
    'icon-29',
    'icon-29@2x',
    'icon-29@3x',
    'icon-40@2x',
    'icon-60@2x',
    'icon-60@3x',
    'icon-20',
    'icon-20@2x',
    'icon-40',
    'icon-50',
    'icon-50@2x',
    'icon-72',
    'icon-72@2x',
    'icon-76',
    'icon-76@2x',
    'icon-83.5@2x',
    'icon-1024',
    'icon-24@2x',
    'icon-27.5@2x',
    'icon-29@2x',
    'icon-29@3x',
    'icon-40@2x',
    'icon-44@2x',
    'icon-50@2x',
    'icon-86@2x',
    'icon-98@2x'
  ].map(getIosIcon),

  ...[
    [ 'Default@2x~iphone~anyany', 1334, 1334 ],
    [ 'Default@2x~iphone~comany', 750, 1334 ],
    [ 'Default@2x~iphone~comcom', 1334, 750 ],
    [ 'Default@3x~iphone~anyany', 2208, 2208 ],
    [ 'Default@3x~iphone~anycom', 2208, 1242 ],
    [ 'Default@3x~iphone~comany', 1242, 2208 ],
    [ 'Default@2x~ipad~anyany', 2732, 2732 ],
    [ 'Default@2x~ipad~comany', 1278, 2732 ]
  ].map(getIosSplashscreen)
]
