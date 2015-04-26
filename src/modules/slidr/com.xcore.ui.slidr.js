/*!
 * @module Slidr
 * @description A module for easily creating harmonious magazine like presentations.
 * @version 1.0
 * @author Zeeshan Mian | @zmian
 * @link https://github.com/zmian/xcore-titanium
 * @license MIT
 */

var Slidr = (function() {

  /**
   * Module dependencies.
   */
  var _         = require('lib/underscore');
  var Utilities = require('lib/xcore/utilities');

  /**
   * Current version.
   */
  var VERSION = '1.0';

  /**
   * A reference to the instance of Slidr object.
   *
   * @property instance
   * @type Titanium.UI.ScrollView
   * @default Titanium.UI.ScrollView
   * @api private
   */
  var instance = {};

  var instanceHeight = 0;
  var instanceWidth  = 0;

  /**
   * A reference to all (vertical and horizontal) instances of slides.
   *
   * @property slideStack
   * @type Titanium.UI.View[][] (2D Array)
   * @default []
   * @api private
   */
  var slideStack = [];

  /**
   * A reference to previous slide object.
   *
   * @property nextSlide
   * @type Titanium.UI.View
   * @default {}
   * @api private
   */
  var previousSlide = {};

  /**
   * A reference to current slide object.
   *
   * @property nextSlide
   * @type Titanium.UI.View
   * @default {}
   * @api private
   */
  var currentSlide = {};

  /**
   * A reference to next slide object.
   *
   * @property nextSlide
   * @type Titanium.UI.View
   * @default {}
   * @api private
   */
  var nextSlide = {};

  /**
   * A reference object for total number of slides.
   *
   * @property count
   * @type Number
   * @default 0
   * @api private
   */
  var count = {
    totalSlides:      0,
    horizontalSlides: 0
  };

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
     * @default '78%'
     */
    width: '78%',

    /**
     * Slide's height, in platform-specific units.
     *
     * @property height
     * @type Number || String
     * @default '80%'
     */
    height: '80%',

    /**
     * An array of slides.
     *
     * @property slides
     * @type Titanium.UI.View[]
     * @default []
     */
    slides: [],

    /**
     * Determines whether the previous and next slides are clipped,
     * so that they are not visible adjacent to the current slide.
     *
     * @property clipSlides
     * @type Boolean
     * @default false
     */
    clipSlides: false,

    /**
     * Determines whether the current slide animates to the specified slide.
     *
     * @property transitionEnabled
     * @type Boolean
     * @default false
     */
    transitionEnabled: true,

    /**
     * Determines whether scrolling is enabled.
     *
     * @property scrollingEnabled
     * @type Boolean
     * @default true
     */
    scrollingEnabled: true,

    /**
     * Determines whether page bouncing effect is disabled.
     *
     * @property disableBounce
     * @type Boolean
     * @default false
     */
    disableBounce: false,

    /**
     * Determines whether the paging control is visible.
     *
     * @property showPagingControl
     * @type Boolean
     * @default false
     */
    showPagingControl: true,

    /**
     * Color of the paging control, as a color name or hex triplet.
     *
     * @property pagingControlColor
     * @type String
     * @default transparent
     */
    pagingControlColor: 'transparent'
  };

  /**
   * Initializes the Slidr.
   *
   * @method initialize
   * @param {Object} options The configuration object to customize `Slidr`
   * @return {Titanium.UI.ScrollView} An instance of `Slidr`
   * @api private
   */
  function initialize(options) {
    // Merge the options given by the user with the defaults
    config = Utilities.defaults(options, config);

    // create an instance
    createInstance();

    // Public API
    instance.VERSION  = VERSION;
    instance.addSlide = addSlide;

    return instance;
  }

  /**
   * Creates an instance of the `Slidr`
   *
   * @method createInstance
   * @return {Titanium.UI.ScrollView} An instance of `Slidr`
   * @api private
   */
  function createInstance() {
    // create alias(es)
    config.clipViews = config.clipSlides;

    // create an instance
    instance = XUI.SwappableView(config);

    // add slides
    if (config.slides.length !== 0) addSlide(config.slides, {reset: true});

    instanceWidth  = instance.toImage().width;
    instanceHeight = instance.toImage().height;

    return instance;
  }

  /**
   * Creates an instance of the Slide
   *
   * @method createSlide
   * @return {Titanium.UI.ScrollView} An instance of Slide.
   * @api private
   */
  function createSlide(options) {
    // Extract options
    options || (options = {});

    var slide = Ti.UI.createScrollView({
      contentWidth:     'auto',
      contentHeight:    'auto',
      width:            '100%',
      height:           '100%',
      layout:           'vertical',
      maxZoomScale:     1,
      verticalBounce:   ! config.disableBounce,
      scrollingEnabled: true,
      _meta:            {
        className: options.className || 'topLevelSlide',
        index:     options.index
      }
    });

    // Navigation event handling
    slide.addEventListener('X-swipe', function(e) {
      log('scrolling: ' + JSON.stringify(e));

      var slides = getNumberOfSlides('vertical', slide._meta.index);

      //instance.height.toImage / slides;

      log('instance.width ' + instanceWidth);
      log('instance.height' + instanceHeight);
      log('slides #       ' + slides);

      // slide.scrollTo(0, instance.height.toImage);
    });

    return slide;
  }

  /**
   * Adds new slide(s) to the Slidr instance.
   *
   * @method addSlide
   * @param {Titanium.UI.View} slide The slide(s) to add.
   * @param {Object} options The configuration object to customize `addSlide` behavior.
   * @param {Boolean} options.reset Removes all slides before adding additional slides.
   * @param {Number} options.parentIndex Parent index of the slide to add childslides for.
   * @return void
   * @api private
   */
  function addSlide(slide, options) {
    // Extract options
    options || (options = {});

    var type      = ((slide instanceof Array) ? 'array' : typeof slide);
    var signature = '::addSlide(' + type.toUpperCase() + ' slide, ' + JSON.stringify(options) + ') ';
    var slideContainer;

    log(signature + 'method invoked.');

    var isChildSlide = options.parentIndex >= 0 && options.parentIndex < getNumberOfSlides('horizontal');

    // Reset all slides
    if (options.reset) {
      instance.setViews([]);
      slideStack = [];
    }

    if (slide instanceof Array) {
      // Add slides as children
      if (isChildSlide) {
        log(signature + 'adding an array of slides as children.');

        for (var i = 0; i < slide.length; i++) {
          getSlide(options.parentIndex).add(slide[i]); // Add it to the instance
          setSlide(slide[i], options.parentIndex);     // Store a reference to this childslide
        }
      }
      // Add as top-level slides
      else {
        log(signature + 'adding an array of top-level slides.');
        for (var i = 0; i < slide.length; i++) {
          slideContainer = createSlide();
          slideContainer.add(slide[i]);
          setSlide(slideContainer);         // Store a reference to this slide
          instance.addView(slideContainer); // Add it to the instance
        }
      }
    } else {
      // Add slide as a child
      if (isChildSlide) {
        log(signature + 'add slide as a child.');
        getSlide(options.parentIndex).add(slide); // Add it to the instance
        setSlide(slide, options.parentIndex);     // Store a reference to this childslide
      }
      // Add as top-level slide
      else {
        log(signature + 'adding a top-level slide.');
        slideContainer = createSlide();
        slideContainer.add(slide);
        setSlide(slideContainer);         // Store a reference to this slide
        instance.addView(slideContainer); // Add it to the instance
      }
    }

    setNumberOfSlides(); // Updated slides count
    log(signature + 'count: ' + JSON.stringify(count));
    log('');
  }

  /*
   * Getters and Setters
   ******************************************************************/

  /**
   * Gets the value of the `previousSlide` property.
   *
   * @method getPreviousSlide
   * @return {Slide || Object} Slide view if have previous slide, empty object otherwise.
   * @api private
   */
  function getPreviousSlide() {
    return previousSlide;
  }

  /**
   * Sets the value of the `previousSlide` property.
   *
   * @method setPreviousSlide
   * @param {Titanium.UI.View} slide New value for the property.
   * @return void
   * @api private
   */
  function setPreviousSlide(slide) {
    previousSlide = slide;
  }

  /**
   * Gets the value of the `currentSlide` property.
   *
   * @method getCurrentSlide
   * @return {Slide || Object} Slide view if have current slide, empty object otherwise.
   * @api private
   */
  function getCurrentSlide() {
    return currentSlide;
  }

  /**
   * Sets the value of the `currentSlide` property.
   *
   * @method setCurrentSlide
   * @param {Titanium.UI.View} slide New value for the property.
   * @return void
   * @api private
   */
  function setCurrentSlide(slide) {
    currentSlide = slide;
  }

  /**
   * Gets the value of the `nextSlide` property.
   *
   * @method getNextSlide
   * @return {Slide || Object} Slide view if have next slide, empty object otherwise.
   * @api private
   */
  function getNextSlide() {
    return nextSlide;
  }

  /**
   * Sets the value of the `nextSlide` property.
   *
   * @method setNextSlide
   * @param {Titanium.UI.View} slide New value for the property.
   * @return void
   * @api private
   */
  function setNextSlide(slide) {
    nextSlide = slide;
  }

  /**
   * Gets the slide at the specified indices.
   *
   * @method getSlide
   * @param {Number} x [optional] Horizontal index of the target slide, uses index of 0 if empty
   * @param {Number} y [optional] Vertical index of the target slide, uses index of 0 if empty
   * @return {Slide || Undefined} Slide view if have slide, undefined otherwise.
   * @api private
   */
  function getSlide(x, y) {
    return slideStack[(x ? x : 0)][(y ? y : 0)];
  }

  /**
   * Sets the slide at the specified indices.
   *
   * @method setSlide
   * @param {Slide} slide Slide to add reference for.
   * @param {Number} index Position of the target slide
   * @return void
   * @api private
   */
  function setSlide(slide, index) {
    if (index >= 0) {
      slideStack[index].push(slide);
    } else {
      slideStack.push([slide]);
    }
  }

  /**
   * Gets the number of the slides.
   *
   * @method getNumberOfSlides
   * @param {String} type (horizontal | vertical | all (default))
   * @param {Number} parentIndex Parent index of the slide.
   * @api private
   */
  function getNumberOfSlides(type, parentIndex) {
    if (type === 'horizontal') {
      return count.horizontalSlides;
    } else if (type === 'vertical' && count.horizontalSlides) {
      return parentIndex ? slideStack[parentIndex].length : 0;
    } else {
      return count.totalSlides;
    }
  }

  /**
   * Sets the number of the slides.
   *
   * @method setNumberOfSlides
   * @return void
   * @api private
   */
  function setNumberOfSlides() {
    count.horizontalSlides = slideStack.length;
    count.totalSlides      = 0;

    for (var i = 0; i < count.horizontalSlides; i++) {
      getSlide(i)._meta.index = i; // add index to all the top-level slides
      count.totalSlides += slideStack[i].length;
    }
  }

  /*
   * State Checks
   ******************************************************************/

  /**
   * Determines whether the previous slide exists.
   *
   * @method hasPreviousSlide
   * @return {Boolean} true if have previous slide, false otherwise.
   * @api private
   */
  function hasPreviousSlide() {
    return _.isEmpty(getPreviousSlide());
  }

  /**
   * Determines whether the next slide exists.
   *
   * @method hasNextSlide
   * @return {Boolean} true if have next slide, false otherwise.
   * @api private
   */
  function hasNextSlide() {
    return _.isEmpty(getNextSlide());
  }

  /**
   * Determines whether the current slide is the first slide.
   *
   * @method isFirstSlide
   * @return {Boolean} true if the current slide is the first slide, false otherwise.
   * @api private
   */
  function isFirstSlide() {
    return ! hasPreviousSlide();
  }

  /**
   * Determines whether the current slide is the last slide.
   *
   * @method isLastSlide
   * @return {Boolean} true if the current slide is the last slide, false otherwise.
   * @api private
   */
  function isLastSlide() {
    return ! hasNextSlide();
  }

  function isOverview() {}

  /**
   * Checks if the current or specified slide is vertical
   * (nested within another slide).
   *
   * @param {Titanium.UI.View} slide [optional] The slide to check orientation of
   * @return {Boolean} true if the slide is vertical, false otherwise.
   */
  function isVerticalSlide(slide) {
    // Prefer slide argument, otherwise use current slide
    slide = slide ? slide : getCurrentSlide();

    return slide && slide.getParentSlide() && (slide.getParentSlide()._meta.className !==  'topLevelSlide');
  }

  /*
   * Navigation
   ******************************************************************/

  function navigateLeft() {}

  function navigateRight() {}

  function navigateUp() {}

  function navigateDown() {}

  function navigateNext() {}

  function navigatePrevious() {}

  function toggleOverview() {}

  /**
   * Steps from the current point in the presentation to the
   * slide which matches the specified horizontal and vertical
   * indices.
   *
   * @param {Number} x Horizontal index of the target slide
   * @param {Number} y Vertical index of the target slide
   */
  function navigateTo(x, y) {
    // Update the references
    setPreviousSlide(getCurrentSlide());
    setCurrentSlide(getNextSlide());
    setNextSlide(hasNextSlide() ? getNextSlide() : {});

    instance.scrollTo(x, y);
  }

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
      Ti.API.log('[xcore.UI.Slidr] Set `debug` flag to `false` to turn off these logs.');
      Ti.API.log('--------------------------------------------------------------------');
      shouldPrintLogHeading = false;
    }

    if (config.debug) {
      Ti.API.log('[xcore.UI.Slidr] ' + str);
    }
  }

  return initialize;

})();

module.exports = Slidr;
