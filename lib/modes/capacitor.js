const iosIconRegex = /AppIcon-(\d+\.?\d?)x?(\d+\.?\d?)?@?(\d+)?x?-?\d?/

function getAndroidIcons (entries) {
  const list = []

  entries.forEach(entry => {
    const icon = {
      generator: 'png',
      folder: `src-capacitor/android/app/src/main/res/mipmap-${entry[0]}`
    }

    list.push({
      ...icon,
      name: 'ic_launcher_foreground',
      sizes: [ entry[2] ]
    })

    list.push({
      ...icon,
      name: 'ic_launcher_round',
      sizes: [ entry[1] ]
    })

    list.push({
      ...icon,
      name: 'ic_launcher',
      sizes: [ entry[1] ]
    })
  })

  return list
}

function getAndroidSplashscreen (entries) {
  const list = []

  entries.forEach(entry => {
    const icon = {
      generator: 'splashscreen',
      name: 'splash'
    }

    list.push({
      ...icon,
      folder: `src-capacitor/android/app/src/main/res/drawable-land-${entry[0]}`,
      sizes: [
        [ entry[1], entry[2] ]
      ]
    })

    list.push({
      ...icon,
      folder: `src-capacitor/android/app/src/main/res/drawable-port-${entry[0]}`,
      sizes: [
        [ entry[2], entry[1] ]
      ]
    })
  })

  return list
}

function getIosIcon (name) {
  const [,size,,multiplier] = name.match(iosIconRegex)

  return {
    generator: 'png',
    name,
    folder: 'src-capacitor/ios/App/App/Assets.xcassets/AppIcon.appiconset',
    sizes: [
      multiplier
        ? parseFloat(size) * parseInt(multiplier,10)
        : parseFloat(size)
    ],
    background: true
  }
}

module.exports = [
  /***************
   *** Android ***
   ***************/

  ...getAndroidIcons([
    [ 'hdpi', 49, 162 ],
    [ 'mdpi', 48, 108 ],
    [ 'xhdpi', 96, 216 ],
    [ 'xxhdpi', 144, 324 ],
    [ 'xxxhdpi', 192, 432 ]
  ]),

  {
    generator: 'splashscreen',
    name: 'splash',
    folder: 'src-capacitor/android/app/src/main/res/drawable',
    sizes: [
      [ 480, 320 ]
    ]
  },

  ...getAndroidSplashscreen([
    [ 'mdpi', 480, 320 ],
    [ 'hdpi', 800, 480 ],
    [ 'xhdpi', 1280, 720 ],
    [ 'xxhdpi', 1600, 960 ],
    [ 'xxxhdpi', 1920, 1280 ]
  ]),

  /**************
   **** iOS *****
   **************/

  ...[
    'AppIcon-20x20@1x',
    'AppIcon-20x20@2x-1',
    'AppIcon-20x20@2x',
    'AppIcon-20x20@3x',
    'AppIcon-29x29@1x',
    'AppIcon-29x29@2x-1',
    'AppIcon-29x29@2x',
    'AppIcon-29x29@3x',
    'AppIcon-40x40@1x',
    'AppIcon-40x40@2x-1',
    'AppIcon-40x40@2x',
    'AppIcon-40x40@3x',
    'AppIcon-60x60@2x',
    'AppIcon-60x60@3x',
    'AppIcon-76x76@1x',
    'AppIcon-76x76@2x',
    'AppIcon-83.5x83.5@2x',
    'AppIcon-512@2x'
  ].map(getIosIcon),

  {
    generator: 'splashscreen',
    name: 'splash-2732x2732-1',
    folder: 'src-capacitor/ios/App/App/Assets.xcassets/Splash.imageset',
    sizes: [ 2732 ]
  },

  {
    generator: 'splashscreen',
    name: 'splash-2732x2732-2',
    folder: 'src-capacitor/ios/App/App/Assets.xcassets/Splash.imageset',
    sizes: [ 2732 ]
  },

  {
    generator: 'splashscreen',
    name: 'splash-2732x2732',
    folder: 'src-capacitor/ios/App/App/Assets.xcassets/Splash.imageset',
    sizes: [ 2732 ]
  }
]
