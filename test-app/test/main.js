goog.module('test');

const main = goog.require('main');
const destruct = goog.require('destruct');
const {value} = goog.require('cloz.es6')

/**
 * main
 *   -> a
 *     -> b
 *     -> c
 *       -> d
 *   -> b
 *   -> e
 *   -> f
 */

describe('main', function() {
  it('should call through a(), b() and sum', function() {
    expect(main(1, 2, 3)).toBe(24);
  });

  it('should concatenate constants', function() {
    expect(destruct).toEqual('gigou246');
  });

  it('should import from Closure-compatible ES6 modules', function() {
    expect(value).toEqual('glaglou');
  });
});
