var Utilities = require('lib/xcore/utilities');

/*!
 * @module xcore.UI
 * @submodule SwappableView
 * @description
 *   A container view manages and presents its set of
 *   child views in a custom way. Examples of system-defined
 *   container view controllers are tab bar view controller,
 *   navigation view controller, and split view controller.
 *   This module is very similar to iOS Container View Controller.
 * @version 1.0
 * @author Zeeshan Mian | @zmian
 * @link https://github.com/zmian/xcore-titanium
 * @license MIT
 */

/**
 * Creates and initializes the SwappableView.
 *
 * @constructor
 * @param {Object} options The configuration object to customize `SwappableView`
 * @return {Titanium.UI.ScrollableView} An instance of `SwappableView`
 * @api public
 */
function SwappableView(options) {
  /**
   * Configurations defaults, can be overridden at initialization time.
   *
   * @property options
   * @type Object
   * @default Sensible defaults
   * @api private
   */
  var options = Utilities.defaults(options, {
    scrollingEnabled:  false,
    disableBounce:     true,
    transitionEnabled: true,
    cacheSize:         9
  });

  /**
   * A reference to the instance of SwappableView object.
   *
   * @property instance
   * @type Titanium.UI.ScrollableView
   * @default Titanium.UI.ScrollableView
   * @api public
   */
  var instance = Ti.UI.createScrollableView(options);

  /**
   * Navigate to the specified page index in views.
   *
   * @method showView
   * @param {Number} index An index of the view to set as the current page.
   * @return void
   * @api public
   */
  instance.showView = function(index) {
    (options.transitionEnabled) ? instance.scrollToView(index) : instance.setCurrentPage(index);
  };

  return instance;
}

module.exports = SwappableView;
