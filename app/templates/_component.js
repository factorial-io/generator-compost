/*!
 * jQuery UI Widget-factory plugin boilerplate (for 1.8/9+)
 * Author: @addyosmani
 * Further changes: @peolanha
 * Licensed under the MIT license
 */

;(function ( $, window, document, undefined ) {

  $.widget( "factorial.<%= _.camelCase(name) %>" , {

    options: {
      someValue: null
    },

    // Private methods:

    _getCreateOptions: function() {
      var options = {};
      if (this.element.data("options") {
        options = this.element.data("options");
      })
      return options;
    },

    _create: function() {

    },

    _destroy: function() {

    },

    _setOption: function( key, value ) {
      switch (key) {
        case "someValue":
          //this.options.someValue = doSomethingWith( value );
          break;
        default:
          //this.options[ key ] = value;
          break;
      }
      this._super( "_setOption", key, value );
    },

    // Public methods:

    methodB: function( event ) {
      console.log("methodB called");
    },

    methodA: function( event ) {
      this._trigger("dataChanged", event, {
        key: "someValue"
      });
    }

  });

})( jQuery, window, document );
