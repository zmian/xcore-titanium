var Utilities = require('lib/xcore/utilities');

/*!
 * @module FlexView
 * @description A module that extends `Ti.UI.View` to enable CSS-like properties.
 * @version 1.0
 * @author Zeeshan Mian | @zmian
 * @link https://github.com/zmian/xcore-titanium
 * @license MIT
 */

/**
 * A module that extends `Ti.UI.View` to enable CSS-like properties.
 *
 * paddingTop, paddingRight, paddingBottom, paddingLeft
 * borderTop,  borderRight,  borderBottom,  borderLeft
 *
 * @module FlexView
 * @type public
 * @requires Ti.UI.View
 *
 * @param {Object}   options         The configuration object to customize `FlexView`
 * @param {String}   option.layout   Carousel layout: grid, vertical or horizontal (default).
 * @param {String}   option.type     Type of navigation; look at types within this function for more details.
 * @param {Object}   option.data     The data object
 * @param {Function} option.callback Callback function when a cell is clicked
 * @return {Ti.UI.ScrollView} An instance of `FlexView`
 */
function FlexView(options) {
  // Extract options
  options || (options = {});

  /*
   * Default options
   * These will be overwritten by the user options
   */
  var defaults = {
    borderColor: '#000',
    borderWidth: 0
  };

  /*
   * Overwrite default options
   * with user provided ones
   * and merge them into `options`.
   */
  var options = _.extend(defaults, options);

  var flexView = ui.view({
    width:  Ti.UI.SIZE,
    height: Ti.UI.SIZE,
    backgroundColor: 'blue'
  });

  var contentView = ui.view(options);
  flexView.add(contentView);

  // Create requested border
  if (typeof options.borderTopWidth    !== 'undefined') contentView.add(createBorderView(options.borderTopWidth,    options.borderColor, 'top'));
  if (typeof options.borderBottomWidth !== 'undefined') contentView.add(createBorderView(options.borderBottomWidth, options.borderColor, 'bottom'));
  if (typeof options.borderLeftWidth   !== 'undefined') contentView.add(createBorderView(options.borderLeftWidth,   options.borderColor, 'left'));
  if (typeof options.borderRightWidth  !== 'undefined') contentView.add(createBorderView(options.borderRightWidth,  options.borderColor, 'right'));

  return flexView;
}

/**
 * A helper function to create a `BorderView`.
 *
 * @module BorderView
 * @type public
 * @requires Ti.UI.View
 *
 * @param {String} width Border width
 * @param {String} color Border color
 * @param {String} side Border side: top (default), bottom, left, or right
 * @return {Ti.UI.View} An instance of `BorderView`
 */
function createBorderView(width, color, side) {
  var borderView = ui.view({
    width:           '100%',
    height:          width,
    backgroundColor: color
  });

  switch(side) {
    case 'left':
      borderView.left   = 0; borderView.width = width; borderView.height = '100%';
      break;
    case 'right':
      borderView.right  = 0; borderView.width = width; borderView.height = '100%';
      break;
    case 'bottom':
      borderView.bottom = 0;
      break;
    default:
      borderView.top    = 0;
  }

  return borderView;
}

/**
 * A helper function to create a `ButtonView`.
 *
 * @module ButtonView
 * @type public
 * @requires Ti.UI.View, Ti.UI.Button
 *
 * @param {Object} options The configuration object to customize `ButtonView`
 * @return {Ti.UI.Button} An instance of `ButtonView`
 */
function createButtonView(options) {
  var options = Utilities.defaults(options, {
    title: ' ',
    backgroundPaddingTop:    6,
    backgroundPaddingRight:  6,
    backgroundPaddingBottom: 6,
    backgroundPaddingLeft:   6
  });

  var buttonView = Ti.UI.createButton(options);

  var labelView = Ti.UI.createLabel({
    text:                    options.title,
    width:                   Ti.UI.SIZE,
    height:                  Ti.UI.SIZE,
    backgroundPaddingTop:    options.backgroundPaddingTop,
    backgroundPaddingRight:  options.backgroundPaddingRight,
    backgroundPaddingBottom: options.backgroundPaddingBottom,
    backgroundPaddingLeft:   options.backgroundPaddingLeft
  });
  buttonView.add(labelView);

  // Override some properties to ensure the view behaves as expected.
  buttonView.applyProperties({
    width:  Ti.UI.SIZE,
    height: Ti.UI.SIZE,
    title:  ' '
  });

  return buttonView;
}

exports = {
  FlexView:         FlexView,
  createBorderView: createBorderView,
  createButtonView: createButtonView
};
