/*!
 * @module xcore.Base
 * @version 1.0
 * @author Zeeshan Mian | @zmian
 * @link https://github.com/zmian/xcore-titanium
 * @license MIT
 */

var _       = require('lib/underscore');
var Toolbox = require('lib/toolbox');

var Base = module.exports = Toolbox.Base.extend({

  constructor: function() {
  },

  defaults: {},

  name: 'xcore.BaseObject',

  toName: function() {
    return this.name;
  },

  logger: function() {
    Ti.API.log('');
    Ti.API.log('[' + this.toName() + '] Set `DEBUG` flag to `false` to turn off these logs.');
    Ti.API.log('-----------------------------------------------------------------------');
    Ti.API.log('[' + this.toName() + '] Number of Rows:    ' + _views.rows.length);
    Ti.API.log('[' + this.toName() + '] Number of Cells:   ' + _views.cells.length);
    Ti.API.log('[' + this.toName() + '] Number of Columns: ' + _views.columns.length);
    Ti.API.log('[' + this.toName() + '] Grid width:        ' + self.width);
    Ti.API.log('[' + this.toName() + '] Grid height:       ' + self.height);
    Ti.API.log('[' + this.toName() + '] options:           {');
    _.each(this.defaults, function(value, key, list) {
      Ti.API.log('[' + this.toName() + ']   ' + key + ': ' + value);
    });
    Ti.API.log('[' + this.toName() + '] };');
    Ti.API.log('-----------------------------------------------------------------------');
    Ti.API.log('');
  }

});
