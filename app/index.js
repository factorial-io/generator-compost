'use strict';
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');
var path = require ('path');
var jf = require('jsonfile');
var util = require('util');

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
        message: 'Would you like to create a template (PHP HAML)?',
        default: true
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
      var i;
      var found = false;
      var file = 'component.json';
      var obj = jf.readFileSync(file, {throws: false});

      if (obj && obj.locals) {

        for (i = 0; i < obj.locals.length; i += 1) {
          if (obj.locals[i] === this.props.name) {
            found = true;
          }
        }

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
      var key;
      var value;
      var options = {
        addTemplate: 'tpl.haml',
        addStyles: 'css',
        addScripts: 'js'
      };

      for (key in options) {
        value = options[key];
        if (this.props[key]) {
          this.fs.copyTpl(
            this.templatePath('_component.' + value),
            this.destinationPath(this.props.name + '.' + value),
            {name: this.props.name}
          );
        }
      }
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
