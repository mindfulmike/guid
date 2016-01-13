(function(moduleName, definition) {
  "use strict";

  // This file will function properly as a <script> tag, or a module
  // using CommonJS and NodeJS or RequireJS module formats.  In
  // Common/Node/RequireJS, the module exports the Class API and when
  // executed as a simple <script>, it creates a Class global instead.
  // borrowed from  kriskowal's Q
  // Montage Require
  if (typeof bootstrap === 'function') {
    bootstrap('promise', definition);
    // CommonJS
  } else if (typeof exports === 'object' && typeof module === 'object') {
    module.exports = definition();
    // RequireJS
  } else if (typeof define === 'function' && define.amd) {
    define(moduleName, definition);
    // SES (Secure EcmaScript)
  } else if (typeof ses !== 'undefined') {
    if (!ses.ok()) {
      return;
    } else {
      ses['make' + moduleName] = definition;
    }
  } else if (typeof angular !== 'undefined') {
    angular.module(moduleName, []).factory(moduleName, definition);
  } else if (typeof window !== 'undefined' || typeof self !== 'undefined') {
    // Prefer window over self for add-on scripts. Use self for
    // non-windowed contexts.
    var global = typeof window !== 'undefined' ? window : self;

    // Get the `window` object, save the previous splitter global
    // and initialize splitter as a global.
    var prev = global[moduleName];
    global[moduleName] = definition();

    // Add a noConflict function so splitter can be removed from the
    // global namespace.
    global.splitter.noConflict = function() {
      global[moduleName] = prev;
      return this;
    };
  } else {
    throw new Error('This environment was not anticipated by ' + moduleName + '. Please file a bug.');
  }
})('Guid', function() {
  var validator = new RegExp('^[a-z0-9]{8}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{12}$', 'i');

  function gen(count) {
    var out = '';
    for (var i = 0; i < count; i++) {
      out += (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    }
    return out;
  }

  function Guid(guid) {
    if (!guid) {
      throw new TypeError('Invalid argument; `value` has no value.');
    }

    this.value = Guid.EMPTY;

    if (guid && guid instanceof Guid) {
      this.value = guid.toString();
    } else if (guid && Object.prototype.toString.call(guid) === '[object String]' && Guid.isGuid(guid)) {
      this.value = guid;
    }
  }

  Guid.prototype = {
    equals: function(other) {
      // Comparing string `value` against provided `guid` will auto-call
      // toString on `guid` for comparison
      return Guid.isGuid(other) && this.value == other;
    },
    isEmpty: function() {
      return this.value === Guid.EMPTY;
    },
    toString: function() {
      return this.value;
    },
    toJSON: function() {
      return this.value;
    }
  };

  Guid.EMPTY = '00000000-0000-0000-0000-000000000000';

  Guid.isGuid = function(value) {
    return value && (value instanceof Guid || validator.test(value.toString()));
  };

  Guid.create = function() {
    return new Guid([gen(2), gen(1), gen(1), gen(1), gen(3)].join('-'));
  };

  Guid.raw = function() {
    return [gen(2), gen(1), gen(1), gen(1), gen(3)].join('-');
  };

  return Guid;
});