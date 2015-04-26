/**
 * @module Exceptions.io
 * @submodule Exceptions.js
 * @author Zeeshan Mian
 * @link https://github.com/zmian/Exception.io
 */

(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(factory);
  } else if (typeof exports === 'object' && exports) {
    // Node. Does not work with strict CommonJS, but
    // only CommonJS-like enviroments that support module.exports,
    // like Node.
    module.exports = factory();
  } else {
    // Browser globals (root is window)
     var returnExports = factory();
    root.Exception                = returnExports.Exception
    root.ArgumentException        = returnExports.ArgumentException
    root.InvalidInputException    = returnExports.InvalidInputException
    root.NotImplementedException  = returnExports.NotImplementedException
    root.NotSupportedException    = returnExports.NotSupportedException
    root.NotFoundException        = returnExports.NotFoundException
    root.UnauthenticatedException = returnExports.UnauthenticatedException
    root.UnauthorizedException    = returnExports.UnauthorizedException
  }
}(this, function() {

  /**
   * Exception
   *
   * The exception that is thrown when an error occurs.
   *
   * @class Exception
   * @extends Error
   * @constructor
   * @param {String} message A detailed message of this Exception
   * @example
   *    var err = new Exception();
   *    err instanceof Exception               // -> true
   *    err instanceof Error                   // -> true
   *    Exception.prototype.isPrototypeOf(err) // -> true
   *    Error.prototype.isPrototypeOf(err)     // -> true
   *    err.constructor.name                   // -> 'Exception'
   *    err.name                               // -> 'Exception'
   *    err.message                            // -> 'No description'
   *    err.toString()                         // -> '[Exception] No description'
   *    err.stack                              // -> prints the stack trace
   *
   * @link http://stackoverflow.com/questions/464359
   */
  function Exception(message) {
    /**
     * @property name
     * @type String
     */
    this.name = 'Exception';
    /**
     * @property message
     * @type String
     */
    this.message = message || 'No description';
  }

  Exception.prototype = new Error();
  Exception.prototype.constructor = Exception;

  /**
   * Form a string of relevant information.
   *
   * When providing this method, tools like Firebug show the returned
   * string instead of [object Object] for uncaught exceptions.
   *
   * @method toString
   * @return {String} Information about the exception
   */
  Exception.prototype.toString = function() {
    return '[' + this.name + '] ' + this.message;
  };


  /**
   * Argument Exception
   *
   * The exception that is thrown when one of the arguments provided to a method is not valid.
   *
   * @class ArgumentException
   * @extends Exception
   * @constructor
   * @param {String} message A detailed message of this Exception
   */
  function ArgumentException(message) {
    /**
     * @property name
     * @type String
     */
    this.name = 'ArgumentException';
    /**
     * @property message
     * @type String
     */
    this.message = message || 'Invalid Argument';
  }

  ArgumentException.prototype = new Exception();
  ArgumentException.prototype.constructor = ArgumentException;

  /**
   * Invalid Input Exception
   *
   * The exception that is thrown when one of the input provided to a method is not valid.
   *
   * @class InvalidInputException
   * @extends Exception
   * @constructor
   * @param {String} message A detailed message of this Exception
   */
  function InvalidInputException(message) {
    /**
     * @property name
     * @type String
     */
    this.name = 'InvalidInputException';
    /**
     * @property message
     * @type String
     */
    this.message = message || 'Invalid Input';
  }

  InvalidInputException.prototype = new Exception();
  InvalidInputException.prototype.constructor = InvalidInputException;


  /**
   * Not Implemented Exception
   *
   * The exception that is thrown when a requested method or operation is not implemented.
   *
   * @class NotImplementedException
   * @extends Exception
   * @constructor
   * @param {String} message A detailed message of this Exception
   */
  function NotImplementedException(message) {
    /**
     * @property name
     * @type String
     */
    this.name = 'NotImplementedException';
    /**
     * @property message
     * @type String
     */
    this.message = message || 'Not Implemented';
  }

  NotImplementedException.prototype = new Exception();
  NotImplementedException.prototype.constructor = NotImplementedException;


  /**
   * Not Supported Exception
   *
   * The exception that is thrown when a requested method or operation is not supported.
   *
   * @class NotSupportedException
   * @extends Exception
   * @constructor
   * @param {String} message A detailed message of this Exception
   */
  function NotSupportedException(message) {
    /**
     * @property name
     * @type String
     */
    this.name = 'NotSupportedException';
    /**
     * @property message
     * @type String
     */
    this.message = message || 'Not Supported';
  }

  NotSupportedException.prototype = new Exception();
  NotSupportedException.prototype.constructor = NotSupportedException;


  /**
   * Not Found Exception
   *
   * The exception that is thrown when an attempt is made to find something that does not exist.
   *
   * @class NotFoundException
   * @extends Exception
   * @constructor
   * @param {String} message A detailed message of this Exception
   */
  function NotFoundException(message) {
    /**
     * @property name
     * @type String
     */
    this.name = 'NotFoundException';
    /**
     * @property message
     * @type String
     */
    this.message = message || 'Not Found';
  }

  NotFoundException.prototype = new Exception();
  NotFoundException.prototype.constructor = NotFoundException;


  /**
   * Unauthenticated Exception
   *
   * The exception that is thrown when a requested method or operation requires authentication.
   *
   * @class UnauthenticatedException
   * @extends Exception
   * @constructor
   * @param {String} message A detailed message of this Exception
   */
  function UnauthenticatedException(message) {
    /**
     * @property name
     * @type String
     */
    this.name = 'UnauthenticatedException';
    /**
     * @property message
     * @type String
     */
    this.message = message || 'Not Authenticated';
  }

  UnauthenticatedException.prototype = new Exception();
  UnauthenticatedException.prototype.constructor = UnauthenticatedException;


  /**
   * Unauthorized Exception
   *
   * The exception that is thrown when the current user is not allowed to perform an attempted operation.
   *
   * @class UnauthorizedException
   * @extends Exception
   * @constructor
   * @param {String} message A detailed message of this Exception
   */
  function UnauthorizedException(message) {
    /**
     * @property name
     * @type String
     */
    this.name = 'UnauthorizedException';
    /**
     * @property message
     * @type String
     */
    this.message = message || 'Not Authorized';
  }

  UnauthorizedException.prototype = new Exception();
  UnauthorizedException.prototype.constructor = UnauthorizedException;


  return {
    Exception:                 Exception,
    ArgumentException:         ArgumentException,
    InvalidInputException:     InvalidInputException,
    NotImplementedException:   NotImplementedException,
    NotSupportedException:     NotSupportedException,
    NotFoundException:         NotFoundException,
    UnauthenticatedException:  UnauthenticatedException,
    UnauthorizedException:     UnauthorizedException
  };

}));
