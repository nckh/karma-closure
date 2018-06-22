module.exports = function(config) {
  config.set({
    frameworks: ['jasmine', 'closure'],
    files: [
      // closure base
      '../node_modules/google-closure-library/closure/goog/base.js',
      // included files - tests
      {pattern: 'test/*.js', included: false},
      {pattern: 'js/*.js', included: false},
      // external deps
      {pattern: '../node_modules/google-closure-library/closure/goog/deps.js', included: false},
      {pattern: '../node_modules/google-closure-library/closure/goog/**/*.js', included: false},
    ],

    preprocessors: {
      'test/*.js': ['closure', 'closure-bootstrap'],
      'js/*.js': ['closure'],
    },

    browsers: ['Chrome'],
    autoWatch: true,
  });

  // Load the plugin from the workspace.
  // You don't need this if you just install karma-closure through NPM.
  config.plugins.push(require('../lib'));
};
