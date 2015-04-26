/*!
 * @module Request
 * @description A module for making HTTP requests.
 * @version 1.0
 * @author Zeeshan Mian | @zmian
 * @link https://github.com/zmian/xcore-titanium
 * @license MIT
 */

var _       = require('lib/underscore');
var Toolbox = require('lib/toolbox');

var Request = module.exports = Toolbox.Base.extend({

  constructor: function(host) {
    this._host = host;
  },

  _cache: {

    toHash: function(str) {
      return Ti.Utils.md5HexDigest(str);
    },

    get: function(str) {
      return Ti.App.Cache.get(this.toHash(str));
    },

    set: function(str, data) {
      Ti.App.Cache.put(this.toHash(str), data);
    }

  },

  get: function (method, params, cb, credentials) {
    this.log('::get() method invoked.');

    var self = this;

    // Extract params
    params      || (params      = {});
    credentials || (credentials = {});

    /**
     * Serialize paramaters in URL notation
     *
     * @param {Object} obj
     * @return {String}
     * @api private
     */
    var serialize = function(obj) {
      var str = [];
      for(var p in obj)
        str.push(p + '=' + encodeURIComponent(obj[p]));
      return str.join('&');
    };

    // Create url string
    // var url = '{0}{1}'.format(this._host, method);
    var url = this._host + method;

    if(! _.isEmpty(params)) {
      url += '?' + serialize(params);
    }

    var data = self._cache.get(url);

    this.log('::get() URL: ' + url);

    if (data) {
      this.log('::get() cached data for URL: ' + url);
      cb(data);
    } else {
      this.log('::get() get data from API for URL: ' + url);
      var xhr = Ti.Network.createHTTPClient({
        onload: function(e) {
          try {
            data = JSON.parse(this.responseText);
            self._cache.set(url, data);
          }
          catch(e) {
            console.error('[xcore.Request] JSON data from server could not be parsed. ' + url);
          }
          cb(data);
        }
      });

      xhr.open('GET', url);

      if(! _.isEmpty(credentials)) {
        xhr.setRequestHeader('Authorization', 'Basic ' + Ti.Utils.base64encode(credentials.username + ':' + credentials.password));
      }

      xhr.send();
    }
  },

  /**
   * Determines whether the debuging information is displayed.
   *
   * @property debug
   * @type Boolean
   * @default false
   */
  debug: false,

  /**
   * Determines whether log heading is printed.
   *
   * @property shouldPrintLogHeading
   * @type Boolean
   * @default true
   * @api private
   */
  shouldPrintLogHeading: true,

  /**
   * Outputs debuging information if the `debug` flag is turned on.
   *
   * @method log
   * @return void
   * @api private
   */
  log: function(str) {
    if (this.debug && this.shouldPrintLogHeading) {
      Ti.API.log('');
      Ti.API.log('[xcore.Request] Set `debug` flag to `false` to turn off these logs.');
      Ti.API.log('-------------------------------------------------------------------');
      this.shouldPrintLogHeading = false;
    }

    if (this.debug) {
      Ti.API.log('[xcore.Request] ' + str);
    }
  }

});
