/**
 * ┌───────────────────┐
 * |     GridView      |
 * |   ┌───┬───┬───┐   |
 * |   | 1 | 2 | 3 |   |
 * |   ├───┼───┼───┤   |
 * |   | 4 | 5 | 6 |   |
 * |   ├───┼───┼───┤   |
 * |   | 7 | 8 | 9 |   |
 * |   └───┴───┴───┘   |
 * |                   |
 * └───────────────────┘
 *
 * ┌───────────────────┐
 * |        Row        |
 * |   ┌───┬───┬───┐   |
 * |   | 1 | 2 | 3 |   |
 * |   └───┴───┴───┘   |
 * |                   |
 * └───────────────────┘
 *
 * ┌───────────────────┐
 * |   Column / Cell   |
 * |       ┌───┐       |
 * |       | 1 |       |
 * |       └───┘       |
 * |                   |
 * └───────────────────┘
 *
 * Generic grid view. It should not be modified for each app.
 * It was written to accommodate grid based layouts.
 * It can be used to construct: Grid, Vertical, or Horizontal based scroll views.
 * Simply think of it, like any other Titanium view. E.g., Ti.UI.createView
 *
 * This module uses jQuery plugin style initalization of defaults with user options merged.
 * @link http://jquery-howto.blogspot.com/2009/01/how-to-set-default-settings-in-your.html
 *
 * This module is very similar to iOS Collection View
 * @link http://developer.apple.com/library/ios/#documentation/userexperience/conceptual/mobilehig/UIElementGuidelines/UIElementGuidelines.html%23//apple_ref/doc/uid/TP40006556-CH13-SW41
 *
 * @module xcore.UI
 * @submodule GridView
 * @type public
 *
 * @param    {Object}      options            The configuration object to customize `GridView`
 * @param    {Array}       option.views       An array of Titanium views
 * @param    {Function}    option.callback    Callback function when a cell is clicked
 *
 * @return   {Ti.UI.ScrollView}               The complete `GridView`, ready to be added to any parent view
 *
 * @link http://developer.appcelerator.com/question/67631
 *
 * @example
 *  var gridView = xcore.UI.GridView({
 *    views:                [],             // An array of Titanium views (required)
 *    width:                '100%',         // Grid width
 *    height:               'auto',         // Grid height, `auto` will trigger the grid to calculate it's size
 *    cellWidth:            200,            // Cell width
 *    cellHeight:           150,            // Cell height
 *    cellPadding:          10,             // Space around each cell (top, bottom, left and right)
 *    cellMargin:           1,              // Space in between two columns (top, bottom, left and right)
 *    rowMargin:            1,              // Space in between two rows (top, bottom)
 *    rowMarginTop:         20,             // Space to the top of the row (before first column of the grid)
 *    rowMarginBottom:      20,             // Space to the bottom of the row (before last column of the grid)
 *    rowMarginLeft:        20,             // Space to the left of the row (before first column of the each row)
 *    rowMarginRight:       20,             // Space to the right of the row (after last column of the each row)
 *    columns:              3,              // Number of columns
 *    rows:                 1,              // Number of rows
 *    zIndex:               9999,           // Grid stack-level; similar to CSS
 *    bottom:               0,              // Set the grid position to bottom
 *    backgroundImage:      'images/bg.png' // Grid background image
 *    dynamicWidth:         false,          // Each cell has different width
 *    selectedStateEnabled: true,           // Toggle selected state indicator
 *  });
 *
 * @api
 * - `setSelectedState` and `setNormalState`
 *    Each view in the views array can declare `setSelectedState` and `setNormalState` method
 *    and enable `selectedStateEnabled` option to indicate currently clicked item.
 * - Call `clearSelectedState` on the gridView to clear any selected state.
 *
 * @todo
 * - Create documentation with example and it's public api
 * - maybe `dynamicWidth` should be renamed to `hasUniqueCells` to accomodate 
 *   any other changes needed for dynamic layer.
 * - Feature: `carouselView.views[0].fireEvent('singletap');` prevent code like by 
 *   enabling and api like this maybe `carouselView.firstElement.fireEvent('singletap');`
 *   if data || views arrays are empty... just create dummy object and send that back...
 * - Feature: move the error logic here to `GridView` from `CarouselView`
 *
 * @issues
 * - All row padding options only works for one row (Horizontal).
 * - `rowMarginTop` and `rowMarginBottom` will center the content
 *    it'll make the height bigger to accomodate the padding. It's a Hack.
 * - Adjust Grid height and width when borderColor is set...
 */
function GridView(options) {
  /*
   * Variable Declarations
   */

  // Private instance variable containing an array of views
  // objects representing the rows, cells, and columns of the grid
  var _views = {
    rows:    [],            // rows as Titanium views
    cells:   options.views, // these are already Titanium views provided by the user
    columns: []             // columns as Titanium views
  };

  // Private variables to store indexes of currently render views
  var _cellIndex   = 0;
  var _rowHeight   = 0;
  var _columHeight = 0;

  // Private variables to store reference to currently clicked cell
  var _selectedCell = null;

  var _p = function (densityPixels) {
    return densityPixels * Ti.Platform.displayCaps.dpi / 160;
  };

  /*
   * Default options
   * These will be overwritten by the user options
   */
  var defaults = {
    debug:                false,      // Set to true to see the properties of options
    width:                Ti.UI.SIZE, // Grid width
    height:               Ti.UI.SIZE, // Grid height
    contentWidth:         'auto',     // for iOS
    contentHeight:        'auto',     // for iOS
    scrollType:           'vertical', // for Android
    cellWidth:            _p(95),     // Cell width
    cellHeight:           _p(95),     // Cell height
    cellPadding:          0,          // Space around each cell (top, bottom, left and right)
    cellMargin:           _p(10),     // Space in between two columns
    rowMargin:            _p(10),     // Space in between two rows
    columns:              3,          // Number of columns
    borderWidth:          0,          // Explicitly turning off border
    rows:                 0,          // Number of rows
    views:                [],         // An array of Titanium views
    _ignoreClicks:        true,       // Ignore clicks on the grid, deal with only cell clicks, @todo THIS SHOULD be moved out of options.
    dynamicWidth:         false,      // Each cell has different width
    selectedStateEnabled: false,      // Toggle selected state indicator
    set:                  function() {
      /*
       * Layout property should not be defined by the user.
       * It is automatically defined in appropriate cases (see case 2).
       * If defined inappropriately this screws up the layout of the grid.
       * This is just housekeeping. Better safe than sorry ;)
       */
      if ('layout' in this) {
        delete this.layout;
      }

      /*
       * Case 1:
       * Number of `rows` is inappropriate: 0 or a string
       */
      if ( this.rows < 1 || (! _.isNumber(this.rows)) ) {
        this.rows = this.views.length / this.columns;
      }

      /*
       * Case 2:
       * Number of `rows` is 1
       * then, there must be enough columns to accommodate all the views
       */
      if ( this.rows === 1 ) {
        this.rows    = 1;
        this.columns = this.views.length;
        this.layout  = 'horizontal';
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

  // Create module instance and pass the final options
  var self = Ti.UI.createScrollView(options);

  /*
   * Creates single row and returns it
   * it takes the index value if we create multiple rows
   */
  var createRow = function(index) {
    var row = Ti.UI.createView({
      layout:        'horizontal',
      focusable:     false,
      top:           index * (options.cellHeight + options.rowMargin),
      height:        options.cellHeight + options.rowMargin,
      _rowIndex:     index,
      _ignoreClicks: true
    });

    return row;
  };

  /*
   * Creates single column and returns it
   * it takes the index value if we create multiple columns
   */
  var createColumn = function(index, eachCellWidth) {
    var column = Ti.UI.createView({
      left:          (index === 0) ? 0 : options.cellMargin,
      width:         (options.dynamicWidth ? eachCellWidth : options.cellWidth)  + options.cellPadding,
      height:        options.cellHeight + options.cellPadding,
      _columnIndex:  index,
      _ignoreClicks: false
    });

    // If hover state properties exists enable this functionality
    if (options.cellBackgroundColor || options.cellBackgroundSelectedColor || options.cellBackgroundImage || options.cellBackgroundSelectedImage) {
      var backgroundColor         = options.cellBackgroundColor          || 'transparent';
      var backgroundSelectedColor = options.cellBackgroundSelectedColor  || 'transparent';
      var backgroundImage         = options.cellBackgroundImage          || undefined;
      var backgroundSelectedImage = options.cellBackgroundSelectedImage  || undefined;

      column.backgroundImage = backgroundImage;
      column.backgroundColor = backgroundColor;

      if (options.cellBackgroundSelectedColor || options.cellBackgroundSelectedImage) {
        column.addEventListener('touchstart', function() {
          column.backgroundImage = backgroundSelectedImage;
          column.backgroundColor = backgroundSelectedColor;
        });

        column.addEventListener('touchend', function() {
          column.backgroundImage = backgroundImage;
          column.backgroundColor = backgroundColor;
        });

        column.addEventListener('touchmove', function() {
          column.backgroundImage = backgroundImage;
          column.backgroundColor = backgroundColor;
        });
      }
    }

    return column;
  };

  /*
   * Case 1:
   * Single row and multiple columns (horizontal)
   *
   * If only one row then skip creating the row
   * and create columns and add it to the view
   * cellIndex: (num of columns * rowIndex(y)) + columnIndex(x) = (options.columns * y) + x;
   */
  if (options.rows === 1) {
    for (var x = 0; x < options.columns; x++) {
      if (options.views[_cellIndex]) {

        // Create Border
        if (x !== 0 && options.borderColor) self.add(createBorder(1, options.borderColor, 'left'));

        options.views[_cellIndex].cellIndex = _cellIndex;
        var column = createColumn(x, options.views[_cellIndex].width);
        column.add(options.views[_cellIndex]);
        _views.columns.push(column);
        self.add(column);
        _cellIndex++;
      }
    }
  }
  /*
   * Case 2:
   * Multiple rows and columns (vertical or grid)
   */
  else {
    for (var y = 0; y < options.rows; y++) {
      var row = createRow(y);

      // Create Border
      if (y !== 0 && options.borderColor) self.add(createBorder(1, options.borderColor, 'top'));

      for (var x = 0; x < options.columns; x++) {
        if (options.views[_cellIndex]) {

          // Create Border
          if (x !== 0 && options.borderColor) self.add(createBorder(1, options.borderColor, 'left'));

          options.views[_cellIndex].cellIndex = _cellIndex;
          var column = createColumn(x, options.views[_cellIndex].width);
          column.add(options.views[_cellIndex]);
          _views.columns.push(column);
          row.add(column);
          _cellIndex++;
        }
      }
      _views.rows.push(row);
      self.add(row);
    }
  }

  /*
   * Row Padding Right
   * If paddingRight is specified add empty view to the end of all views
   *
   * Note: `height: options.cellHeight` is there to ensure that height is 
   * respected when explicitly declared. Some areas may have dynamic GridView:
   * I.e., sometimes it's there and sometimes it's not. This ensures
   * that we save the declared space for the gridView.
   */
  if (options.rowMarginRight) {
    options.rowMarginTop    || (options.rowMarginTop = 0);
    options.rowMarginBottom || (options.rowMarginBottom = 0);
    self.add(Ti.UI.createView({width: options.rowMarginRight, height: options.cellHeight + options.rowMarginTop + options.rowMarginBottom}));
  }

  /*
   * Calculate the grid width and height based on the Titanium views passed using `options.views`
   * User can use `auto` keyword to automatically calculate the grid size
   */
  var setGridDimensions = function() {
    if (_views.columns.length !== 0) {
      if (options.width  === 'auto') self.width  = options.cellWidth  ? (options.cellWidth  + options.cellPadding) : _views.columns[0].toImage().width;
      if (options.height === 'auto') self.height = options.cellHeight ? (options.cellHeight + options.cellPadding) : _views.columns[0].toImage().height * options.rows;
    } else {
      if (options.width  === 'auto') self.width  = Ti.UI.SIZE;
      if (options.height === 'auto') self.height = Ti.UI.SIZE;
    }

    /*
     * Add row padding
     * Note: It's only supported if there is only one row (horizontal)
     */
    if (options.rows === 1 && _views.columns.length !== 0) {
      // Row Padding Top
      if (options.rowMarginTop) {
        //self.top = options.rowMarginTop;

        // Now update the grid width/height
        self.height += options.rowMarginTop;
      }

      // Row Padding Bottom
      if (options.rowMarginBottom) {
        //self.bottom = options.rowMarginBottom;
        
        // Now update the grid width/height
        self.height += options.rowMarginBottom;
      }

      // Row Padding Left
      // Change left margin to mimic padding
      if (options.rowMarginLeft) _views.columns[0].left = options.rowMarginLeft;
    }    
  };

  /*
   * A function to update the grid row dimensions: top and height
   */
  var setRowDimensions = function() {
    if (_views.rows.length !== 0 && _views.columns.length !== 0) {
      _columHeight = options.cellHeight ? (options.cellHeight + options.cellPadding) : _views.columns[0].toImage().height;

      // Update all the rows
      for (var y = 0; y < _views.rows.length; y++) {
        _views.rows[y].top    = y * (_columHeight + options.rowMargin);
        _views.rows[y].height = _columHeight;
      }
    }
  };

  /*
   * A function to update the grid cell dimensions: width and height
   */
  var setCellDimensions = function(cellWidth, cellHeight) {
    options.cellWidth  = options.cellWidth || cellWidth;
    options.cellHeight = options.cellWidth || cellHeight;

    // Update cells and columns
    // Number of cells and columns are always the same
    for (var x = 0; x < _views.columns.length; x++) {
      _views.cells[x].width    = options.cellWidth;
      _views.cells[x].height   = options.cellHeight;
      _views.columns[x].width  = options.cellWidth  + options.cellPadding;
      _views.columns[x].height = options.cellHeight + options.cellPadding;
    }

    // Update rows
    setRowDimensions();
    // for (var y = 0; y < _views.rows.length; y++) {
      // _views.rows[y].top    = y * (options.cellHeight + options.rowMargin);
      // _views.rows[y].height = options.cellHeight + options.rowMargin;
    // }

    // Return the changed properties object
    return {
      cellWidth:  options.cellWidth,
      cellHeight: options.cellHeight
    };
  };

  /*
   * Attach event listener to the grid (for performance reasons)
   * instead of attaching it to every row/column/cell
   * User can listen to it using `options.callback` property
   */
  self.addEventListener('singletap', function(e) {
    var source = e.source, column = {};

    if (source._ignoreClicks) {
      return;
    }

    // Find the clicked cell
    if (typeof source.cellIndex !== 'undefined') {

    } else if (typeof source._columnIndex !== 'undefined') {
      source = source.children[0];
    } else if (typeof source.parent.cellIndex !== 'undefined') {
      source = source.parent;
    } else {
      Ti.API.error('[xcore.UI.GridView] Unable to find clicked cell.');
      Ti.API.error('Event Trace: ' + JSON.stringify(e));
      return;
    }

    column = source.parent;

    // Fire the cell callback click event
    if (options.callback) {
      options.callback({
        x:           e.x,
        y:           e.y,
        type:        e.type,
        rowIndex:    column.parent._rowIndex || 0,
        columnIndex: column._columnIndex || 0,
        cellIndex:   source.cellIndex,
        source:      source
      });
    }

    /*
     * Turn on the selected state for current cell
     * Make sure `setSelectedState` and `setNormalState` methods
     * exists for each cell.
     */
    if (options.selectedStateEnabled && source.setSelectedState && source.setNormalState) {
      // If there is a selected cell, then deselect the selected cell 
      // by call its `setNormalState` method.
      if (_selectedCell !== null) { _selectedCell.setNormalState(); }

      // Now set the clicked cell to selected cell and run `setSelectedState` method
      _selectedCell = source;
      _selectedCell.setSelectedState();
    }
  });

  /**
   * A helper method to update the grid
   *
   * @method
   * @api public
   */
  self.update = function(options) {
    var cellDimensions = setCellDimensions(options.cellWidth, options.cellHeight);

    // setRowDimensions();
    // setGridDimensions();

    self.fireEvent('update', cellDimensions);
  };

  if (options.selectedStateEnabled) {
    self.clearSelectedState = function() {
      // If there is a selected cell, then deselect the selected cell 
      // by calling its `setNormalState` method.
      if (_selectedCell !== null) { _selectedCell.setNormalState(); }
    };
  }

  setRowDimensions();
  setGridDimensions();

  /*
   * Function that logs all `options` values.
   * It is executed when `options.debug` is set to true,
   * the results are displayed in the console window.
   */
  var propertiesDump = function() {
    Ti.API.log('');
    Ti.API.log('[xcore.UI.GridView] Set `DEBUG` flag to `false` to turn off these logs.');
    Ti.API.log('-----------------------------------------------------------------------');
    Ti.API.log('[xcore.UI.GridView] Number of Rows:    ' + _views.rows.length);
    Ti.API.log('[xcore.UI.GridView] Number of Cells:   ' + _views.cells.length);
    Ti.API.log('[xcore.UI.GridView] Number of Columns: ' + _views.columns.length);
    Ti.API.log('[xcore.UI.GridView] Grid width:        ' + self.width);
    Ti.API.log('[xcore.UI.GridView] Grid height:       ' + self.height);
    Ti.API.log('[xcore.UI.GridView] options:           {');
    _.each(options, function(value, key, list) {
      Ti.API.log('[xcore.UI.GridView]   ' + key + ': ' + value);
    });
    Ti.API.log('[xcore.UI.GridView] };');
    Ti.API.log('-----------------------------------------------------------------------');
    Ti.API.log('');
  };

  if (options.debug) propertiesDump();

  /**
   * Gets the cell at the specified index.
   *
   * @method getCell
   * @param {Number} index [optional] index of the target cell, uses index of 0 if empty
   * @return {Ti.UI.View} Cell view if have cell, empty Ti.UI.VIEW otherwise with error property.
   * @api public
   */
  self.getCell = function(index) {
    var cell = self.views[index || 0];

    if (! cell) {
      cell = Ti.UI.createView();
      cell.error = true;
    }

    return cell;
  };

  // Return the view for further modifications and adding it to the parent view
  return self;
}

/**
 * Copied from unfinished `FlexView` module
 * Maybe this should be available under xcore namespace.
 */
function createBorder(width, color, side) {
  var borderView = ui.view({
    width:           '100%',
    height:          width,
    backgroundColor: color
  });

  if (side === 'top')    { borderView.top    = 0; }
  if (side === 'bottom') { borderView.bottom = 0; }
  if (side === 'left')   { borderView.left   = 0; borderView.width = width; borderView.height = '100%'; }
  if (side === 'right')  { borderView.right  = 0; borderView.width = width; borderView.height = '100%'; }

  return borderView;
}

module.exports = GridView;
