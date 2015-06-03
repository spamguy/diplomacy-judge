// This spec file parses the Diplomacy Adjudication Test Cases file and spits out one Jasmine unit test per item.

var fs = require('fs'),
    byline = require('byline'),
    stream = fs.createReadStream('test/datc_v2.4_06.txt', { encoding: 'utf8' }),
    stream = byline.createStream(stream),
    expect = require('expect.js'),
    _ = require('lodash');

var variant = null;

var clearCommentReg = new RegExp(/^\s*#.*$/),
    variantReg = new RegExp(/^VARIANT_ALL\s+(\S*)\s*$/),
    caseReg = new RegExp(/^CASE\s+(.*)$/),
    prestateSetPhaseReg = new RegExp(/^PRESTATE_SETPHASE\s+(\S+)\s+(\d+),\s+(\S+)\s*$/),
    stateReg = new RegExp(/^([^:\s]+):?\s+(\S+)\s+(\S+)\s*$/),
    ordersReg = new RegExp(/^([^:]+):\s+(.*)$/),
    preOrderReg = new RegExp(/^(SUCCESS|FAILURE):\s+([^:]+):\s+(.*)$/);

var itQueue = [ ],              // queue up it()s to be run later
    itLabel = 1,
    itData = null,
    itExpectations = [ ];

stream.on('error', function(err) {
    console.log(err);
});

stream.on('data', function(line) {
    var match;
    if (match = line.match(clearCommentReg)) {
    }
    else if (match = line.match(variantReg)) {
        // use match in the context of variant file names
        match = _.camelCase(match[1]);
        variant = JSON.parse(fs.readFileSync('../../variants/' + match + '/' + match + '.json', { encoding: 'utf8' }));
    }
    else if (line.trim() === 'END') {
        // test has been built and can be run after the file has been processed
        itQueue.push(function() { it(itLabel++, function() { expect(1).to.equal(1); }); });
    }
});

stream.on('end', function() {
    // run all tests
    describe('DATC', function() {
        for (var i = 0; i < itQueue.length; i++)
            itQueue[i]();
    });
});
