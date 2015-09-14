// A standalone sandbox server.

var express = require('express');
var judge = require('./judge.js');
var variant = require('./standard.json');

// Orders to try go here.
// TODO: Take input from a file.
var orders = [{
        year: 1901,
        season: 1,
        power: 'A',
        moves: [{
                u: 'VIE'
            }
        ]
    }, {
        year: 1901,
        season: 1,
        power: 'E',
        moves: [{
                u: 'LON'
            }, {
                u: 'EDI'
            }
        ]
    }
];

var app = express();
judge(variant).process(orders);

app.listen(9000, process.env.IP, function () {
  console.log('Express server listening on %d', 9000);
});