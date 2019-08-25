/**
 * The file enables `@/store/index.js` to import all vuex modules
 * in a one-shot manner. There should not be any reason to edit this file.
 */

import camelCase from 'lodash/camelCase'

const requireModule = require.context(".", false, /\.js$/)
const modules = {}

requireModule.keys().forEach(fileName => {
  if (fileName === './index.js') return
  // filter fullstops and extension 
  // and return a camel-case name for the file
  let moduleName = camelCase(
    fileName.replace(/(\.\/|\.js)/g, '')
  )
  moduleName = moduleName.replace('Module', '');
  // create a dynamic object with all modules

  if (moduleName === 'playback') {
    modules[moduleName] = {
      namespaced: true,
      ...requireModule(fileName).default
    }
  } else {
    modules[moduleName] = {
      ...requireModule(fileName).default
    }
  }

})

export default modules
