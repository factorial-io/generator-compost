'use strict';
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');

module.exports = yeoman.generators.Base.extend({
  initializing: function () {
    this.pkg = require('../package.json');
  },

  prompting: function () {
    var done = this.async();

    // Have Yeoman greet the user.
    this.log(yosay(
      'Welcome to the marvelous ' + chalk.red('Compost') + ' generator!'
    ));

    var prompts = [
      {
        name: 'componentName',
        message: 'What is the name of your component?'
      },
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
      this.props = props;
      // To access props later use this.props.someOption;

      done();
    }.bind(this));
  },

  writing: {
    app: function () {
      this.fs.copy(
        this.templatePath('_package.json'),
        this.destinationPath('package.json')
      );
      this.fs.copy(
        this.templatePath('_bower.json'),
        this.destinationPath('bower.json')
      );
    },

    projectfiles: function () {
      // console.log(this.props);
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

  install: function () {
    this.installDependencies();
  }
});
