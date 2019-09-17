const path = require("path");
const assert = require("yeoman-generator").assert;
const helpers = require("yeoman-generator").test;
const os = require("os");

describe("compost:app", function() {
  before(function(done) {
    helpers
      .run(path.join(__dirname, "../app"))
      .withOptions({ skipInstall: true })
      .withPrompts({ someOption: true })
      .on("end", done);
  });

  it("creates files", function() {
    assert.file(["bower.json", "package.json", ".editorconfig", ".jshintrc"]);
  });
});
