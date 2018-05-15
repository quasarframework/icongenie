exports.options = {
    // folder determines in which path to drop the generated file
    // prefix is the first part of the generated file's name
    // infix adds e.g. "44x44" based on the size in sizes to the generated file's name
    // suffix adds a file-ending to the generated file's name
    // sizes determines the pixel width and height to use
    minify: {
        batch: false,
        overwrite: true,
        available: ['pngcrush','pngquant','optipng','pngout','zopfli'],
        type: 'pngout',
        pngcrushOptions: {
            reduce: true
        },
        pngquantOptions: {
            quality: '85-95',
            floyd: 1, // 0.1 - 1
            speed: 1 // 1 - 10
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
    icns: {

    },
    // below this line are all of the icon settings
    electron: {
        defaults: {
            folder: 'electron',
            prefix: 'icon',
            infix: false,
            suffix: '.png',
            sizes: [
                512
            ]
        },
        appx_logo: {
            folder: 'electron',
            prefix: 'StoreLogo',
            infix: false,
            suffix: '.png',
            sizes: [
                50
            ]
        },
        appx_square: {
            folder: 'electron',
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
                310,
            ]
        },
        linux: {
            folder: 'electron',
            prefix: 'linux-',
            infix: true,
            suffix: '.png',
            sizes: [
                512,
                256,
                128,
                96,
                64,
                48,
                32,
                24,
                16
            ]
        },
    },
    cordova: {
        android_ldpi: {
            folder: 'cordova/android',
            prefix: 'ldpi',
            infix: false,
            suffix: '.png',
            sizes: [
                36
            ]
        },
        android_mdpi: {
            folder: 'cordova/android',
            prefix: 'mdpi',
            infix: false,
            suffix: '.png',
            sizes: [
                48
            ]
        },
        android_hdpi: {
            folder: 'cordova/android',
            prefix: 'hdpi',
            infix: false,
            suffix: '.png',
            sizes: [
                72
            ]
        },
        android_xhdpi: {
            folder: 'cordova/android',
            prefix: 'xhdpi',
            infix: false,
            suffix: '.png',
            sizes: [
                96
            ]
        },
        android_xxhdpi: {
            folder: 'cordova/android',
            prefix: 'xxhdpi',
            infix: false,
            suffix: '.png',
            sizes: [
                144
            ]
        },
        android_xxxhdpi: {
            folder: 'cordova/android',
            prefix: 'xxxhdpi',
            infix: false,
            suffix: '.png',
            sizes: [
                192
            ]
        },
        ios_adhoc_itunesadhoc: {
            // iOS 7+
            folder: 'cordova/ios',
            prefix: 'iTunesArtwork',
            infix: false,
            suffix: '',
            sizes: [
                512
            ]
        },
        ios_adhoc_itunesadhoc_2x: {
            // iOS 7+
            folder: 'cordova/ios',
            prefix: 'iTunesArtwork@2x',
            infix: false,
            suffix: '',
            sizes: [
                1024
            ]
	      },
        ios_watch_appicon40:{
	          // iOS Watch
            folder: 'cordova/ios',
            prefix: 'AppIcon40x40@2x',
            infix: false,
            suffix: '.png',
            sizes: [
                80
            ]
        },
        ios_watch_appicon44:{
            // iOS Watch
            folder: 'cordova/ios',
            prefix: 'AppIcon44x44@2x',
            infix: false,
            suffix: '.png',
            sizes: [
                88
            ]
        },
        ios_watch_appicon86:{
            // iOS Watch
            folder: 'cordova/ios',
            prefix: 'AppIcon86x86@2x',
            infix: false,
            suffix: '.png',
            sizes: [
                172
            ]
        },
        ios_watch_appicon98:{
            // iOS Watch
            folder: 'cordova/ios',
            prefix: 'AppIcon98x98@2x',
            infix: false,
            suffix: '.png',
            sizes: [
                196
            ]
        },
        ios_watch_appicon24:{
            // iOS Watch
            folder: 'cordova/ios',
            prefix: 'AppIcon24x24@2x',
            infix: false,
            suffix: '.png',
            sizes: [
                48
            ]
        },
        ios_watch_appicon27:{
            // iOS Watch
            folder: 'cordova/ios',
            prefix: 'AppIcon27.5x27.5@2x',
            infix: false,
            suffix: '.png',
            sizes: [
                55
            ]
        },
        ios_watch_appicon29:{
            // iOS Watch
            folder: 'cordova/ios',
            prefix: 'AppIcon29x29@2x',
            infix: false,
            suffix: '.png',
            sizes: [
                58
		        ]
        },
        ios_watch_appicon29x3:{
            // iOS Watch
            folder: 'cordova/ios',
            prefix: 'AppIcon29x29@3x',
            infix: false,
            suffix: '.png',
            sizes: [
                87
            ]
	      },
        ios_icon60:{
            // iOS 7+
            folder: 'cordova/ios',
            prefix: 'icon-60',
            infix: false,
            suffix: '.png',
            sizes: [
                60
            ]
        },
        ios_icon60_2x:{
            // iOS 7+
            folder: 'cordova/ios',
            prefix: 'icon-60@2x',
            infix: false,
            suffix: '.png',
            sizes: [
                120
            ]
        },
        ios_icon60_3x:{
            // iOS 8+
            folder: 'cordova/ios',
            prefix: 'icon-60@3x',
            infix: false,
            suffix: '.png',
            sizes: [
                180
            ]
        },
        ios_icon76:{
            // iPad
            folder: 'cordova/ios',
            prefix: 'icon-76',
            infix: false,
            suffix: '.png',
            sizes: [
                60
            ]
        },
        ios_icon76_2x:{
            // iPad
            folder: 'cordova/ios',
            prefix: 'icon-76@2x',
            infix: false,
            suffix: '.png',
            sizes: [
                152
            ]
        },
        ios_icon40:{
            // Spotlight Icon
            folder: 'cordova/ios',
            prefix: 'icon-40',
            infix: false,
            suffix: '.png',
            sizes: [
                40
            ]
        },
        ios_icon40_2x:{
            // Spotlight Icon
            folder: 'cordova/ios',
            prefix: 'icon-40@2x',
            infix: false,
            suffix: '.png',
            sizes: [
                80
            ]
        },
        ios_icon:{
            // iPhone / iPod Touch
            folder: 'cordova/ios',
            prefix: 'icon',
            infix: false,
            suffix: '.png',
            sizes: [
                57
            ]
        },
        ios_icon_2x:{
            // iPhone / iPod Touch
            folder: 'cordova/ios',
            prefix: 'icon@2x',
            infix: false,
            suffix: '.png',
            sizes: [
                114
            ]
        },
        ios_icon_72:{
            // iPad
            folder: 'cordova/ios',
            prefix: 'icon-72',
            infix: false,
            suffix: '.png',
            sizes: [
                72
            ]
        },
        ios_icon_72_2x:{
            // iPad
            folder: 'cordova/ios',
            prefix: 'icon-72@2x',
            infix: false,
            suffix: '.png',
            sizes: [
                57
            ]
        },
        ios_icon_small:{
            // iPhone Spotlight and Settings
            folder: 'cordova/ios',
            prefix: 'icon-small',
            infix: false,
            suffix: '.png',
            sizes: [
                29
            ]
        },
        ios_icon_small_2x:{
            // iPhone Spotlight and Settings
            folder: 'cordova/ios',
            prefix: 'icon-small@2x',
            infix: false,
            suffix: '.png',
            sizes: [
                58
            ]
        },
        ios_icon_50:{
            // iPad Spotlight & Settings
            folder: 'cordova/ios',
            prefix: 'icon-50',
            infix: false,
            suffix: '.png',
            sizes: [
                50
            ]
        },
        ios_icon_50_2x:{
            // iPad Spotlight & Settings
            folder: 'cordova/ios',
            prefix: 'icon-50@2x',
            infix: false,
            suffix: '.png',
            sizes: [
                57
            ]
        },
        ios_icon_167:{
            // iPad Pro
            folder: 'cordova/ios',
            prefix: 'icon-167',
            infix: false,
            suffix: '.png',
            sizes: [
                167
            ]
        },
        ios_icon_167_halved:{
            // iPad Pro
            folder: 'cordova/ios',
            prefix: 'icon-83.5@2x',
            infix: false,
            suffix: '.png',
            sizes: [
                167
            ]
        },
        win_storelogo:{
            folder: 'cordova/windows',
            prefix: 'StoreLogo',
            infix: false,
            suffix: '.png',
            sizes: [
                50
            ]
        },
        win_smalllogo:{
            folder: 'cordova/windows',
            prefix: 'SmallLogo',
            infix: false,
            suffix: '.png',
            sizes: [
                30
            ]
        },
        win_squarelogo: {
            folder: 'cordova/windows',
            prefix: 'Square',
            infix: true,
            suffix: 'Logo.png',
            sizes: [
                30,
                44,
                70,
                71,
                89,
                107,
                142,
                150,
                284,
                310,
            ]
        },
        win_small_tile_71: {
            folder: 'cordova/windows',
            prefix: 'Square71x71Logo.',
            infix: false,
            suffix: 'scale-100.png',
            sizes: [
                71
            ]
        },
        win_small_tile_125: {
            folder: 'cordova/windows',
            prefix: 'Square71x71Logo.',
            infix: false,
            suffix: 'scale-125.png',
            sizes: [
                89
            ]
        },
        win_small_tile_150: {
            folder: 'cordova/windows',
            prefix: 'Square71x71Logo.',
            infix: false,
            suffix: 'scale-150.png',
            sizes: [
                107
            ]
        },
        win_small_tile_200: {
            folder: 'cordova/windows',
            prefix: 'Square71x71Logo.',
            infix: false,
            suffix: 'scale-200.png',
            sizes: [
                142
            ]
        },
        win_small_tile_400: {
            folder: 'cordova/windows',
            prefix: 'Square71x71Logo.',
            infix: false,
            suffix: 'scale-400.png',
            sizes: [
                284
            ]
        },
        win_medium_tile_100: {
            folder: 'cordova/windows',
            prefix: 'Square150x150Logo.',
            infix: false,
            suffix: 'scale-100.png',
            sizes: [
                150
            ]
        },
        win_medium_tile_125: {
            folder: 'cordova/windows',
            prefix: 'Square150x150Logo.',
            infix: false,
            suffix: 'scale-125.png',
            sizes: [
                188
            ]
        },
        win_medium_tile_150: {
            folder: 'cordova/windows',
            prefix: 'Square150x150Logo.',
            infix: false,
            suffix: 'scale-150.png',
            sizes: [
                225
            ]
        },
        win_medium_tile_200: {
            folder: 'cordova/windows',
            prefix: 'Square150x150Logo.',
            infix: false,
            suffix: 'scale-200.png',
            sizes: [
                300
            ]
        },
        win_medium_tile_400: {
            folder: 'cordova/windows',
            prefix: 'Square150x150Logo.',
            infix: false,
            suffix: 'scale-400.png',
            sizes: [
                600
            ]
        },
        win_large_tile_100: {
            folder: 'cordova/windows',
            prefix: 'Square310x310Logo.',
            infix: false,
            suffix: 'scale-100.png',
            sizes: [
                310
            ]
        },
        win_large_tile_125: {
            folder: 'cordova/windows',
            prefix: 'Square310x310Logo.',
            infix: false,
            suffix: 'scale-125.png',
            sizes: [
                388
            ]
        },
        win_large_tile_150: {
            folder: 'cordova/windows',
            prefix: 'Square310x310Logo.',
            infix: false,
            suffix: 'scale-150.png',
            sizes: [
                465
            ]
        },
        win_large_tile_200: {
            folder: 'cordova/windows',
            prefix: 'Square310x310Logo.',
            infix: false,
            suffix: 'scale-200.png',
            sizes: [
                620
            ]
        },
        win_large_tile_400: {
            folder: 'cordova/windows',
            prefix: 'Square310x310Logo.',
            infix: false,
            suffix: 'scale-400.png',
            sizes: [
                1240
            ]
        },
        win_applist_tile_100: {
            folder: 'cordova/windows',
            prefix: 'Square44x44Logo.',
            infix: false,
            suffix: 'scale-100.png',
            sizes: [
                44
            ]
        },
        win_applist_tile_125: {
            folder: 'cordova/windows',
            prefix: 'Square44x44Logo.',
            infix: false,
            suffix: 'scale-125.png',
            sizes: [
                55
            ]
        },
        win_applist_tile_150: {
            folder: 'cordova/windows',
            prefix: 'Square44x44Logo.',
            infix: false,
            suffix: 'scale-150.png',
            sizes: [
                66
            ]
        },
        win_applist_tile_200: {
            folder: 'cordova/windows',
            prefix: 'Square44x44Logo.',
            infix: false,
            suffix: 'scale-200.png',
            sizes: [
                88
            ]
        },
        win_applist_tile_400: {
            folder: 'cordova/windows',
            prefix: 'Square44x44Logo.',
            infix: false,
            suffix: 'scale-400.png',
            sizes: [
                176
            ]
        },
    },
    spa: {
        all: {
            folder: 'spa',
            prefix: 'icon-',
            infix: true,
            suffix: '.png',
            sizes: [
                512,
                384,
                256,
                128,
                96,
                72,
                64,
                48,
                32,
                16
            ]
        }
    },
    pwa: {
        generic: {
            folder: 'pwa',
            prefix: 'generic-icon-',
            infix: true,
            suffix: '.png',
            sizes: [
                48,
                72,
                96,
                128,
                144,
                168,
                192,
                384
            ]
        },
        apple: {
            folder: 'pwa',
            prefix: 'apple-icon-',
            infix: true,
            suffix: '.png',
            sizes: [
                152
            ]
        },
        apple_touch: {
            folder: 'pwa',
            prefix: 'apple-touch-icon',
            infix: false,
            suffix: '.png',
            sizes: [
                180
            ]
        },
        windows: {
            folder: 'pwa',
            prefix: 'ms-icon-',
            infix: true,
            suffix: '.png',
            sizes: [
                144
            ]
        },
        android_chrome_0_75: {
            folder: 'pwa',
            prefix: 'launcher-icon-0-75x',
            infix: false,
            suffix: '.png',
            sizes: [
                36
            ]
        },
        android_chrome_1: {
            folder: 'pwa',
            prefix: 'launcher-icon-1x',
            infix: false,
            suffix: '.png',
            sizes: [
                48
            ]
        },
        android_chrome_1_5: {
            folder: 'pwa',
            prefix: 'launcher-icon-1-5x',
            infix: false,
            suffix: '.png',
            sizes: [
                72
            ]
        },
        android_chrome_2: {
            folder: 'pwa',
            prefix: 'launcher-icon-2x',
            infix: false,
            suffix: '.png',
            sizes: [
                96
            ]
        },
        android_chrome_3: {
            folder: 'pwa',
            prefix: 'launcher-icon-3x',
            infix: false,
            suffix: '.png',
            sizes: [
                144
            ]
        },
        android_chrome_4: {
            folder: 'pwa',
            prefix: 'launcher-icon-4x',
            infix: false,
            suffix: '.png',
            sizes: [
                192
            ]
        },
    }
}
