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


describe('Illegal Ops 1', function () {

  it('missing file throws error', async function () {
    try {
      await iconfactory.spa('test/__tests__/sources/missing.png', 'test/__tests__/output', 'pngquant')
    } catch (err) {
      expect(err).to.eql('Source image for icon-genie not found')
    }
  })
})


describe('Kitchensink', function () {
  it('original', async function () {
    const done = await iconfactory.kitchensink('test/__tests__/example-1240x1240.png', 'test/__tests__/output', 'pngquant')
    if (done) {
      expect(file('./test/__tests__/example-1240x1240.png')).to.exist
    }
  })
})

describe('Illegal Ops 2', function () {

  it('invalid png throws error', async function () {
    try {
      await iconfactory.spa('test/__tests__/sources/boom.png', 'test/__tests__/output', 'pngquant')
    }
    catch(err) {
      expect(err).to.eql('Source image for icon-factory is not a png')
    }
  })
})
