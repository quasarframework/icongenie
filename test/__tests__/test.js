'use strict'

let iconfactory = require('../../lib/index.js')
let settings = require('../../lib/settings.js')

const chai = require('chai')
const chaiAsPromised = require('chai-as-promised')
const chaiFiles = require('chai-files')
chai.use(chaiAsPromised)
chai.use(chaiFiles)
const expect = chai.expect
const file = chaiFiles.file


describe('Illegal Ops 1', () => {

  it('missing file throws error', async () => {
    try {
      iconfactory.spa('test/__tests__/sources/missing.png', 'test/__tests__/output', 'pngquant')
    } catch (err) {
      expect(err).to.eql('Source image for icon-factory not found')
    }
  })
})

describe('Illegal Ops 2', () => {

  it('invalid png throws error', async () => {
    try {
      iconfactory.spa('test/__tests__/sources/boom.png', 'test/__tests__/output', 'pngquant')
    }
    catch(err) {
      expect(err).to.eql('Source image for icon-factory is not a png')
    }
  })
  /*
  it('original', async () => {
    const done = await iconfactory.kitchensink('test/__tests__/example-1240x1240.png', 'test/__tests__/output', 'pngquant')
    if (done) {
      expect(file('./test/__tests__/example-1240x1240.png')).to.exist
    }
  })
  */
})

