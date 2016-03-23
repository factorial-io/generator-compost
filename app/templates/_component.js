<% if (scriptJquery) { %>'use strict';

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
<% } else { %>'use strict';

/**
 *@fileOverview
 *@version 0.0.1
 *
 * @namespace factorial.<%= _.camelCase(name) %>
 */

var _ = require('lodash');

var defaults = {
  value: true
};

var elements = {
  elementName: '.<%= _.capitalize(_.camelCase(name)) %>-item'
};


var <%= _.capitalize(_.camelCase(name)) %> = function(element, options) {

  this.element = element;
  var data = JSON.parse(element.getAttribute('data-options'));
  this.options = _.extend({}, defaults, options, data);

  this.elements = {};

  if (elements) {
    _.forEach(elements, function(value, key) {
      if (this.element.querySelectorAll(value) !== null) {
        this.elements[key] = this.element.querySelectorAll(value)[0];
      }
    }.bind(this));
  }

  this._create();
};

<%= _.capitalize(_.camelCase(name)) %>.prototype._create = function() {
  console.log('Create <%= _.capitalize(_.camelCase(name)) %>');
};

<%= _.capitalize(_.camelCase(name)) %>.prototype._setOption = function(key, value) {
  //console.log('<%= _.capitalize(_.camelCase(name)) %>-option: ' + key + ' = ' + value);
  switch (key) {
    case 'value':
      this.options[key] = value;
      // some action
      break;
    default:
      this.options[key] = value;
      break;
  }
};

/*
 * Public methods
 */

<%= _.capitalize(_.camelCase(name)) %>.prototype.method = function(event) {
  console.log('method called' + event);
};
<% if (implement == 'component.json') { %>
if (document.addEventListener) {
  _.forEach(document.getElementsByClassName('js-<%= _.capitalize(_.camelCase(name)) %>'), function(element) {
    document.addEventListener('DOMContentLoaded', new <%= _.capitalize(_.camelCase(name)) %>(element));
  });
}<% } else { %>
module.exports = <%= _.capitalize(_.camelCase(name)) %>;<% }%><% }%>
