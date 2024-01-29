
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

module.exports = {
    percentage: percentage,
    invert: invert,
    scaleUnit: scaleUnit,
}