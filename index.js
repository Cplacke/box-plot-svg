const { createBoxPlotSvgElements } = require('./src/graph')

// grid config settings
const defaultConfig = {
    padding: 2.5,
    boxWidth: 12.5,
    boxInset: 2,
    text: {
        size: 2.8,
        padding: 1,
        radius: 2,
        font: 'OptumSans, helvetica, sans-serif, monospace',
    },
    stroke: {
        box: 1.5,
        line: 1.5
    },
    color: {
        fill: '#ECF2F9',
        line: '#1965AE',
        border: '#B4C9E7',
        label: '#1965AE',
        fillHover: '#D7E5F6',
        lineHover: '#B4C9E7',
        text: '#282A2E',
    },
    inverted: true, // when true max renders at top
}

const createBoxPlotSVG = ({
    min, max, q1, median, q3,
}, config = {}) => {
    // merge configs so all attributes are provided
    config = Object.assign(defaultConfig, config);

    const svg = `
        <svg viewBox="100% 100%" xmlns="http://www.w3.org/2000/svg" 
            style="background-color: transparent; font-family: ${config.text.font}"
        >${ 
            createBoxPlotSvgElements({  
                min: min.toString(), 
                max: max.toString(), 
                q1: q1.toString(), 
                median: median.toString(), 
                q3: q3.toString(), 
            }, defaultConfig)
        }</svg>
    `;
    return svg;
}

module.exports = {
    createBoxPlotSVG,
    defaultConfig,
}