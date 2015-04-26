/*!
 * @module Env
 * @description A module for easily detecting environment configurations.
 * @version 1.0
 * @author Zeeshan Mian | @zmian
 * @link https://github.com/zmian/xcore-titanium
 * @license MIT
 */

var Env = (function() {
  /**
   * A reference to the instance of Env object.
   *
   * @property instance
   * @type Object
   * @default Object
   * @api public
   */
  var instance = {
    /**
     * Current version
     *
     * @property VERSION
     * @type String
     */
    VERSION: '1.0',

    /**
     * An alias to internal log function
     *
     * @property log
     * @type Function
     */
    log: log,

    /**
     * Determines the name of the current OS.
     * Applicable values: ipad, iphone, android, or mobileweb.
     *
     * @property OS
     * @type String
     */
    OS: Ti.Platform.osname,

    /**
     * Shorthand properties
     */
    IS_TABLET:       isTablet(),
    IS_HANDHELD:     !isTablet(),
    IS_MOBILEWEB:    (Ti.Platform.osname === 'mobileweb'),
    IS_ANDROID:      (Ti.Platform.osname === 'android'),
    IS_IPAD:         (Ti.Platform.osname === 'ipad'),
    IS_IPHONE:       (Ti.Platform.osname === 'iphone'),
    IS_IOS:          false,
    IS_IOS_7_PLUS:   false,
    IS_IOS_6_PLUS:   false,
    IS_IOS_4_PLUS:   false,
    IS_IOS_3_2_PLUS: false,

    /**
     * Determines whether the device has Retina display
     *
     * @property IS_RETINA
     * @type Boolean
     */
    IS_RETINA: Ti.Platform.displayCaps.density === 'high',

    /**
     * Determines whether the device can reach the Internet
     *
     * @property IS_ONLINE
     * @type Boolean
     */
    IS_ONLINE: (Ti.Network.online ? true : false),

    /**
     * Status bar height
     *
     * @property STATUS_BAR_HEIGHT
     * @type Boolean
     */
    STATUS_BAR_HEIGHT: 20,

    /**
     * Nav bar height
     *
     * @property NAV_BAR_HEIGHT
     * @type Boolean
     */
    NAV_BAR_HEIGHT: 44,

    /**
     * Tab bar height
     *
     * @property TAB_BAR_HEIGHT
     * @type Boolean
     */
    TAB_BAR_HEIGHT: 50
  };

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
    debug: false
  };

  /**
   * Initializes the Env.
   *
   * @method initialize
   * @param {Object} options The configuration object to customize `Env`
   * @return {Object} An instance of `Env`
   * @api private
   */
  function initialize(options) {
    // Merge the options given by the user with the defaults
    config = defaults(options, config);

    // Determine the iOS version
    iosVersion();

    // Set inital property values
    setDynamicProperties();

    // Update the property values whenever orientation changes
    Ti.Gesture.addEventListener('orientationchange', setDynamicProperties);

    return instance;
  }

  /**
   * Sets the values of dynamic properties.
   *
   * @method setDynamicProperties
   * @return void
   * @api private
   */
  function setDynamicProperties() {
    instance.IS_PORTRAIT      = (Ti.UI.orientation === Ti.UI.PORTRAIT || Ti.UI.orientation === Ti.UI.UPSIDE_PORTRAIT);
    instance.ORIENTATION      = (instance.IS_PORTRAIT) ? 'PORTRAIT' : 'LANDSCAPE';

    instance.WIDTH            = Ti.Platform.displayCaps.platformWidth;
    instance.HEIGHT           = Ti.Platform.displayCaps.platformHeight;
    instance.CONTENT_WIDTH    = Ti.Platform.displayCaps.platformWidth;
    instance.CONTENT_HEIGHT   = Ti.Platform.displayCaps.platformHeight - instance.STATUS_BAR_HEIGHT - instance.NAV_BAR_HEIGHT - instance.TAB_BAR_HEIGHT;

    if (config.debug) propertiesDump();
  }

  function propertiesDump() {
    log('VERSION:               ' + instance.VERSION);
    log('--- Orientation Changed');
    log('Ti.UI.orientation:     ' + Ti.UI.orientation);
    log('ORIENTATION:           ' + instance.ORIENTATION);
    log('IS_PORTRAIT:           ' + instance.IS_PORTRAIT);
    log('---');
    log('Ti.UI.PORTRAIT:        ' + Ti.UI.PORTRAIT);
    log('Ti.UI.UPSIDE_PORTRAIT: ' + Ti.UI.UPSIDE_PORTRAIT);
    log('Ti.UI.LANDSCAPE_RIGHT: ' + Ti.UI.LANDSCAPE_RIGHT);
    log('Ti.UI.LANDSCAPE_LEFT:  ' + Ti.UI.LANDSCAPE_LEFT);
    log('Ti.UI.FACE_UP:         ' + Ti.UI.FACE_UP);
    log('Ti.UI.FACE_DOWN:       ' + Ti.UI.FACE_DOWN);
    log('---');
    log('WIDTH:                 ' + instance.WIDTH);
    log('HEIGHT:                ' + instance.HEIGHT);
    log('CONTENT_WIDTH:         ' + instance.CONTENT_WIDTH);
    log('CONTENT_HEIGHT:        ' + instance.CONTENT_HEIGHT);
    log('STATUS_BAR_HEIGHT:     ' + instance.STATUS_BAR_HEIGHT);
    log('NAV_BAR_HEIGHT:        ' + instance.NAV_BAR_HEIGHT);
    log('TAB_BAR_HEIGHT:        ' + instance.TAB_BAR_HEIGHT);
    log('---');
    log('OS:                    ' + instance.OS);
    log('IS_TABLET:             ' + instance.IS_TABLET);
    log('IS_HANDHELD:           ' + instance.IS_HANDHELD);
    log('IS_MOBILEWEB:          ' + instance.IS_MOBILEWEB);
    log('IS_ANDROID:            ' + instance.IS_ANDROID);
    log('IS_IPAD:               ' + instance.IS_IPAD);
    log('IS_IPHONE:             ' + instance.IS_IPHONE);
    log('IS_IOS:                ' + instance.IS_IOS);
    log('IS_IOS_7_PLUS:         ' + instance.IS_IOS_7_PLUS);
    log('IS_IOS_6_PLUS:         ' + instance.IS_IOS_6_PLUS);
    log('IS_IOS_4_PLUS:         ' + instance.IS_IOS_4_PLUS);
    log('IS_IOS_3_2_PLUS:       ' + instance.IS_IOS_3_2_PLUS);
    log('IS_RETINA:             ' + instance.IS_RETINA);
    log('IS_ONLINE:             ' + instance.IS_ONLINE);
  }

  /**
   * Determines the iOS version.
   *
   * @method iosVersion
   * @return void
   * @api private
   */
  function iosVersion() {
    // iOS specific tests
    if (Ti.Platform.name == 'iPhone OS') {
      var version = Ti.Platform.version.split('.');
      var major = parseInt(version[0],10);
      var minor = parseInt(version[1],10);

      instance.IS_IOS = true;

      if (major >= 7) {
        instance.IS_IOS_7_PLUS = true;
      }
      else if (major >= 6) {
        instance.IS_IOS_6_PLUS = true;
      }
      else if (major >= 4) {
        instance.IS_IOS_4_PLUS = true;
      }
      else if (major > 3 || (major == 3 && minor > 1)) {
        instance.IS_IOS_3_2_PLUS = true;
      }
    }
  }

  /**
   * Determines whether the device is a tablet
   * Considering tablets to have width over 720px and height over 600px
   *
   * @method isTablet
   * @return Boolean
   * @api private
   */
  function isTablet() {
    var platform = Ti.Platform.osname;

    switch (platform) {
      case 'ipad':
        return true;
      case 'android':
        var psc = Ti.Platform.Android.physicalSizeCategory;
        var tiAndroid = Ti.Platform.Android;
        return psc === tiAndroid.PHYSICAL_SIZE_CATEGORY_LARGE || psc === tiAndroid.PHYSICAL_SIZE_CATEGORY_XLARGE;
      default:
        return Math.min(
          Ti.Platform.displayCaps.platformHeight,
          Ti.Platform.displayCaps.platformWidth
        ) >= 400;
    }
  }

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
   * Outputs debuging information if the `debug` flag is turned on.
   *
   * @method log
   * @return void
   * @api private
   */
  function log(str) {
    if (config.debug && shouldPrintLogHeading) {
      Ti.API.log('');
      Ti.API.log('[xcore.Env] Set `debug` flag to `false` to turn off these logs.');
      Ti.API.log('---------------------------------------------------------------');
      shouldPrintLogHeading = false;
    }

    if (config.debug) {
      Ti.API.log('[xcore.Env] ' + str);
    }
  }

  /**
   * Recursively merge properties of two objects.
   *
   * @method defaults
   * @return Object
   * @api private
   */
  function defaults(obj2, obj1) {
    // Extract options
    obj1  || (obj1  = {}); // Defaults
    obj2  || (obj2 = {});  // Options

    for (var p in obj2) {
      try {
        // Property in destination object set; update its value.
        if (obj2[p].constructor === Object) {
          obj1[p] = defaults(obj1[p], obj2[p]);
        } else {
          obj1[p] = obj2[p];
        }
      } catch(e) {
        // Property in destination object not set; create it and set its value.
        obj1[p] = obj2[p];
      }
    }
    return obj1;

  }

  return initialize;

})();

module.exports = Env;
