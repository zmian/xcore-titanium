var GridView  = require('lib/xcore/gridView');
var Utilities = require('lib/xcore/utilities');

/**
 * CarouselView wrapper function to create grid, vertical and horizontal carousels.
 * 
 * @module xcore.UI
 * @submodule CarouselView
 * @type public
 * @requires xcore.UI.GridView, ItemViews.ThumbView
 *
 * @param    {Object}      options            The configuration object to customize `GridCarousel`
 * @param    {String}      option.layout      Carousel layout: grid, vertical or horizontal (default).
 * @param    {String}      option.type        Type of navigation; look at types within this function for more details.
 * @param    {Object}      option.data        The data object
 * @param    {Function}    option.callback    Callback function when a cell is clicked
 * 
 * @return   {Ti.UI.ScrollView}               The complete `CarouselView`, ready to be added to any parent view
 */
function CarouselView(options) {
  // Extract options
  options || (options = {});

  if (! options.data && ! options.views) Ti.API.error('[xcore.UI.CarouselView] `data` or `views` array not found.');

  /*
   * Default options
   * These will be overwritten by the user options
   */
  var defaults = {
    debug:        false, // Set to true to see the properties of options
    dynamicWidth: false, // Flag to enable different sizes of cell items
    cellPadding:  0,     // Space around each cell (top, bottom, left and right)
    rowPadding:   10,    // Space around each row (top, bottom, left and right)
    rowMargin:    0,     // Space in between two rows
    columns:      3,     // Number of columns
    rows:         0,     // Number of rows
    zIndex:       9999,  // Grid stack-level; similar to CSS
    views:        [],    // An array of Titanium views
    data:         [],    // An array of JSON data
    cell:         {},    // Options for each cell
    cellName:     '',    // Module name for cell generation
    set:          function() {
      /**
       * If `options.views` is empty (it doesn't have any views)
       * Call `CarouselViewCell` module to create the views using it's default options
       */
      if (this.views.length === 0) {
        this.views = CarouselViewCell({
          data:     this.data,
          cell:     this.cell,
          cellName: this.cellName
        });
      }

      if (! this.dynamicWidth) {
        // Calculate cell width and cell height based on the views passed
        this.cellWidth  = this.cellWidth  || this.views[0].width;
        this.cellHeight = this.cellHeight || this.views[0].height;
      }

      /**
       * options.layout
       *
       * `grid`
       * `vertical`
       * `horizontal` - default
       */
      switch(this.layout) {
        case 'grid':
          this.width  || (this.width = '100%');
          // Set grid height equal to the first two rows
          this.height || (this.height = (this.cellHeight + this.rowMargin + this.cellPadding) * 2);
          this.cellMargin = (typeof this.cellMargin === 'undefined') ? 1 : this.cellMargin;
          this.verticalBounce = (typeof this.verticalBounce === 'undefined') ? true : this.verticalBounce;
          this.fitToWidth = (typeof this.fitToWidth === 'undefined') ? true : this.fitToWidth;
          // Set the default position to bottom
          if (typeof this.top === 'undefined') {
            this.bottom || (this.bottom = 0);
          }
          break;
        case 'vertical':
          this.columns = 1;
          //this.width  || (this.width = this.cellWidth + this.cellPadding);
          this.width  || (this.width  = 'auto');
          this.height || (this.height = '100%');
          this.cellMargin = (typeof this.cellMargin === 'undefined') ? 1 : this.cellMargin;
          this.verticalBounce = (typeof this.verticalBounce === 'undefined') ? true : this.verticalBounce;
          break;
        default:
          this.rows = 1;
          this.width  || (this.width = '100%');
          this.height || (this.height = 'auto');
          this.cellMargin = (typeof this.cellMargin === 'undefined') ? 10 : this.cellMargin;
          this.rowMarginTop    = (typeof this.rowMarginTop    === 'undefined') ? this.cellMargin : this.rowMarginTop;
          this.rowMarginBottom = (typeof this.rowMarginBottom === 'undefined') ? this.cellMargin : this.rowMarginBottom;
          this.rowMarginLeft   = (typeof this.rowMarginLeft   === 'undefined') ? this.cellMargin : this.rowMarginLeft;
          this.rowMarginRight  = (typeof this.rowMarginRight  === 'undefined') ? this.cellMargin : this.rowMarginRight;
          this.horizontalBounce = (typeof this.horizontalBounce === 'undefined') ? true : this.horizontalBounce;
          // Set the default position to top
          if (typeof this.bottom === 'undefined') {
            this.top || (this.top = 0);
          }
      }
    }
  };

  /*
   * Overwrite default options
   * with user provided ones
   * and merge them into `options`.
   */
  var options = _.extend(defaults, options);

  // Set the dynamic values
  options.set();

  /*
   * We set up the values above (no longer need it) 
   * and we don't want to pass this function to
   * Titanium view so we delete it
   */
  delete options.set;

  // Dynamically calculate cell width if we are working with grid based carousel
  if (options.layout == 'grid' && options.fitToWidth) {
    /*
     * Formula
     *
     * (app width * (1 / number of columns)) - ((1 / number of columns) * spacing between columns)
     */
    var _totalWidth = Math.floor(App.SECTION_WIDTH * (1/options.columns) - ((1/options.columns) * options.cellMargin));
    options.cellPadding = _totalWidth - options.cellWidth;

    // If the orientation changes update the grid cells
    Ti.Gesture.addEventListener('orientationchange', function(e) {
      _totalWidth = Math.floor(App.SECTION_WIDTH * (1/options.columns) - ((1/options.columns) * options.cellMargin));
      options.cellPadding = _totalWidth - options.cellWidth;

      // Update the grid
      self.update(options);
    });
  }

  // Create module instance and pass the final options
  var self = GridView(options);

  /*
   * Function that logs all `options` values.
   * It is executed when `options.debug` is set to true,
   * the results are displayed in the console window.
   */
  var propertiesDump = function() {
    Ti.API.log('');
    Ti.API.log('[xcore.UI.CarouselView] Set `DEBUG` flag to `false` to turn off these logs.');
    Ti.API.log('---------------------------------------------------------------------------');
    _.each(options, function(value, key, list) {
      if (key === 'data') {
        Ti.API.log('[xcore.UI.CarouselView]   ' + key + ': ' + JSON.stringify(value));
      }
      else {
        Ti.API.log('[xcore.UI.CarouselView]   ' + key + ': ' + value);
      }
    });
    Ti.API.log('---------------------------------------------------------------------------');
    Ti.API.log('');
  };

  if (options.debug) propertiesDump();

  // Return the view for further modifications and adding it to the parent view
  return self;
}

/**
 * A helper function to create `CarouselViewCell`.
 */
function CarouselViewCell(options) {
  var options = Utilities.defaults(options, {
    data:     [],
    cell:     {},
    cellName: 'ItemViews.ThumbView',
    // Set function is temp until `Utilities.defaults` is fixed 
    // to respect `defaults` if the user options are null or empty
    set:      function() {
      if (! this.data)     this.data     = [];
      if (! this.cell)     this.cell     = {};
      if (! this.cellName) this.cellName = 'ItemViews.ThumbView';
    }
  });

  var cells = [];
  _.map(options.data, function(item, index) {
    options.cell.data = item; // Add data item of a cell

    var cellView = Utilities.executeFunctionByName(options.cellName, this, options.cell);
    cells.push(cellView);
  });

  return cells;
}

exports = {
  CarouselView:     CarouselView,
  CarouselViewCell: CarouselViewCell
};
