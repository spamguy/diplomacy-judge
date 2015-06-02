// This spec file parses the Diplomacy Adjudication Test Cases file and spits out one Jasmine unit test per item.

var express = require('express'),
    LineByLineReader = require('line-by-line');

var clearCommentReg = new RegExp(/^\s*#\s.*$/),
    variantReg = new RegExp(/^VARIANT_ALL\s+(\S*)\s*$/),
    caseReg = new RegExp(/^CASE\\s+(.*)$/),
    prestateSetPhaseReg = new RegExp(/^PRESTATE_SETPHASE\\s+(\\S+)\\s+(\\d+),\\s+(\\S+)\\s*$/),
    stateReg = new RegExp(/^([^:\\s]+):?\\s+(\\S+)\\s+(\\S+)\\s*$/),
    ordersReg = new RegExp(/^([^:]+):\\s+(.*)$/),
    preOrderReg = new RegExp(/^(SUCCESS|FAILURE):\\s+([^:]+):\\s+(.*)$/);

// pull in DATC file
var lr = new LineByLineReader('test/datc_v2.4_06.txt');

lr.on('error', function (err) {
    console.log(err);
});

lr.on('line', function(line) {
    if (clearCommentReg.test(line)) {
        // use case comment header as it() label
        var label = line.replace('# ', '').trim();
        //console.log(label);
    }
    else if (variantReg.test(line))
        ;//console.log(line + ' is a variant reg');
});
