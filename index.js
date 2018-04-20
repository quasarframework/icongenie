/**
 * Simple module that takes an original image and resizes
 * it to common web icon sizes. It will retain transparency.
 * @module gm-webicons
 * @exports webicons
 */

'use strict'

let fs = require('fs')
  , gm = require('gm')

/**
 * Creates a set of images
 * @param {string} src - image location
 * @param {string} target - where to drop the images
 */
function webicons (src, target) {

    new Promise((resolve, reject) => {
        gm(src)
            .resizeExact(16, 16)
            .write(target + 'favicon-16x16.png', function (err) {
                if (!err) {
                    console.log('16x16 done')
                } else {
                    console.log(err)
                }
            })
        })
        .then(
            gm(src)
                .resizeExact(32, 32)
                .write(target + 'favicon-32x32.png', function (err) {
                    if (!err) {
                        console.log('32x32 done')
                    } else {
                        console.log(err)
                    }
                })
        )
        .then(
            gm(src)
                .resizeExact(128, 128)
                .write(target + 'icon-128x128.png', function (err) {
                    if (!err) {
                        console.log('128x128 done')
                    } else {
                        console.log(err)
                    }
                })
        )
        .then(
            gm(src)
                .resizeExact(144, 144)
                .write(target + 'ms-icon-144x144.png', function (err) {
                    if (!err) {
                        console.log('144x144 done')
                    } else {
                        console.log(err)
                    }
                })
        )
        .then(
            gm(src)
                .resizeExact(152, 152)
                .write(target + 'apple-icon-152x152.png', function (err) {
                    if (!err) {
                        console.log('152x152 done')
                    } else {
                        console.log(err)
                    }
                })
        )
        .then(
            gm(src)
                .resizeExact(256, 256)
                .write(target + 'icon-256x256.png', function (err) {
                    if (!err) {
                        console.log('256x256 done')
                    } else {
                        console.log(err)
                    }
                })
        )
        .then(
            gm(src)
                .resizeExact(384, 384)
                .write(target + 'icon-384x384.png', function (err) {
                    if (!err) {
                        console.log('384x384 done')
                    } else {
                        console.log(err)
                    }
                })
        )
        .then(
            gm(src)
                .resizeExact(512, 512)
                .write(target + 'icon-512x512.png', function (err) {
                    if (!err) {
                        console.log('512x512 done')
                    } else {
                        console.log(err)
                    }
                })
        )
        .catch((err) => {
            return err
        })
}
module.exports = webicons
