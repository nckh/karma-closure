const {
  closureFramework, closurePreprocessor, closureBootstrapPreprocessor
} = require('./plugin.js');

module.exports = {
  'framework:closure': ['factory', closureFramework],
  'preprocessor:closure': ['factory', closurePreprocessor],
  'preprocessor:closure-bootstrap': ['factory', closureBootstrapPreprocessor],
};
