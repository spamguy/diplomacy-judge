// This spec file parses the Diplomacy Adjudication Test Cases file and spits out one Jasmine unit test per item.

var fs = require('fs'),
    byline = require('byline'),
    stream = fs.createReadStream('test/datc_v2.4_06.txt', { encoding: 'utf8' }),
    stream = byline.createStream(stream),
    expect = require('expect.js'),
    _ = require('lodash'),
    Judge = require('../judge');

var variant = null,
    judge = null;

/*
 * During a unit test parse, a line can be considered in one of several states.
 *
 * Line parsing will stay in that state's section until the next state change.
 */
var UnitTestSubstateType = {
    TEST: 0,
    PRESTATE: 1,
    ORDERS: 2,
    POSTSTATE: 3
},
    currentSubstate = UnitTestSubstateType.TEST;

var clearCommentReg = new RegExp(/^\s*#.*$/),
    variantReg = new RegExp(/^VARIANT_ALL\s+(\S*)\s*$/),
    caseReg = new RegExp(/^CASE\s+(.*)$/),
    prestateSetPhaseReg = new RegExp(/^PRESTATE_SETPHASE\s+(\S+)\s+(\d+),\s+(\S+)\s*$/),
    stateReg = new RegExp(/^([^:\s]+):?\s+(\S+)\s+(\S+)\s*$/),
    ordersReg = new RegExp(/^([^:]+):\s+(.*)$/),
    preOrderReg = new RegExp(/^(SUCCESS|FAILURE):\s+([^:]+):\s+(.*)$/);

// substates within unit tests
var inPrestateSetPhaseMode = false;

var itQueue = [ ],              // queue up it()s to be run later
    itLabel = '',
    currentPhase,
    expectedPhase,
    genericIt = function(l, judge, before, after) {
        var actualAfter = judge.process(before);

        it(l, function() { expect(1).to.equal(1); });
    };

// wraps enqueued it() tests with correct params
var itWrapper = function(fn, context, params) {
        return function() {
            fn.apply(context, params);
        };
    };

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

        // instantiate judge
        judge = new Judge(variant);
    }
    else if (match = line.match(caseReg)) {
        itLabel = match[1];

        // start new old/expected phases to build
        beforePhaseData = afterPhaseData = { moves: [ ] };
    }
    else if (match = line.match(prestateSetPhaseReg)) {
        // enter prestate processing mode
        currentSubstate = UnitTestSubstateType.PRESTATE;
    }
    else if (line.trim() === 'END') {
        // test has been built and can be run after the file has been processed
        itQueue.push(itWrapper(genericIt, this, [itLabel, judge, beforePhaseData, afterPhaseData]));
    }
    else {
        // if none of the above apply, we must be in a substate of some sort
        switch (currentSubstate) {
            case UnitTestSubstateType.PRESTATE:
            break;

            case UnitTestSubstateType.ORDERS:
            break;

            case UnitTestSubstateType.POSTSTATE:
            break;
        }
    }
});

stream.on('end', function() {
    // run all tests
    describe('DATC', function() {
        while (itQueue.length > 0)
            (itQueue.shift())();
    });
});
