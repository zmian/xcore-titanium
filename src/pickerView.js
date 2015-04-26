/**
 * A module to create multiple columns picker
 * Number of columns are automatically calculated within picker based on `options.data` param
 * 
 * @module xcore.UI
 * @submodule PickerView
 * @type public
 * 
 * @param    {Object}      options            The configuration object to customize `PickerView`
 * @param    {String}      option.layout      Carousel layout: grid, vertical or horizontal (default).
 * @param    {String}      option.type        Type of navigation; look at types within this function for more details.
 * @param    {Array}       option.data        An array of objects
 * @param    {Function}    option.callback    Callback function when a column value changes
 * 
 * @return   {Ti.UI.View}                     The complete `PickerView`, ready to be added to any parent view
 * 
 * @example
 *   var data: = {
 *     0: [{title: 1},     {title: 2},     {title: 3}],       // data for column 1
 *     1: [{title: 'One'}, {title: 'Two'}, {title: 'Three'}]  // data for column 2
 *   };
 * 
 *   var picker = PickerView({data: data, callback: function(e) {...} });
 * 
 * @todo
 * iPad    - the picker is added to `Ti.UI.Popover`
 * iPhone  - the picker is added to `Ti.UI.View`
 * Android - 
 */
function PickerView(options) {
  // Extract options
  options || (options = {});

  // Set to true to see the properties of options
  var DEBUG = false;

  var picker = Ti.UI.createPicker({
    selectionIndicator: true
  });

  // Create `x` number of columns
  // Number of columns are determined based on the `options.data`
  for (var x = 0, xlen = _.size(options.data); x < xlen; x++) {
    var column = Ti.UI.createPickerColumn();
    picker.add(column);

    // Create `x` number of rows
    for (var y = 0, ylen = options.data[x].length; y < ylen; y++) {
      // If title field is not string.
      // Convert it to string and log the error in the console.
      // This can help during development and production for 
      // any incorrect input data.
      if (! _.isString(options.data[x][y].title)) {
        options.data[x][y].title = options.data[x][y].title.toString();
        Ti.API.error('[xcore.UI.PickerView] args options.data.' + x + '[' + y + '].title value must be a string.');
      }
      // If `options.data.value` field is `undefined`, make it same as `options.data.title` field
      if (typeof options.data[x][y].value === 'undefined') {
        options.data[x][y].value = options.data[x][y].title;
      }
      var row = Ti.UI.createPickerRow(options.data[x][y]);
      column.addRow(row);
    }
  }

  // Event Listener on `change` selection
  picker.addEventListener('change', function(e) {
    if (options.callback) {
      options.callback(e);
    }
  });

  /*
   * Function that logs all `options` values.
   * It is executed when `options.debug` is set to true,
   * the results are displayed in the console window.
   */
  var propertiesDump = function() {
    Ti.API.debug('[xcore.UI.PickerView] Set `DEBUG` flag to `false` to turn off these logs.');
    _.each(options, function(value, key, list) {
      if (key == 'data') {
        Ti.API.debug(key + ': ' + JSON.stringify(value));
      }
      else {
        Ti.API.debug(key + ': ' + value);
      }
    });
  };

  if (DEBUG) propertiesDump();

  return picker;
}

module.exports = PickerView;
