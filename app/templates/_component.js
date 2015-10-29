'use strict';

/**
 *@fileOverview
 *@version 0.0.1
 *
 * @namespace factorial.<%= _.camelCase(name) %>
 */

window.jQuery = require('jquery');
require('jqueryui');

(function ($, window, document, undefined) {

  $.widget('factorial.<%= _.camelCase(name) %>', {

    /*
     * Options to be used as defaults.
     */

    options: {
      someValue: null
    },

    /**
     * Implements {@link https://api.jqueryui.com/jquery.widget/#method-_getCreateOptions|$.widget._getCreateOptions}
     *
     * @memberof factorial.<%= _.camelCase(name) %>
     * @instance
     * @private
     */

    _getCreateOptions: function() {
      var options = {};
      if (this.element.data('options')) {
        options = this.element.data('options');
      }
      return options;
    },

    /**
     * Implements {@link https://api.jqueryui.com/jquery.widget/#method-_create|$.widget._create}
     *
     * @memberof factorial.<%= _.camelCase(name) %>
     * @instance
     * @private
     */

    _create: function() {

    },

    /**
     * Implements {@link https://api.jqueryui.com/jquery.widget/#method-_destroy|$.widget._destroy}
     *
     * @memberof factorial.<%= _.camelCase(name) %>
     * @instance
     * @private
     */

    _destroy: function() {

    },

    /**
     * Implements {@link https://api.jqueryui.com/jquery.widget/#method-_setOption|$.widget._setOption}
     *
     * @memberof factorial.<%= _.camelCase(name) %>
     * @instance
     * @private
     */

    _setOption: function(key, value) {
      switch (key) {
        case 'someValue':
          //this.options.someValue = doSomethingWith( value );
          break;
        default:
          this.options[key] = value;
          break;
      }
      this._super('_setOption', key, value);
    },

    /*
     * Public methods
     */

    methodB: function(event) {
      console.log('methodB called' + event);
    },

    methodA: function(event) {
      this._trigger('dataChanged', event, {
        key: 'someValue'
      });
    }
  });
  <% if (instantiate === 'Drupal.behaviors') { %>
  window.Drupal.behaviors.<%= _.camelCase(name) %> = {
    attach: function(context) {
      $('.js-<%= _.capitalize(_.camelCase(name)) %>', context).<%= _.camelCase(name) %>();
    }
  };
  <% } else if (instantiate === '$(document).ready') { %>
  $(function() {
    $('.js-<%= _.capitalize(_.camelCase(name)) %>').<%= _.camelCase(name) %>();
  });
  <% } %>
})(window.jQuery, window, document);
