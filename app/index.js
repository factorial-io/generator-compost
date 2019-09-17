const yeoman = require("yeoman-generator");
const chalk = require("chalk");
const yosay = require("yosay");
const path = require("path");
const jf = require("jsonfile");
const _ = require("lodash");
const pkg = require("../package.json");

jf.spaces = 2;

module.exports = yeoman.generators.Base.extend({
  initializing() {
    this.pkg = pkg;
  },

  prompting() {
    const done = this.async();

    this.log(
      yosay(`Welcome to the marvelous ${chalk.red("Compost")} generator!`)
    );

    const prompts = [
      {
        name: "name",
        message: "Enter a pattern name (use-dash-case)"
      },
      {
        type: "confirm",
        name: "addTemplate",
        message: "Would you like to create a twig template file?",
        default: true
      },
      {
        type: "confirm",
        name: "addStyles",
        message: "Would you like to create a css file?",
        default: true
      },
      {
        type: "confirm",
        name: "addScripts",
        message: "Would you like to create a js file?",
        default: true
      },
      {
        type: "confirm",
        name: "addData",
        message: "Would you like to create sample data (uses yaml)?",
        default: true
      }
    ];

    function setProps(props) {
      this.props = {};
      this.props = props;
      done();
    }

    this.prompt(prompts, setProps.bind(this));
  },

  writing: {
    changeDestinationRoot() {
      const componentPath = ".";

      this.destinationRoot(
        path.join(this.destinationRoot(), componentPath, `/${this.props.name}`)
      );
    },

    app() {
      const options = {
        addTemplate: "twig",
        addStyles: "css",
        addScripts: "js",
        addData: "yaml"
      };

      function matchesProperty(n, key) {
        return !!this.props[key];
      }

      function copyTemplate(n) {
        this.fs.copyTpl(
          this.templatePath(`_component.${n}`),
          this.destinationPath(`${this.props.name}.${n}`),
          {
            name: this.props.name,
            addScripts: this.props.addScripts,
            addData: this.props.addData
          }
        );
      }

      _.forEach(
        _.filter(options, matchesProperty.bind(this)),
        copyTemplate.bind(this)
      );
    },

    projectFiles() {
      let i;
      const projectFiles = [];
      for (i = 0; i < projectFiles.length; i += 1) {
        this.fs.copy(
          this.templatePath(projectFiles[i]),
          this.destinationPath(`.${projectFiles[i]}`)
        );
      }
    }
  }
});
