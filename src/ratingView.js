var Utilities = require('lib/xcore/utilities');

/**
 * RatingView component takes an initial
 * rating, and a maximum value for the rating, which
 * will be used to render the view.
 *
 * @module xcore.UI
 * @submodule RatingView
 * @type public
 *
 * @param  {Number} initialRating Initial rating value
 * @param  {Number} max           Maximum rating value
 * @param  {Object} options       The configuration object to customize `RatingView`
 * @return {Ti.UI.View}           The complete `RatingView`, ready to be added to any parent view
 */
function RatingView(initialRating, max, options) {
  var options = Utilities.defaults(options, {
    touchEnabled:  true,
    color:         '#2000',
    selectedColor: '#000',
    outline:       true,
    shadowColor:   'transparent',
    shadowOffset:  {x: 0, y: 1},
    size:          18,
    padding:       3
  });

  // Create and populate the rating object
  var self = Ti.UI.createView({
    layout: 'horizontal',
    width:  Ti.UI.SIZE,
    height: Ti.UI.SIZE
  });

  if (options.top) { self.top = options.top; }

  /*
   * Instance variable indicating rating.
   * This data is private to the object, since it is 
   * declared in this constructor function
   */
  var rating;

  /*
   * Another instance variable
   * containing an array of 
   * LabelView objects representing
   * the stars of the rating
   */
  var stars = []; 

  /*
   * Create the necessary view structures to represent the
   * current value of the rating
   */
  for (var i = 0; i < max; i++) {
    var star = Ti.UI.createLabel({
      text:         '★',
      font:         {fontFamily: 'Helvetica Neue', fontSize: options.size, fontWeight: 500},
      left:         options.padding,
      shadowColor:  options.shadowColor,
      shadowOffset: options.shadowOffset
    });

    if (options.touchEnabled) {
      (function() {
        /*
         * we need to capture the value of `i`
         * for use in click handler functions
         * on our image views.  To do this, we
         * use a closure (this self-calling function)
         */
        var index = i;
        star.addEventListener('click', function() {
          setRating(index + 1);
        });
      })();
    }
    stars.push(star);
    self.add(star);
  }

  /*
   * Inner function to update view to reflect the current rating
   */
  function setRating(newRating) {
    rating = newRating;

    self.fireEvent('ratingChanged', {
      currentValue: rating
    });

    for (var i = 0, l = stars.length; i < l; i++) {
      if (i >= rating) {
        if (options.outline) {
          stars[i].text  = '☆';
        }

        stars[i].color = options.color;
      }
      else if (rating > i && rating < i+1) {
        stars[i].color = options.selectedColor;
      }
      else {
        stars[i].color = options.selectedColor;
      }
    }

  }

  self.changeRating = setRating;

  // Initialize view
  setRating(initialRating);

  return self;
}

module.exports = RatingView;
