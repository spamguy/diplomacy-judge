// This spec file parses the Diplomacy Adjudication Test Cases file and spits out one Jasmine unit test per item.
var fs = require('fs'),
    path = require('path'),
    byline = require('byline'),
    stream = fs.createReadStream(path.join(__dirname, 'datc_v2.4_06.txt'), { encoding: 'utf8' }),
    stream = byline.createStream(stream),
    expect = require('expect.js'),
    _ = require('lodash'),
    Judge = require('../judge'),
    UnitType = require('../unittype'),
    OrderType = require('../ordertype');

var variant = null,
    judge = null;

// set environment to 'test' to suppress logging
process.env.NODE_ENV = 'test';

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
    ordersReg = new RegExp(/([^:]+):\s+\w\s+([\w\/]{3,6})\s*(-|\w*)\s*\w?\s*([\w\/]{3,6})?\s*(?:via [Cc]onvoy|[-H]?\s*([\w\/]{3,6})?)$/),
    buildOrdersReg = new RegExp(/([^:]+):\s+(\w*)\s+(\w)?\s*([\w\/]{3,6})$/),
    preOrderReg = new RegExp(/^(SUCCESS|FAILURE):\s+([^:]+):\s+(.*)$/);

// substates within unit tests
var inPrestateSetPhaseMode = false;

var itQueue = [ ],              // queue up it()s to be run later
    itLabel = '',
    beforePhaseData,
    expectedPhaseData,
    genericIt = function(l, judge, before, after) {
        // process 'before' phase to produce an 'after'
        var actualAfter = judge.process(before),
            indexedActualAfter = _.indexBy(actualAfter.moves, 'r');

        // run the unit test
        it(l, function() {
            // compare this 'after' to the 'after' predicted by POSTSTATE
            for (var r = 0; r < after.moves.length; r++) {
                expect(after.moves[r]).to.eql(indexedActualAfter[after.moves[r].r]);
            }
        });
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
    // strip whitespace and comments
    line = line.split('#')[0].trim();

    try {
        var match;
        if (match = line.match(clearCommentReg) || line === '') {
            // do nothing
        }
        else if (match = line.match(variantReg)) {
            currentSubstate = UnitTestSubstateType.TEST;
            // use match in the context of variant file names
            match = _.camelCase(match[1]);

            var variantPath;
            if (process.env.TRAVIS)
                variantPath = path.resolve(path.join(__dirname, '../../variants/' + match + '/' + match + '.json'));
            else
                variantPath = path.resolve(path.join(__dirname, '../../../variants/' + match + '/' + match + '.json'));

            console.log('Acquiring variant file at ' + variantPath);

            // HACK: 50% of the time this returns null/partial data
            while (!variant || !variant.regions)
                variant = JSON.parse(fs.readFileSync(variantPath), { encoding: 'utf8' }, function(err) { if (err) throw err; });

            // instantiate judge
            judge = new Judge(variant);
        }
        else if (match = line.match(caseReg)) {
            currentSubstate = UnitTestSubstateType.TEST;
            itLabel = match[1];

            // start new old/expected phases to build
            beforePhaseData = expectedPhaseData = { year: 1901, season: 1, moves: [ ] };

            // pre-bump expectedPhaseData season
            expectedPhaseData.season++;
        }
        else if (match = line.match(prestateSetPhaseReg)) {
            currentSubstate = UnitTestSubstateType.TEST;
            var season = match[1],
                year = match[2],
                action = match[3];

            beforePhaseData.year = year;
            beforePhaseData.season = season;
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
            expectedPhaseData = beforePhaseData;
        }
        else if (line === 'POSTSTATE_DISLODGED') {
            currentSubstate = UnitTestSubstateType.POSTSTATE_DISLODGED;
        }
        else if (line === 'END') {
            currentSubstate = UnitTestSubstateType.TEST;

            // test has been built and can be run after the file has been processed
            itQueue.push(itWrapper(genericIt, this, [itLabel, judge, beforePhaseData, expectedPhaseData]));
        }
        else {
            // if none of the above apply, we must be in a substate of some sort
            switch (currentSubstate) {
                case UnitTestSubstateType.PRESTATE_SUPPLYCENTER:
                    match = line.match(stateReg);
                    var power = match[1][0], // only the first initial is relevant
                        unitType = match[2],
                        region = match[3];
                    unitType = UnitType.toUnitType(unitType);

                    var order = _.find(beforePhaseData.moves, { r: region.toUpperCase() });
                    if (order) {
                        order.unit = unitTemplate;
                    }
                    else {
                        beforePhaseData.moves.push({
                            r: region.toUpperCase(),
                            sc: {
                                ownedBy: power
                            }
                        });
                    }

                    break;
                case UnitTestSubstateType.PRESTATE:
                    match = line.match(stateReg);
                    var power = match[1][0], // only the first initial is relevant
                        unitType = match[2],
                        region = match[3];
                    unitType = UnitType.toUnitType(unitType);

                    var unitTemplate = {
                        type: unitType,
                        power: power,
                        order: {
                            // to be filled in at ORDERS state
                        }
                    };

                    var order = _.find(beforePhaseData.moves, { r: region.toUpperCase() });
                    if (order) {
                        order.unit = unitTemplate;
                    }
                    else {
                        beforePhaseData.moves.push({
                            r: region.toUpperCase(),
                            unit: unitTemplate
                        });
                    }
                    break;

                case UnitTestSubstateType.ORDERS:
                    var unitLocation,
                        unitType,
                        unitAction,
                        power,
                        unitTarget,
                        unitTargetTarget,
                        order;

                    if (line.toUpperCase().indexOf('BUILD') > 0 || line.toUpperCase().indexOf('REMOVE') > 0) {
                        match = line.match(buildOrdersReg);
                        power = match[1][0];
                        unitAction = match[2];
                        unitType = match[3];
                        unitLocation = match[4];

                        // it is assumed a corresponding move was NOT declared in PRESTATE
                        order = {
                            r: unitLocation.toUpperCase(),
                            unit: {
                                power: power,
                                order: {
                                    action: OrderType.toOrderType(unitAction)
                                }
                            }
                        };
                        if (unitType)
                            order.unit.order.unitType = unitType;
                        beforePhaseData.moves.push(order);
                    }
                    else {
                        match = line.match(ordersReg);
                        power = match[1][0]; // only the first initial is relevant
                        unitLocation = match[2].toUpperCase().split(/[\/\.]/);
                        unitAction = match[3];
                        unitTarget = match[4];
                        unitTargetTarget = match[5];

                        if (unitTarget)
                            unitTarget = unitTarget.toUpperCase().split(/[\/\.]/);
                        if (unitTargetTarget)
                            unitTargetTarget = unitTargetTarget.toUpperCase().split(/[\/\.]/);

                        // it is assumed a corresponding unit was declared in PRESTATE
                        order = _.find(beforePhaseData.moves, { r: unitLocation[0] });

                        // TODO: after PRESTATE stuff is done, order should always exist
                        if (order) {
                            order.unit.power = power;
                            order.unit.order.action = OrderType.toOrderType(unitAction);
                            if (order.unit.order.action !== 'hold')
                                order.unit.order.y1 = unitTarget.join('.');
                            if (unitTargetTarget) // i.e., target unit exists and is also not holding
                                order.unit.order.y2 = unitTargetTarget.join('.');
                        }
                    }
                    break;

                case UnitTestSubstateType.POSTSTATE:
                    match = line.match(stateReg);
                    var power = match[1][0], // only the first initial is relevant
                        unitType = match[2],
                        region = match[3];
                    unitType = UnitType.toUnitType(unitType);

                    var unitTemplate = {
                        type: unitType,
                        power: power,
                        order: {
                            // to be filled in at ORDERS state
                        }
                    };

                    var order = _.find(expectedPhaseData.moves, { r: region.toUpperCase() });
                    if (order) {
                        order.unit = unitTemplate;
                    }
                    else {
                        expectedPhaseData.moves.push({
                            r: region.toUpperCase(),
                            unit: unitTemplate
                        });
                    }
                    break;

                case UnitTestSubstateType.POSTSTATE_DISLODGED:
                    break;

                case UnitTestSubstateType.POSTSTATE_RESULTS:
                    break;
            }
        }
    } catch (ex) {
        console.error('Failure processing line \'' + line + '\': ' + ex);
        throw ex;
    }
});

stream.on('end', function() {
    // run all tests
    describe('DATC', function() {
        try {
        while (itQueue.length > 0)
            (itQueue.shift())();
        } catch (ex) { console.log(ex); }
    });
});
