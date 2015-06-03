// This spec file parses the Diplomacy Adjudication Test Cases file and spits out one Jasmine unit test per item.

var express = require('express'),
    LineByLineReader = require('line-by-line'),
    app = express();

var variant = null;

var clearCommentReg = new RegExp(/^\s*#.*$/),
    variantReg = new RegExp(/^VARIANT_ALL\s+(\S*)\s*$/);/*,
    caseReg = new RegExp(/^CASE\\s+(.*)$/),
    prestateSetPhaseReg = new RegExp(/^PRESTATE_SETPHASE\\s+(\\S+)\\s+(\\d+),\\s+(\\S+)\\s*$/),
    stateReg = new RegExp(/^([^:\\s]+):?\\s+(\\S+)\\s+(\\S+)\\s*$/),
    ordersReg = new RegExp(/^([^:]+):\\s+(.*)$/),
    preOrderReg = new RegExp(/^(SUCCESS|FAILURE):\\s+([^:]+):\\s+(.*)$/);*/

var itLabel = 1,
    itData = null,
    itExpectations = [ ];

describe('DATC', function() {
    // pull in DATC file and begin reading
    var lr = new LineByLineReader('test/datc_v2.4_06.txt');

    lr.on('error', function (err) {
        console.log(err);
    });

    lr.on('line', function(line) {
        if (clearCommentReg.test(line)) {
        //     // use case comment header as it() label
        //     //var label = line.replace('# ', '').trim();
        //     //console.log(label);
        }
        else if (variantReg.test(line)) {
        //
        }
        else if (line.trim() === 'END') {
            // it is safe to run the test
        }
    });
});
