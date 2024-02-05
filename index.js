const { createBoxPlotSvgElements } = require('./src/graph')
const { getId, mergeConfig } = require('./src/utils')
const { onLoadPositionLabels, positionLabels } = require('./src/events')


const createBoxPlotSVG = ({
    min, max, q1, median, q3,
}, config = {}) => {
    const id = `boxPlot-${Date.now()}-${Math.floor(Math.random()*1000)}`;
    config = mergeConfig(config);
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
    positionLabels,
    getId
}