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
        name: 'name',
        message: 'What is your component\'s name?'
      },
      {
        name: 'githubUsername',
        message: 'GitHub username?',
        default: 'factorial-io'
      },
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
        choices: [
          'tpl.haml',
          'tpl.php',
          'tag'
        ],
        default: 'tpl.haml',
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
      },
      {
        type: 'list',
        name: 'implement',
        message: 'How do you want to resolve your dependencies?',
        choices: [
          'package.json',
          'component.json',
          'import'
        ],
        default: 'package.json'
      }
    ];

    this.prompt(prompts, function (props) {
      this.props = {};
      this.props = props;
      done();
    }.bind(this));
  },

  writing: {

    /*
     * Adds a new local dependency to the project's component.json if not
     * already present.
     */

    updateJson: function() {
      var found = false;

      var file = this.props.implement;
      var obj = jf.readFileSync(file, {throws: false});

      var isName = function(element) {
        return element === this.props.name;
      };

      if (obj) {
        if (this.props.implement === 'package.json') {
          if (!obj.dependencies) {
            obj.dependencies = {};
            jf.writeFileSync(file, obj);
          }

          found = _.some(obj.dependencies, isName.bind(this));

          if (!found) {
            obj.dependencies[this.props.name] = 'file:./components_local/' + this.props.name;
            jf.writeFileSync(file, obj);
          }
        } else if (this.props.implement === 'component.json') {
          if (!obj.locals) {
            obj.locals = {};
            jf.writeFileSync(file, obj);
          }

          found = _.some(obj.locals, isName.bind(this));

          if (!found) {
            obj.locals.push(this.props.name);
            jf.writeFileSync(file, obj);
          }
        }
      }
    },

    changeDestinationRoot: function() {
      var component_path = null;

      if (this.props.implement === 'import') {
        component_path = '/source/assets/components';
      } else {
        component_path = '/components_local';
      }
      this.destinationRoot(path.join(
        this.destinationRoot(),
        component_path,
        '/' + this.props.name
      ));
    },

    app: function() {
      var options = {
        addTemplate: this.props.templateName,
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
        '_component.json'
      ];

      for (i = 0; i < packages.length; i += 1) {
        this.fs.copyTpl(
          this.templatePath(packages[i]),
          this.destinationPath(packages[i].substr(1)),
          {props: this.props}
        );
      }

      this.packageJson = {
        'name': this.props.name,
        'version': '0.0.0',
        'repository': {
          'type': 'git',
          'url': 'https://github.com/' + this.props.githubUsername + '/' + this.props.name
        },
        'license': 'MIT',
        'main': '',
        'style': '',
        'files': [],
        'dependencies': {},
        'backend': {
          'template': '',
          'fixture': '',
          'options': ''
        }
      };

      if (this.props.addScripts) {
        this.packageJson.main = this.props.name + '.js';
        this.packageJson.dependencies = {
          'components/jquery': '*',
          'components/jqueryui': '*'
        };
        this.packageJson.files.push(this.props.name + '.js');
      }
      if (this.props.addStyles) {
        this.packageJson.style = this.props.name + '.css';
        this.packageJson.files.push(this.props.name + '.css');
      }
      if (this.props.addTemplate) {
        this.packageJson.files.push(this.props.name + this.props.templateName);
        this.packageJson.backend.template = this.props.name + this.props.templateName;
      }

      this.write('package.json', JSON.stringify(this.packageJson, null, 2));
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
  }
});
