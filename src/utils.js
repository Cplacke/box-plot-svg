
const percentage = (partialValue, totalValue) => {
    return (100 * partialValue) / totalValue;
}
const invert = (percentage) => {
    return Math.abs(percentage - 100);
}
const scaleUnit = (percentage, config) => {
    const scaler = (100 - config.padding*2)/100;
    return (percentage * scaler) + config.padding;
}
const getId = (svg) => {
    const exec = /id=\"(boxPlot-.*?)\"/.exec(svg);
    if (!exec[1]) {
        throw Error('id not found in svg string');
    }
    return exec[1];
}
// grid config settings
const defaultConfig = {
    padding: 2.5,
    boxWidth: 12.5,
    boxInset: 2,
    style: 'height: 100%;',
    text: {
        size: 12,
        padding: 5,
        radius: 0,
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

const mergeConfig = (config = {}) => {
    return {
        ...defaultConfig,
        ...config
    }
}


module.exports = {
    percentage,
    invert,
    scaleUnit,
    getId,
    defaultConfig,
    mergeConfig,
}