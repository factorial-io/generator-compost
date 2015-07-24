'use strict';
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');
var path = require ('path');
var jf = require('jsonfile');
var util = require('util');
var _ = require('lodash');

jf.spaces = 2;

module.exports = yeoman.generators.Base.extend({

  constructor: function() {
    yeoman.generators.Base.apply(this, arguments);
    this.argument('name', {
      type: String,
      required: true
    });
  },

  initializing: function() {
    this.pkg = require('../package.json');
  },

  prompting: function() {
    var done = this.async();

    this.log(yosay(
      'Welcome to the marvelous ' + chalk.red('Compost') + ' generator!'
    ));

    var prompts = [
      {
        type: 'confirm',
        name: 'addTemplate',
        message: 'Would you like to create a template?',
        default: true
      },
      {
        type: 'list',
        name: 'templateName',
        message: 'What template language do you want to use?',
        choices: ['haml', 'php'],
        default: 'haml',
        when: function (answers) {
          return answers.addTemplate;
        }
      },
      {
        type: 'confirm',
        name: 'addStyles',
        message: 'Would you like to create styles (SUIT CSS component)?',
        default: true
      },
      {
        type: 'confirm',
        name: 'addScripts',
        message: 'Would you like to create scripts (jQueryUI widget)?',
        default: true
      },
      {
        type: 'list',
        name: 'instantiate',
        message: 'How should the widget be instantiated?',
        choices: ['$(document).ready', 'Drupal.behaviors'],
        default: '$(document).ready',
        when: function (answers) {
          return answers.addScripts;
        }
      }
    ];

    this.prompt(prompts, function (props) {
      this.props = {};
      this.props = props;
      this.props.name = this.name;
      done();
    }.bind(this));
  },

  writing: {

    /*
     * Adds a new local dependency to the project's component.json if not
     * already present.
     */

    updateComponentJson: function() {
      var found = false;
      var file = 'component.json';
      var obj = jf.readFileSync(file, {throws: false});

      if (obj && obj.locals) {

        var isName = function(element) {
          return element === this.props.name;
        };

        found = _.some(obj.locals, isName.bind(this));

        if (!found) {
          obj.locals.push(this.props.name);
          jf.writeFileSync(file, obj);
        }
      }
    },

    changeDestinationRoot: function() {
      this.destinationRoot(path.join(
        this.destinationRoot(),
        '/components_local',
        '/' + this.name
      ));
    },

    app: function() {
      var options = {
        addTemplate: 'tpl.' + this.props.templateName,
        addStyles: 'css',
        addScripts: 'js'
      };

      var matchesProperty = function(n, key) {
        return this.props[key] ? true : false;
      };

      var copyTemplate = function(n) {
        this.fs.copyTpl(
          this.templatePath('_component.' + n),
          this.destinationPath(this.props.name + '.' + n),
          {
            name: this.props.name,
            instantiate: this.props.instantiate
          }
        );
      };

      _.forEach(
        _.filter(options, matchesProperty.bind(this)),
        copyTemplate.bind(this)
      );

    },

    packageFiles: function() {
      var i;
      var packages = [
        '_component.json',
        '_package.json',
        '_bower.json'
      ];
      for (i = 0; i < packages.length; i += 1) {
        this.fs.copyTpl(
          this.templatePath(packages[i]),
          this.destinationPath(packages[i].substr(1)),
          {props: this.props}
        );
      }
    },

    projectFiles: function() {
      var i;
      var projectFiles = [
        'editorconfig',
        'jshintrc'
      ];
      for (i = 0; i < projectFiles.length; i += 1) {
        this.fs.copy(
          this.templatePath(projectFiles[i]),
          this.destinationPath('.' + projectFiles[i])
        );
      }
    }
  },

  install: function() {
    this.installDependencies();
  }
});
