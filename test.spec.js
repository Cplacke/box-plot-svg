const { createBoxPlotSVG } = require('./index');
const fs = require('fs');

fs.writeFileSync(
    './samples/box-plot-example.svg',
    createBoxPlotSVG({
        min: 10,
        max: 20,
        q3: 17,
        q1: 12,
        median: 15,
    },{
        staticLabels: true
    })
);
fs.writeFileSync(
    './samples/box-plot-full-range.svg',
    createBoxPlotSVG({
        min: 10,
        max: 100.00,
        q3: 99,
        q1: 11,
        median: 50.500000000100000000020000000003,
    })
);
fs.writeFileSync(
    './samples/box-plot-wide-range.svg',
    createBoxPlotSVG({
        min: 0,
        max: 100.00,
        q3: 66.000,
        q1: 33.000,
        median: 50.500000000100000000020000000003,
    })
);
fs.writeFileSync(
    './samples/box-plot-min-on-top.svg',
    createBoxPlotSVG({
        min: 0,
        max: 100.00,
        q3: 91.782,
        q1: 72.489,
        median: 82.1231,
    }, {
        inverted: true
    })
);
fs.writeFileSync(
    './samples/box-plot-test-scores.svg',
    createBoxPlotSVG({
        min: 0,
        max: 100.00,
        q3: 91.782,
        q1: 72.489,
        median: 82.1231,
    }, {
        inverted: true,
        staticLabels: true
    })
);
fs.writeFileSync(
    './samples/box-plot-large-decimals.svg',
    createBoxPlotSVG({
        min:     0.000000000000000000000000000000,
        max:   100.000000000000000000000000000000,
        q3:     91.000000000100000000020000000003,
        q1:     72.000000000100000000020000000003,
        median: 82.000000000100000000020000000003,
    }, {
        inverted: false
    })
);