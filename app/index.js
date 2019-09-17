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
        message: "What is your component's name?"
      },
      {
        name: "githubUsername",
        message: "GitHub username?",
        default: "factorial-io"
      },
      {
        type: "confirm",
        name: "addTemplate",
        message: "Would you like to create a template?",
        default: true
      },
      {
        type: "list",
        name: "templateName",
        message: "What template language do you want to use?",
        choices: ["twig"],
        default: "twig",
        when(answers) {
          return answers.addTemplate;
        }
      },
      {
        type: "confirm",
        name: "addStyles",
        message: "Would you like to create styles",
        default: true
      },
      {
        type: "confirm",
        name: "addScripts",
        message: "Would you like to create scripts?",
        default: true
      },
      {
        type: "list",
        name: "implement",
        message: "How do you want to resolve your dependencies?",
        choices: ["package.json"],
        default: "package.json"
      }
    ];

    this.prompt(
      prompts,
      function(props) {
        this.props = {};
        this.props = props;
        done();
      }.bind(this)
    );
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
        addTemplate: this.props.templateName,
        addStyles: "css",
        addScripts: "js"
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
            instantiate: this.props.instantiate,
            addScripts: this.props.addScripts
          }
        );
      }

      _.forEach(
        _.filter(options, matchesProperty.bind(this)),
        copyTemplate.bind(this)
      );
    },

    packageFiles() {
      let i;
      const packages = ["_package.json"];

      for (i = 0; i < packages.length; i += 1) {
        this.fs.copyTpl(
          this.templatePath(packages[i]),
          this.destinationPath(packages[i].substr(1)),
          { props: this.props }
        );
      }

      this.packageJson = {
        name: this.props.name,
        version: "0.0.0",
        repository: {
          type: "git",
          url: `https://github.com/${this.props.githubUsername}/${this.props.name}`
        },
        license: "UNLICENSED",
        main: "",
        style: "",
        files: [],
        dependencies: {},
        backend: {
          template: "",
          fixture: "",
          options: ""
        }
      };

      if (this.props.addScripts) {
        this.packageJson.main = `${this.props.name}.js`;
        this.packageJson.files.push(`${this.props.name}.js`);
      }
      if (this.props.addStyles) {
        this.packageJson.style = `${this.props.name}.css`;
        this.packageJson.files.push(`${this.props.name}.css`);
      }
      if (this.props.addTemplate) {
        this.packageJson.files.push(this.props.name + this.props.templateName);
        this.packageJson.backend.template =
          this.props.name + this.props.templateName;
      }

      this.write("package.json", JSON.stringify(this.packageJson, null, 2));
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
