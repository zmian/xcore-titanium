if (! Object.prototype.hasOwnProperty('renameProperty')) {
  // format.js is extending JavaScript's native objects.
  // Make sure format.js file exists and exposed globally.
  Ti.API.error('[xcore.Utils] renameProperty is required.');
}

var Utilities = {
  toPixel: function(densityPixels) {
    return densityPixels * Ti.Platform.displayCaps.dpi / 160;
  },
  addPropertyAlias: function(list, currentKeyName, newKeyName) {
    list || (list = []);

    if (list.length !== 0) {
      for (var i = 0, len = list.length; i < len; i++) {
        list[i][newKeyName] = list[i][currentKeyName];
      }
    }
    
    return list;
  },
  replace: function(list, currentKeyName, newKeyName) {
    list || (list = []);

    if (list.length !== 0) {
      for (var i = 0, len = list.length; i < len; i++) {
        list[i].renameProperty(currentKeyName, newKeyName);
      }
    }
    
    return list;
  },
  /**
   * @example
   * var categoriesListName = xcore.Utils.replace(categories, 'Name', 'title');
   * var categoriesListId   = xcore.Utils.replace(categories, 'ID', 'value');
   * var categoriesList     = xcore.Utils.extend(categoriesListName, categoriesListId);
   */
  newListWithOnlyOneProperty: function(list, currentKeyName, newKeyName) {
    list || (list = []);

    var result = [];
    
    for (var i = 0, len = list.length; i < len; i++) {
      var obj = {};
      obj[newKeyName] = list[i][currentKeyName];
      result.push(obj);
    }
    
    return result;
  },
  /**
   * Recursively merge properties of two objects
   * @author Markus
   * @url http://stackoverflow.com/questions/171251/how-can-i-merge-properties-of-two-javascript-objects-dynamically/#answer-383245
   */
  extend: function(obj1, obj2) {
    for (var p in obj2) {
      try {
        // Property in destination object set; update its value.
        if (obj2[p].constructor === Object) {
          obj1[p] = Utilities.extend(obj1[p], obj2[p]);
        } else {
          obj1[p] = obj2[p];
        }
      } catch(e) {
        // Property in destination object not set; create it and set its value.
        obj1[p] = obj2[p];
      }
    }
    return obj1;
  },
  /**
   * Recursively merge properties of two objects
   * @author Markus
   * @url http://stackoverflow.com/questions/171251/how-can-i-merge-properties-of-two-javascript-objects-dynamically/#answer-383245
   */
  extendWithExclude: function(obj1, obj2, excludeTheseObjects) {
    for (var p in obj2) {
      if (excludeTheseObjects instanceof Array) {
        for (var x in excludeTheseObjects) {
          if (p == excludeTheseObjects[x]) {
            continue;
          }
        }
      }
      try {
        // Property in destination object set; update its value.
        if (obj2[p].constructor === Object) {
          obj1[p] = Utilities.extend(obj1[p], obj2[p]);
        } else {
          obj1[p] = obj2[p];
        }
      } catch(e) {
        // Property in destination object not set; create it and set its value.
        obj1[p] = obj2[p];
      }
    }
    return obj1;
  },
  defaults: function(options, defaults) {
    // Extract options
    options  || (options  = {}); // Defaults
    defaults || (defaults = {}); // Options

    // Overwrite `defaults` object
    // and merge it into `options` object.
    var obj = Utilities.extend(defaults, options);

    // If `set` property exits and it's a function then execute it
    // It can be used to set the dynamic values
    if (obj.hasOwnProperty('set') && _.isFunction(obj.set)) {
      obj.set();
    }

    return obj;
  },
  /**
   * @link http://stackoverflow.com/questions/359788
   * @example executeFunctionByName("My.Namespace.functionName", window, arguments);
   */
  executeFunctionByName: function(functionName, context /*, args */) {
      var args = Array.prototype.slice.call(arguments, 2);
      var namespaces = functionName.split(".");
      var func = namespaces.pop();
      for (var i = 0; i < namespaces.length; i++) {
          context = context[namespaces[i]];
      }
      return context[func].apply(context, args);
  }
};

module.exports = Utilities;
