A Karma plugin that delegates module loading to [Google Closure](https://developers.google.com/closure/library/) Debug Loader. 

This fork is a complete rewrite from [the original karma-closure available on npm](https://www.npmjs.com/package/karma-closure), that 
adds support for `goog.module`, `goog.module.declareNamespace` and ES6 modules.

## Installation

The easiest way is to keep `karma-closure` as a devDependency in your `package.json`.
```json
{
  "devDependencies": {
    "karma": "~0.10",
    "karma-closure": "github:nckh/karma-closure#v0.2.0",
  }
}
```

## Configuration
```js
// karma.conf.js
module.exports = function(config) {
  config.set({
    frameworks: ['jasmine', 'closure'],
    files: [
      // Closure base
      'lib/goog/base.js',

      // Source files
      {pattern: 'js/*.js', included: false},

      // Test files
      {pattern: 'test/*.js', included: false},

      // Serve Closure's deps.js if using the Closure Library
      {pattern: 'lib/goog/deps.js', included: false}
    ],

    preprocessors: {
      // Source and test files are preprocessed for dependencies to generate 
      // a custom deps.js
      'js/**/*.js': ['closure'],

      // Also pass the 'closure-bootstrap' preprocessor to wait until all
      // dependencies are loaded to run the tests
      'test/**/*.js': ['closure', 'closure-bootstrap'],
    }
  });
};
```

For an example project, check out [./test-app/](/tree/master/test-app)


## Migrate from karma-closure 0.1

karma-closure 0.2 is a complete rewrite that delegates source and test files loading to Closure's new Debug Loader with support for ES6 modules.

If you were using karma-closure 0.1 on npm but want to migrate to this fork, follow these steps.

1. Add `included: false` to all source and test files.
2. Remove `served: false` from Closure's `goog/deps.js`.
3. Remove `closure-iit` and `closure-deps` preprocessors.
4. Add `closure` preprocessor to all source and test files.
5. Add `closure-bootstrap` preprocessor to test files.


----

For more information on Karma see the [homepage].


[homepage]: http://karma-runner.github.com
