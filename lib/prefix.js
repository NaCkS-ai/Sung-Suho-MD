const config = require('../config');

let currentPrefix = config.PREFIX; // default prefix from settings.js

function getPrefix() {

  return currentPrefix;

}

function setPrefix(newPrefix) {

  currentPrefix = newPrefix;

}

module.exports = {

  getPrefix,

  setPrefix

};

