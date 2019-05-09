exports.options = {
  // folder determines in which path to drop the generated file
  // prefix is the first part of the generated file's name
  // infix adds e.g. '44x44' based on the size in sizes to the generated file's name
  // suffix adds a file-ending to the generated file's name
  // sizes determines the pixel width and height to use
  background_color: '#000074',
  theme_color: '#02aa9b',
  sharp: 'kernel: sharp.kernel.lanczos3', // one of [nearest|cubic|lanczos2|lanczos3]
  minify: {
    batch: false,
    overwrite: true,
    available: ['pngcrush', 'pngquant', 'optipng', 'pngout', 'zopfli'],
    type: 'pngout',
    pngcrushOptions: {
      reduce: true
    },
    pngquantOptions: {
      quality: [0.6, 0.8],
      floyd: 0.1, // 0.1 - 1
      speed: 10 // 1 - 10
    },
    optipngOptions: {
      optimizationLevel: 4,
      bitDepthReduction: true,
      colorTypeReduction: true,
      paletteReduction: true
    },
    pngoutOptions: {
      strategy: 0 // 0. Extreme 1. Intense 2. Longest match 3. Huffman only 4. Uncompressed
    },
    zopfliOptions: {
      transparent: true,
      more: true
    }
  },
  svg: {
    //
    png_threshold: 200,
    svg_threshold: 255,
    turdSize: 255,
    optTolerance: 255
  },
  // below this line are all of the icon settings
  spa: {
    favicon: {
      folder: 'icons',
      prefix: 'favicon-',
      infix: true,
      suffix: '.png',
      sizes: [ 16, 32, 96 ]
    },
    icons: {
      folder: 'icons',
      prefix: 'icon-',
      infix: true,
      suffix: '.png',
      sizes: [
        128,
        192,
        256,
        384,
        512
      ]
    },
    quasar: {
      folder: '.',
      prefix: 'app-logo-',
      infix: true,
      suffix: '.png',
      sizes: [
        128
      ]
    },
    appleIcons: {
      folder: 'icons',
      prefix: 'apple-icon-',
      infix: true,
      suffix: '.png',
      sizes: [
        120, 152, 167, 180
      ]
    },
    windows: {
      folder: 'icons',
      prefix: 'ms-icon-',
      infix: true,
      suffix: '.png',
      sizes: [
        144
      ]
    }
  },
  pwa: {
    favicon: {
      folder: 'icons',
      prefix: 'favicon-',
      infix: true,
      suffix: '.png',
      sizes: [
        16, 32, 96
      ]
    },
    icons: {
      folder: 'icons',
      prefix: 'icon-',
      infix: true,
      suffix: '.png',
      sizes: [
        128,
        192,
        256,
        384,
        512
      ]
    },
    quasar: {
      folder: '.',
      prefix: 'app-logo-',
      infix: true,
      suffix: '.png',
      sizes: [
        128
      ]
    },
    appleIcons: {
      folder: 'icons',
      prefix: 'apple-icon-',
      infix: true,
      suffix: '.png',
      sizes: [
        120, 152, 167, 180
      ]
    },
    windows: {
      folder: 'icons',
      prefix: 'ms-icon-',
      infix: true,
      suffix: '.png',
      sizes: [
        144
      ]
    }
  },
  cordova: {
    android_icon_ldpi: {
      platform: 'android',
      density: 'ldpi',
      background: false,
      folder: 'icon/android',
      prefix: 'icon-36-ldpi',
      infix: false,
      suffix: '.png',
      sizes: [
        36
      ]
    },
    android_icon_mdpi: {
      platform: 'android',
      density: 'mdpi',
      background: false,
      folder: 'icon/android',
      prefix: 'icon-48-mdpi',
      infix: false,
      suffix: '.png',
      sizes: [
        48
      ]
    },
    android_icon_hdpi: {
      platform: 'android',
      density: 'hppi',
      background: false,
      folder: 'icon/android',
      prefix: 'icon-72-hdpi',
      infix: false,
      suffix: '.png',
      sizes: [
        72
      ]
    },
    android_icon_xhdpi: {
      platform: 'android',
      density: 'xhdpi',
      background: false,
      folder: 'icon/android',
      prefix: 'icon-96-xhdpi',
      infix: false,
      suffix: '.png',
      sizes: [
        96
      ]
    },
    android_icon_xxhdpi: {
      platform: 'android',
      density: 'xxhdpi',
      background: false,
      folder: 'icon/android',
      prefix: 'icon-144-xxhdpi',
      infix: false,
      suffix: '.png',
      sizes: [
        144
      ]
    },
    android_icon_xxxhdpi: {
      platform: 'android',
      density: 'xxxhdpi',
      background: false,
      folder: 'icon/android',
      prefix: 'icon-192-xxxhdpi',
      infix: false,
      suffix: '.png',
      sizes: [
        192
      ]
    },
    ios_icon_57: {
      platform: 'ios',
      background: true,
      folder: 'icon/ios',
      prefix: 'icon',
      infix: false,
      suffix: '.png',
      sizes: [
        57
      ]
    },
    ios_icon_57_x2: {
      platform: 'ios',
      background: true,
      folder: 'icon/ios',
      prefix: 'icon-2x',
      infix: false,
      suffix: '.png',
      sizes: [
        114
      ]
    },
    ios_icon_40: {
      platform: 'ios',
      background: true,
      folder: 'icon/ios',
      prefix: 'icon-40',
      infix: false,
      suffix: '.png',
      sizes: [
        40
      ]
    },
    ios_icon_40_x2: {
      platform: 'ios',
      background: true,
      folder: 'icon/ios',
      prefix: 'icon-40-2x',
      infix: false,
      suffix: '.png',
      sizes: [
        80
      ]
    },
    ios_icon_50: {
      platform: 'ios',
      background: true,
      folder: 'icon/ios',
      prefix: 'icon-50',
      infix: false,
      suffix: '.png',
      sizes: [
        50
      ]
    },
    ios_icon_50_x2: {
      platform: 'ios',
      background: true,
      folder: 'icon/ios',
      prefix: 'icon-50-2x',
      infix: false,
      suffix: '.png',
      sizes: [
        100
      ]
    },
    ios_icon_60: {
      platform: 'ios',
      background: true,
      folder: 'icon/ios',
      prefix: 'icon-60',
      infix: false,
      suffix: '.png',
      sizes: [
        60
      ]
    },
    ios_icon_60_x2: {
      platform: 'ios',
      background: true,
      folder: 'icon/ios',
      prefix: 'icon-60-2x',
      infix: false,
      suffix: '.png',
      sizes: [
        120
      ]
    },
    ios_icon_60_x3: {
      platform: 'ios',
      background: true,
      folder: 'icon/ios',
      prefix: 'icon-60-3x',
      infix: false,
      suffix: '.png',
      sizes: [
        180
      ]
    },
    ios_icon_72: {
      platform: 'ios',
      background: true,
      folder: 'icon/ios',
      prefix: 'icon-72',
      infix: false,
      suffix: '.png',
      sizes: [
        72
      ]
    },
    ios_icon_72_x2: {
      platform: 'ios',
      background: true,
      folder: 'icon/ios',
      prefix: 'icon-72-2x',
      infix: false,
      suffix: '.png',
      sizes: [
        144
      ]
    },
    'ios_icon_83.5_x2': {
      platform: 'ios',
      background: true,
      folder: 'icon/ios',
      prefix: 'icon-83.5-2x',
      infix: false,
      suffix: '.png',
      sizes: [
        167
      ]
    },
    ios_icon_167: {
      platform: 'ios',
      background: true,
      folder: 'icon/ios',
      prefix: 'icon-167',
      infix: false,
      suffix: '.png',
      sizes: [
        167
      ]
    },
    ios_icon_1024: {
      platform: 'ios',
      background: true,
      folder: 'icon/ios',
      prefix: 'icon-1024',
      infix: false,
      suffix: '.png',
      sizes: [
        1024
      ]
    },
    win_icon_48: {
      folder: 'icon/windows-phone',
      prefix: 'icon-48',
      infix: false,
      suffix: '.png',
      sizes: [
        48
      ]
    },
    win_icon_62: {
      folder: 'icon/windows-phone',
      prefix: 'icon-62-tile',
      infix: false,
      suffix: '.png',
      sizes: [
        62
      ]
    },
    win_icon_173: {
      folder: 'icon/windows-phone',
      prefix: 'icon-173-tile',
      infix: false,
      suffix: '.png',
      sizes: [
        173
      ]
    },
    android_screen_ldpi_landscape: {
      platform: 'android',
      splash: true,
      folder: 'screen/android',
      prefix: 'splash-land-ldpi',
      density: 'land-ldpi',
      infix: false,
      suffix: '.png',
      sizes: [
        [
          320,
          200
        ]
      ]
    },
    android_screen_ldpi_portrait: {
      platform: 'android',
      splash: true,
      folder: 'screen/android',
      prefix: 'splash-port-ldpi',
      density: 'port-ldpi',
      infix: false,
      suffix: '.png',
      sizes: [
        [
          200,
          320
        ]
      ]
    },
    android_screen_mdpi_landscape: {
      platform: 'android',
      splash: true,
      folder: 'screen/android',
      prefix: 'splash-land-mdpi',
      density: 'land-mdpi',
      infix: false,
      suffix: '.png',
      sizes: [
        [
          480,
          320
        ]
      ]
    },
    android_screen_mdpi_portrait: {
      platform: 'android',
      splash: true,
      folder: 'screen/android',
      prefix: 'splash-port-mdpi',
      density: 'port-mdpi',
      infix: false,
      suffix: '.png',
      sizes: [
        [
          320,
          480
        ]
      ]
    },
    android_screen_hdpi_landscape: {
      platform: 'android',
      splash: true,
      folder: 'screen/android',
      prefix: 'splash-land-hdpi',
      density: 'land-hdpi',
      infix: false,
      suffix: '.png',
      sizes: [
        [
          800,
          480
        ]
      ]
    },
    android_screen_hdpi_portrait: {
      platform: 'android',
      splash: true,
      folder: 'screen/android',
      prefix: 'splash-port-hdpi',
      density: 'port-hdpi',
      infix: false,
      suffix: '.png',
      sizes: [
        [
          480,
          800
        ]
      ]
    },
    android_screen_xhdpi_landscape: {
      platform: 'android',
      splash: true,
      folder: 'screen/android',
      prefix: 'splash-land-xhdpi',
      density: 'land-xhdpi',
      infix: false,
      suffix: '.png',
      sizes: [
        [
          1280,
          720
        ]
      ]
    },
    android_screen_xhdpi_portrait: {
      platform: 'android',
      splash: true,
      folder: 'screen/android',
      prefix: 'splash-port-xhdpi',
      density: 'port-xhdpi',
      infix: false,
      suffix: '.png',
      sizes: [
        [
          720,
          1280
        ]
      ]
    },
    android_screen_xxhdpi_landscape: {
      platform: 'android',
      splash: true,
      folder: 'screen/android',
      prefix: 'splash-land-xxhdpi',
      density: 'port-xxhdpi',
      infix: false,
      suffix: '.png',
      sizes: [
        [
          1600,
          960
        ]
      ]
    },
    android_screen_xxhdpi_portrait: {
      platform: 'android',
      splash: true,
      folder: 'screen/android',
      prefix: 'splash-port-xxhdpi',
      density: 'land-xxhdpi',
      infix: false,
      suffix: '.png',
      sizes: [
        [
          960,
          1600
        ]
      ]
    },
    android_screen_xxxhdpi_landscape: {
      platform: 'android',
      splash: true,
      folder: 'screen/android',
      prefix: 'splash-land-xxxhdpi',
      density: 'land-xxxhdpi',
      infix: false,
      suffix: '.png',
      sizes: [
        [
          1920,
          1280
        ]
      ]
    },
    android_screen_xxxhdpi_portrait: {
      platform: 'android',
      splash: true,
      folder: 'screen/android',
      prefix: 'splash-port-xxxhdpi',
      density: 'port-xxxhdpi',
      infix: false,
      suffix: '.png',
      sizes: [
        [
          1280,
          1920
        ]
      ]
    },
    ios_screen_ipad_landscape: {
      platform: 'ios',
      splash: true,
      folder: 'screen/ios',
      prefix: 'screen-ipad-landscape',
      infix: false,
      suffix: '.png',
      sizes: [
        [
          1024,
          768
        ]
      ]
    },
    ios_screen_ipad_landscape_x2: {
      platform: 'ios',
      splash: true,
      folder: 'screen/ios',
      prefix: 'screen-ipad-landscape-2x',
      infix: false,
      suffix: '.png',
      sizes: [
        [
          2048,
          1536
        ]
      ]
    },
    ios_screen_ipad_portrait: {
      platform: 'ios',
      splash: true,
      folder: 'screen/ios',
      prefix: 'screen-ipad-portrait',
      infix: false,
      suffix: '.png',
      sizes: [
        [
          768,
          1024
        ]
      ]
    },
    ios_screen_ipad_portrait_x2: {
      platform: 'ios',
      splash: true,
      folder: 'screen/ios',
      prefix: 'screen-ipad-portrait-2x',
      infix: false,
      suffix: '.png',
      sizes: [
        [
          1536,
          2048
        ]
      ]
    },
    ios_screen_iphone_landscape: {
      platform: 'ios',
      splash: true,
      folder: 'screen/ios',
      prefix: 'screen-iphone-landscape',
      infix: false,
      suffix: '.png',
      sizes: [
        [
          480,
          320
        ]
      ]
    },
    ios_screen_iphone_landscape_x2: {
      platform: 'ios',
      splash: true,
      folder: 'screen/ios',
      prefix: 'screen-iphone-landscape-2x',
      infix: false,
      suffix: '.png',
      sizes: [
        [
          960,
          640
        ]
      ]
    },
    ios_screen_iphone_portrait: {
      platform: 'ios',
      splash: true,
      folder: 'screen/ios',
      prefix: 'screen-iphone-portrait',
      infix: false,
      suffix: '.png',
      sizes: [
        [
          320,
          480
        ]
      ]
    },
    ios_screen_iphone_portrait_x2: {
      platform: 'ios',
      splash: true,
      folder: 'screen/ios',
      prefix: 'screen-iphone-portrait-2x',
      infix: false,
      suffix: '.png',
      sizes: [
        [
          640,
          960
        ]
      ]
    },
    ios_screen_iphone_portrait_568h_2x: {
      platform: 'ios',
      splash: true,
      folder: 'screen/ios',
      prefix: 'screen-iphone-portrait-568h_2x',
      infix: false,
      suffix: '.png',
      sizes: [
        [
          640,
          1136
        ]
      ]
    },
    ios_default_huge: {
      platform: 'ios',
      splash: true,
      folder: 'screen/ios',
      prefix: 'Default@2x~universal~anyany',
      infix: false,
      suffix: '.png',
      sizes: [
        [
          2732,
          2732]
      ]
    },
    win_screen: {
      splash: true,
      folder: 'screen/windows-phone',
      prefix: 'screen-portrait',
      infix: false,
      suffix: '.png',
      sizes: [
        [
          480,
          800
        ]
      ]
    }
  },
  electron: {
    defaults: {
      folder: '.',
      prefix: 'icon',
      infix: false,
      suffix: '.png',
      sizes: [
        512
      ]
    },
    appx_logo: {
      folder: '.',
      prefix: 'StoreLogo',
      infix: false,
      suffix: '.png',
      sizes: [
        50
      ]
    },
    appx_square: {
      folder: '.',
      prefix: 'Square',
      infix: true,
      suffix: 'Logo.png',
      sizes: [
        30,
        44,
        71,
        89,
        107,
        142,
        150,
        284,
        310
      ]
    },
    linux: {
      folder: '.',
      prefix: 'linux-',
      infix: true,
      suffix: '.png',
      sizes: [
        512,
        128,
        96,
        64,
        48,
        32,
        24,
        16
      ]
    }
  }
}
