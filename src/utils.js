
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

module.exports = {
    percentage,
    invert,
    scaleUnit,
    getId
}