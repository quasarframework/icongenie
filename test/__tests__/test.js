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


describe('Web Icons', async () => {
  const done = await iconfactory.kitchensink('test/__tests__/example-1240x1240.png', 'test/__tests__/output', 'pngquant')
  it('original', () => {
    if (done) {
      expect(file('./test/__tests__/example-1240x1240.png')).to.exist
    }
  })
})

