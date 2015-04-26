/*!
 * @module xcore
 * @submodule events
 * @description Proxy Titanium Events using jQuery like events API.
 * @version 1.0
 * @author Zeeshan Mian | @zmian
 * @link https://github.com/zmian/xcore-titanium
 * @license MIT
 */

var events = {
  on: function() {
    return Ti.App.addEventListener.apply(this, arguments);
  },
  off: function() {
    return Ti.App.removeEventListener.apply(this, arguments);
  },
  trigger: function() {
    return Ti.App.fireEvent.apply(this, arguments);
  }
};

module.exports = events;
