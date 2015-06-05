'use strict';
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');

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

    // Have Yeoman greet the user.
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

    app: function() {
      var i;
      var key;
      var value;
      var options = {
        addTemplate: 'tpl.haml',
        addStyles: 'css',
        addScripts: 'js'
      };
      var packages = [
        '_component.json',
        '_package.json',
        '_bower.json'
      ];

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

      for (i = 0; i < packages.length; i += 1) {
        this.fs.copyTpl(
          this.templatePath(packages[i]),
          this.destinationPath(packages[i].substr(1)),
          {props: this.props}
        );
      }
    },

    projectfiles: function() {
      this.fs.copy(
        this.templatePath('editorconfig'),
        this.destinationPath('.editorconfig')
      );
      this.fs.copy(
        this.templatePath('jshintrc'),
        this.destinationPath('.jshintrc')
      );
    }
  },

  install: function() {
    this.installDependencies();
  }
});
