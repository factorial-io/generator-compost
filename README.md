# generator-compost

> [Yeoman](http://yeoman.io) generator

Generator compost scaffolds opinionated, component-like structures into your project. Depending on your choices it will create the following files:

    ├── _bower.json
    ├── _component.css
    ├── _component.js
    ├── _component.json
    ├── _component.tpl.haml
    ├── _package.json
    ├── editorconfig
    └── jshintrc

## Prerequisites 

Install Yeoman.

    npm install -g yo


Important: generator-compost is not yet published on npm. If you want to use generator compost locally, checkout this repository and run from its folder:

    git clone ssh://git@source.factorial.io:2222/components/generator-compost.git

    npm link

## Usage 

  yo compost <my-component-name>

## Version history

0.2.0 

  - Now accepts component name directly and only from the command line. 
  - Now creates component directory into `components_local/my-component-name`.
  - Writes local dependency to projects component.json, if present.

### Yeoman Generators

Yeoman travels light. He didn't pack any generators when he moved in. You can think of a generator like a plug-in. You get to choose what type of application you wish to create, such as a Backbone application or even a Chrome extension.

To install generator-compost from npm, run:

```bash
npm install -g generator-compost
```

Finally, initiate the generator:

```bash
yo compost
```

## License

MIT
