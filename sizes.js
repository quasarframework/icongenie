exports.preset = {
    web: {
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
    },
    android: {
        prefix: 'android-chrome-',
        infix: true,
        suffix: '.png',
        sizes: [
            192,
            384
        ]
    },
    linux: {
        prefix: 'linux-',
        infix: true,
        suffix: '.png',
        sizes: [
            256
        ]
    },
    ms: {
        prefix: 'ms-icon-',
        infix: true,
        suffix: '.png',
        sizes: [
            144
        ]
    },
    mac: {
        prefix: 'apple-icon-',
        infix: true,
        suffix: '.png',
        sizes: [
            152
        ]
    },
    apple: {
        prefix: 'apple-touch-icon',
        infix: false,
        suffix: '.png',
        sizes: [
            180
        ]
    }
}
