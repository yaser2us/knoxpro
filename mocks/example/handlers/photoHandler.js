'use strict'

const jsonApi = require('../../../src/lib/jsonApi')

module.exports = new jsonApi.MemoryHandler()
module.exports.delete = null
