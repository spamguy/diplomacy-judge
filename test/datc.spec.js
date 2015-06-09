// This spec file parses the Diplomacy Adjudication Test Cases file and spits out one Jasmine unit test per item.
var fs = require('fs'),
    byline = require('byline'),
    stream = fs.createReadStream('test/datc_v2.4_06.txt', { encoding: 'utf8' }),
    stream = byline.createStream(stream),
    expect = require('expect.js'),
    _ = require('lodash'),
    Judge = require('../judge'),
    UnitType = require('../unittype');

var variant = null,
    judge = null;

/*
 * During a unit test parse, a line can be considered in one of several states.
 *
 * Line parsing will stay in that state's section until the next state change.
 */
var UnitTestSubstateType = {
    TEST: 0,
    PRESTATE_SUPPLYCENTER: 1,
    PRESTATE_RESULTS: 2,
    PRESTATE_DISLODGED: 3,
    PRESTATE: 4,
    ORDERS: 5,
    POSTSTATE: 6
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
    line = line.trim();

    var match;
    if (match = line.match(clearCommentReg)) {
    }
    else if (match = line.match(variantReg)) {
        currentSubstate = UnitTestSubstateType.TEST;
        // use match in the context of variant file names
        match = _.camelCase(match[1]);
        variant = JSON.parse(fs.readFileSync('../../variants/' + match + '/' + match + '.json', { encoding: 'utf8' }));

        // instantiate judge
        judge = new Judge(variant);
    }
    else if (match = line.match(caseReg)) {
        currentSubstate = UnitTestSubstateType.TEST;
        itLabel = match[1];

        // start new old/expected phases to build
        beforePhaseData = expectedAfterPhaseData = { moves: [ ] };
    }
    else if (match = line.match(prestateSetPhaseReg)) {
        currentSubstate = UnitTestSubstateType.TEST;
    }
    else if (line === 'PRESTATE') {
        // enter prestate processing mode
        currentSubstate = UnitTestSubstateType.PRESTATE;
    }
    else if (line === 'PRESTATE_SUPPLYCENTER_OWNERS') {
        currentSubstate = UnitTestSubstateType.PRESTATE_SUPPLYCENTER;
    }
    else if (line === 'PRESTATE_RESULTS') {
        currentSubstate = UnitTestSubstateType.PRESTATE_RESULTS;
    }
    else if (line === 'PRESTATE_DISLODGED') {
        currentSubstate = UnitTestSubstateType.PRESTATE_DISLODGED;
    }
    else if (line === 'ORDERS') {
        currentSubstate = UnitTestSubstateType.ORDERS;
    }
    else if (line === 'POSTSTATE') {
        currentSubstate = UnitTestSubstateType.POSTSTATE;
    }
    else if (line === 'POSTSTATE_SAME') {
        currentSubstate = UnitTestSubstateType.TEST;
        expectedAfterPhaseData = beforePhaseData;
    }
    else if (line === 'END') {
        currentSubstate = UnitTestSubstateType.TEST;

        // test has been built and can be run after the file has been processed
        itQueue.push(itWrapper(genericIt, this, [itLabel, judge, beforePhaseData, expectedAfterPhaseData]));
    }
    else {
        // strip out comments
        line = line.split('#')[0].trim();

        // if none of the above apply, we must be in a substate of some sort
        if (line !== '') {
            switch (currentSubstate) {
                case UnitTestSubstateType.PRESTATE:
                    match = line.match(stateReg);
                    var power = match[1][0], // only the first initial is relevant
                        unitType = match[2],
                        region = match[3];
                    unitType = match[2] === 'A' ? UnitType.ARMY : UnitType.FLEET;

                    beforePhaseData.moves.push({
                        r: region.toUpperCase(),
                        unit: {
                            type: unitType,
                            power: power,
                            order: {
                                // to be filled in at ORDERS state
                            }
                        }
                    });
                break;

                case UnitTestSubstateType.ORDERS:
                break;

                case UnitTestSubstateType.POSTSTATE:
                break;

                case UnitTestSubstateType.POSTSTATE_DISLODGED:
                break;

                case UnitTestSubstateType.POSTSTATE_RESULTS:
                break;
            }
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
