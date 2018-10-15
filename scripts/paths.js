const path = require('path');

const MODULES_FOLDER = 'modules';
const COMPONENTS_FOLDER = 'components';

const DAPP_ROOT = path.resolve('.', 'src');
const DAPP_MODULES = path.resolve(DAPP_ROOT, MODULES_FOLDER);

exports.MODULES_FOLDER = MODULES_FOLDER;
exports.COMPONENTS_FOLDER = COMPONENTS_FOLDER;
exports.DAPP_ROOT = DAPP_ROOT;
exports.DAPP_MODULES = DAPP_MODULES;

module.exports = {
  MODULES_FOLDER,
  COMPONENTS_FOLDER,
  DAPP_ROOT,
  DAPP_MODULES,
};