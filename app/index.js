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
        name: 'name',
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
      done();
    }.bind(this));
  },

  writing: {
    app: function () {
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

      // component.json
      this.fs.copyTpl(
        this.templatePath('_component.json'),
        this.destinationPath('component.json'),
        {props: this.props}
      );

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
