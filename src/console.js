/*!
 * @module xcore
 * @submodule console
 * @description Node.js and browser has it so, why not for Titanium.
 * @version 1.0
 * @author Zeeshan Mian | @zmian
 * @link https://github.com/zmian/xcore-titanium
 * @license MIT
 */

var Console = {
  log: function() {
    if (arguments && arguments.length > 0) {
      try {
        window.console.log.apply(null, Array.prototype.slice.call(arguments));
      } catch(e) {
        for (var i = 0; i < arguments.length; ++i)
          if ( typeof arguments[i] == 'object') {
            var value = '';
            for (var j in arguments[i])
            value += j + ':' + arguments[i][j] + ', ';
            value = value.replace(/[\n\t]/g, ' ');
            arguments[i] = '{' + value.substr(0, value.length - 2) + '}';
          }
        Ti.API.info(Array.prototype.join.call(arguments, ' '));
      } finally {}
    }
  },
  error: function(message) {
    return Ti.API.error(message);
  },
  info: function(message, stringify) {
    var stringify = (typeof stringify === 'undefined') ? true : stringify;

    var header = '-------------------- ' + message.toString();
    var result = (stringify) ? JSON.stringify(message) : message;

    Ti.API.info(header);
    Ti.API.info(result);
  }
};

module.exports = console;
