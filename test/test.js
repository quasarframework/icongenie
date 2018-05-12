'use strict';

let iconfactory = require('../bin/iconfactory')



iconfactory.build('./test/example-1024x1024.png', './test/output/', false)

iconfactory.minify('./test/output/', 'crush')

iconfactory.icns('./test/example-1024x1024.png', './test/output/')

setTimeout(function() {

    const chai = require('chai')
    const chaiAsPromised = require('chai-as-promised')
    const chaiFiles = require('chai-files')
    chai.use(chaiAsPromised)
    chai.use(chaiFiles)

    const expect = chai.expect
    const file = chaiFiles.file
    const dir = chaiFiles.dir

    describe('Web Icons', () => {
        it('original', (done) => {
            expect(file('./test/example-1024x1024.png')).to.exist
            return done()
        })
        it('16x16', () => {
            setTimeout(function(){
                expect(file('./test/output/favicon-16x16.png')).to.exist
            },100)
        })
        it('32x32', () => {
            setTimeout(function(){
                expect(file('./test/output/favicon-32x32.png')).to.exist
            },100)
        })
        it('128x128', () => {
            setTimeout(function(){
                expect(file('./test/output/icon-128x128.png')).to.exist
            },100)
        })
        it('144x144', () => {
            setTimeout(function(){
                expect(file('./test/output/ms-icon-144x144.png')).to.exist
            },100)
        })
        it('152x152', () => {
            setTimeout(function(){
                expect(file('./test/output/apple-icon-152x152.png')).to.exist
            },100)
        })
        it('256x256', () => {
            setTimeout(function(){
                expect(file('./test/output/icon-256x256.png')).to.exist
            },100)
        })
        it('384x384', () => {
            setTimeout(function(){
                expect(file('./test/output/icon-384x384.png')).to.exist
            },100)
        })
        it('512x512', () => {
            setTimeout(function(){
                expect(file('./test/output/icon-512x512.png')).to.exist
            },100)
            //   return expect(Promise.resolve(file('./test/output/icon-512x512.png'))).to.eventually.exist
        })
    })
}, 10000)


