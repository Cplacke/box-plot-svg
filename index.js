const { createBoxPlotSvgElements } = require('./src/graph')
const { onLoadPositionLabels } = require('./src/events')

// grid config settings
const defaultConfig = {
    padding: 2.5,
    boxWidth: 12.5,
    boxInset: 2,
    style: '',
    text: {
        size: 20,
        padding: 5,
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
    staticLabels: false, // when true, no script calculations or positioning based on values
}

const createBoxPlotSVG = ({
    min, max, q1, median, q3,
}, config = {}) => {
    const id = `boxPlot-${Date.now()}-${Math.floor(Math.random()*1000)}`;
    config = { // merge configs so all attributes are provided
        ...defaultConfig,
        ...config
    };
    const svg = `
        <svg id="${id}" viewBox="100% 100%" xmlns="http://www.w3.org/2000/svg" 
            style="background-color: transparent; font-family: ${config.text.font}; ${config.style}"
        > 
        ${ 
            createBoxPlotSvgElements({  
                min: min.toString(), 
                max: max.toString(), 
                q1: q1.toString(), 
                median: median.toString(), 
                q3: q3.toString(), 
            }, config) 
        }
        <script>${config.staticLabels ? '' : onLoadPositionLabels(id, config)}</script>
        </svg>
    `;
    return svg;
}

module.exports = {
    createBoxPlotSVG,
    defaultConfig,
}