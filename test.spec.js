const { createBoxPlotSVG } = require('./index');
const fs = require('fs');

const boxPlotExample = createBoxPlotSVG({
    min: 10,
    max: 20,
    q3: 17,
    q1: 12,
    median: 15,
},{
    staticLabels: true
})
const boxPlotFullRange = createBoxPlotSVG({
    min: 10,
    max: 100.00,
    q3: 99,
    q1: 11,
    median: 50.500000000100000000020000000003,
})
const boxPlotWideRange = createBoxPlotSVG({
    min: 0,
    max: 100.00,
    q3: 66.000,
    q1: 33.000,
    median: 50.500000000100000000020000000003,
})
const boxPlotMinOn = createBoxPlotSVG({
    min: 0,
    max: 100.00,
    q3: 91.782,
    q1: 72.489,
    median: 82.1231,
}, {
    inverted: true
})
const boxPlotTestScores = createBoxPlotSVG({
    min: 0,
    max: 100.00,
    q3: 91.782,
    q1: 72.489,
    median: 82.1231,
}, {
    inverted: true,
    staticLabels: true
})
const boxPlotLargeDecimals = createBoxPlotSVG({
    min:     0.000000000000000000000000000000,
    max:   100.000000000000000000000000000000,
    q3:     91.000000000100000000020000000003,
    q1:     72.000000000100000000020000000003,
    median: 82.000000000100000000020000000003,
})
const boxPlotLowStack = createBoxPlotSVG({
    min: 0,
    max: 50,
    q3: 5,
    q1: 0,
    median: 2,
})
const boxPlotHighStack = createBoxPlotSVG({
    min: 0,
    max: 50,
    q3: 50,
    q1: 40,
    median: 47,
})
const boxPlotMidRange = createBoxPlotSVG({
    min: 25,
    max: 60,
    q3: 50,
    q1: 40,
    median: 47,
})
const boxPloy90s = createBoxPlotSVG({
    min: 65,
    max: 99,
    q3: 82,
    q1: 79,
    median: 80,
})
const boxCompMatch = createBoxPlotSVG({
    max: 69.94350000500040000,
    min: 6.245628,
    q3: 34.75000,
    q1: 23.645500050,
    median: 29.000000000100,
})

fs.writeFileSync(
    './samples/boxPlotExample.svg',
    boxPlotExample
);
fs.writeFileSync(
    './samples/boxPlotFullRange.svg',
    boxPlotFullRange
);
fs.writeFileSync(
    './samples/boxPlotWideRange.svg',
    boxPlotWideRange
);
fs.writeFileSync(
    './samples/boxPlotMinOnTop.svg',
    boxPlotMinOn
);
fs.writeFileSync(
    './samples/boxPlotTestScores.svg',
    boxPlotTestScores
);
fs.writeFileSync(
    './samples/boxPlotLargeDecimals.svg',
    boxPlotLargeDecimals
);
fs.writeFileSync(
    './samples/boxPlotLowStack.svg',
    boxPlotLowStack
);
fs.writeFileSync(
    './samples/boxPlotHighStack.svg',
    boxPlotHighStack
);
fs.writeFileSync(
    './samples/boxPlotMidRange.svg',
    boxPlotMidRange
);
fs.writeFileSync(
    './samples/boxPloy90s.svg',
    boxPloy90s
);
fs.writeFileSync(
    './samples/boxCompMatch.svg',
    boxPloy90s
);

const all = [
    // boxPlotExample,
    boxPlotFullRange,
    boxPlotWideRange,
    boxPlotMinOn,
    boxPlotLargeDecimals,
    boxPlotLowStack,
    boxPlotHighStack,
    boxPlotMidRange,
    boxPloy90s,
    boxCompMatch
]
fs.writeFileSync(
    './samples/box-plot-all.html',
    `
        <html>
            <h1> Sample Box Plots </h1>
            <p> 
                Each box plot has dynamically rendered labels that appear next to their corresponding graphical element, this is needed to avoid overlapping of labels and "smushed" data would be illegible 
            </p>
            </p>
                They also each have a aspect of interactivity when mouse-ing over either the label or graphical element the related boxes then become highlighted with another color to distinguish them as well as link line that then appears as opposed to havening it always rendered on the graph.
            </p>
            <div style="display: flex; flex-wrap: wrap; margin: 0 50px">
                ${
                    all.map((svg) => {
                        return `
                            <div style="width: 210px; height: 300px; overflow-x: hidden; margin: 10px;">
                                ${ svg }
                            </div>
                        `
                    }).join('')
                }
            </div>

            <div>
                <h3> Default Color Hex Codes </h3>
                <div style="width: 300px;">
                    <div style="color: #282A2E; background-color: #ECF2F9; padding: 2px 10px"> fill: '#ECF2F9' </div>
                    <div style="color: #282A2E; background-color: #1965AE; padding: 2px 10px"> line: '#1965AE' </div>
                    <div style="color: #282A2E; background-color: #B4C9E7; padding: 2px 10px"> border: '#B4C9E7' </div>
                    <div style="color: #282A2E; background-color: #1965AE; padding: 2px 10px"> label: '#1965AE' </div>
                    <div style="color: #282A2E; background-color: #D7E5F6; padding: 2px 10px"> fillHover: '#D7E5F6' </div>
                    <div style="color: #282A2E; background-color: #B4C9E7; padding: 2px 10px"> lineHover: '#B4C9E7' </div>
                    <div style="color: #ECF2F9; background-color: #282A2E; padding: 2px 10px"> text: '#282A2E' </div>
                </div>
                <p> these are configurable and can be refined and changed to fit our use case, these were pulled from the comps using color picker and may be slightly off </p> 
            </div>
        </html>
    `
)