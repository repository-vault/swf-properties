"use strict";

const expect = require('expect.js');
const SWFReader = require('../');
const fs     = require('fs');
const path   = require('path');

describe("testing reference files", function(){

  var file_path = path.join(__dirname, "rsrcs/file0.swf"), result_path = path.join(__dirname, "rsrcs/file0.json");
  it("should test reference file", function(done){
      var challenge = JSON.parse(fs.readFileSync(result_path));
      SWFReader(file_path, function(err, result){
        expect(err).not.to.be.ok();
        expect(result).to.eql(challenge);
        done();
      });
  });


});
