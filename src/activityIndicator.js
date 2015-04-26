/*!
 * @module xcore.UI
 * @submodule ActivityIndicator
 * @description A module for creating activity indicator.
 * @version 1.0
 * @author Zeeshan Mian | @zmian
 * @link https://github.com/zmian/xcore-titanium
 * @license MIT
 */

(function() {

  'use strict';

  /**
   * Module dependencies.
   */
  var Utilities = require('lib/xcore/utilities');

  /**
   * Current version.
   */
  var VERSION = '1.0';

  /**
   * A reference to the instance of ActivityIndicator object.
   *
   * @property instance
   * @type Titanium.UI.View
   * @default Titanium.UI.View
   * @api private
   */
  var instance = {};

  /**
   * Determines whether log heading is printed.
   *
   * @property shouldPrintLogHeading
   * @type Boolean
   * @default true
   * @api private
   */
  var shouldPrintLogHeading = true;

  /**
   * Configurations defaults, can be overridden at initialization time.
   *
   * @property config
   * @type Object
   * @default Sensible defaults
   * @api private
   */
  var config = {
    /**
     * Determines whether the debuging information is displayed.
     *
     * @property debug
     * @type Boolean
     * @default false
     */
    debug: false,

    /**
     * Slide's width, in platform-specific units.
     *
     * @property width
     * @type Number || String
     * @default Ti.UI.SIZE
     */
    width: Ti.UI.SIZE,

    /**
     * Slide's height, in platform-specific units.
     *
     * @property height
     * @type Number || String
     * @default Ti.UI.SIZE
     */
    height: Ti.UI.SIZE,

    /**
     * Background color of the view, as a color name or hex triplet.
     *
     * @property backgroundColor
     * @type String
     * @default '#8000'
     */
    backgroundColor: '#8000',

    /**
     * Color of the label text, as a color name or hex triplet.
     *
     * @property color
     * @type String
     * @default '#fff'
     */
    color: '#8fff',

    /**
     * Color of the spinner
     *
     * @property style
     * @type String
     * @default 'white'
     */
    style: 'white',

    /**
     * Size of the spinner
     *
     * @property size
     * @type String
     * @default 'small'
     */
    size: 'small',

    /**
     * Font to use for the label text.
     *
     * @property font
     * @type Font
     * @default {fontFamily: 'Helvetica Neue', fontSize: 14}
     */
    font: {fontFamily: 'Helvetica Neue', fontSize: 14},

    /**
     * Padding around the spinner and the label text.
     *
     * @property padding
     * @type Number
     * @default 26
     */
    padding: 26,

    /**
     * Radius for the rounded corners of the view's border.
     *
     * @property borderRadius
     * @type Number
     * @default 10
     */
    borderRadius: 10,

    /**
     * Text to display for the the label.
     *
     * @property text
     * @type String
     * @default 'Loading'
     */
    message: 'Loading'
  };

  /**
   * Initializes the ActivityIndicator.
   *
   * @method initialize
   * @param {Object} options The configuration object to customize `ActivityIndicator`
   * @return {Titanium.UI.View} An instance of `ActivityIndicator`
   * @api private
   */
  function initialize(options) {
    // Merge the options given by the user with the defaults
    config = Utilities.defaults(options, config);

    // create an instance
    createInstance();

    // Public API
    instance.VERSION = VERSION;

    return instance;
  }

  /**
   * Creates an instance of the `ActivityIndicator`
   *
   * @method createInstance
   * @return {Titanium.UI.View} An instance of `ActivityIndicator`
   * @api private
   */
  function createInstance() {
    instance = Ti.UI.createWindow(config);

    instance.applyProperties({
      layout: 'composite'
    });

    var container = Ti.UI.createView({
      width:  Ti.UI.SIZE,
      height: Ti.UI.SIZE,
      layout: 'vertical'
    });
    instance.add(container);

    var spinner = createSpinner();
    container.add(spinner);

    if (config.message) {
      var label = createLabel();
      container.add(label);
    }

    instance.addEventListener('close', function(e) {
      spinner.hide();
    });

    container.addEventListener('postlayout', function(e) {
      log('postLayout callback');
      spinner.show();

      var size = (e.source.rect.height > e.source.rect.width) ? e.source.rect.height : e.source.rect.width;

      instance.width  = size + config.padding;
      instance.height = size + config.padding;
    });

    return instance;
  }

  /**
   * Creates a spinner
   *
   * @method createSpinner
   * @return {Titanium.UI.ActivityIndicator} An instance of `Spinner`
   * @api private
   */
  function createSpinner() {
    var color;

    if (config.style === 'white') {
      color = (config.size === 'small') ? 'PLAIN' : 'BIG';
    } else {
      color = (config.size === 'small') ? 'DARK' : 'BIG_DARK';
    }

    var style = (Ti.Platform.name === 'iPhone OS') ? Ti.UI.iPhone.ActivityIndicatorStyle[color] : Ti.UI.ActivityIndicatorStyle[color];

    var spinner = Ti.UI.createActivityIndicator({
      style: style
    });

    log('spinner type = ' + color);

    return spinner;
  }

  /**
   * Creates a label
   *
   * @method createLabel
   * @return {Titanium.UI.Label} An instance of `Label`
   * @api private
   */
  function createLabel(text) {
    var label = Ti.UI.createLabel({
      top:   6,
      text:  config.message,
      font:  config.font,
      color: config.color
    });

    return label;
  }

  /**
   * Outputs debuging information if the `debug` flag is turned on.
   *
   * @method log
   * @return void
   * @api private
   */
  var log = function(str) {
    if (config.debug && shouldPrintLogHeading) {
      Ti.API.log('');
      Ti.API.log('[xcore.UI.ActivityIndicator] Set `debug` flag to `false` to turn off these logs.');
      Ti.API.log('--------------------------------------------------------------------------------');
      shouldPrintLogHeading = false;
    }

    if (config.debug) {
      Ti.API.log('[xcore.UI.ActivityIndicator] ' + str);
    }
  };

  module.exports = initialize;

})();
