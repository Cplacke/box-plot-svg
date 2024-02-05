const { mergeConfig } = require("./utils");

const highlightOnMouseOver = (plotId, fillTags, showTags, plotConfig) => { 
    return `
        window.document.querySelectorAll('#${plotId} ${fillTags.join(',')}')
            .forEach((element) => {
                element.setAttribute('fill', '${plotConfig.color.fillHover}');
            });
        window.document.querySelectorAll('#${plotId} ${showTags.join(',')}')
            .forEach((element) => {
                element.setAttribute('display', '1');
            });
    `.replace(/\s*/g, '');
}
const highlightOnMouseLeave = (plotId, fillTags, showTags, plotConfig) => {
    return `
        window.document.querySelectorAll('#${plotId} ${fillTags.join(',')}')
            .forEach((element) => {
                element.setAttribute('fill', '${plotConfig.color.fill}');
            });
        window.document.querySelectorAll('#${plotId} ${showTags.join(',')}')
            .forEach((element) => {
                element.setAttribute('display', 'none');
            });
    `.replace(/\s*/g, '');
}

const positionLabels = (plotId, plotConfig) => {
    plotConfig = mergeConfig(plotConfig);
    var boxPlotSVG = window.document.querySelector(`#${plotId}`);
    var labelSVGs = window.document.querySelectorAll(`#${plotId} .label-box`);
    var textBoxRect = window.document.querySelector(`#${plotId} .label-box rect`);

    var labelBoxPercentage = (textBoxRect.height.baseVal.value/boxPlotSVG.getBBox().height)*100;

    if (plotConfig.inverted == true) {
        window.document.querySelector(`#${plotId} #maxLabelSvg`).setAttribute('y', `${plotConfig.padding}%`);
        window.document.querySelector(`#${plotId} #minLabelSvg`).setAttribute('y', `${100-plotConfig.padding-labelBoxPercentage}%`);
    } else {
        window.document.querySelector(`#${plotId} #maxLabelSvg`).setAttribute('y', `${100-plotConfig.padding-labelBoxPercentage}%`);
        window.document.querySelector(`#${plotId} #minLabelSvg`).setAttribute('y', `${plotConfig.padding}%`);
    }

    var values = [];
    labelSVGs.forEach((element) => {
        values.push({ 
            elementId: element.id, 
            y: Number(element.getAttribute('y').toString().replace('%', ''))
        });
    });

    values.forEach((ele) => {
        if (!/min|max/.test(ele.elementId)) {
            ele.y = ele.y - (0.5*labelBoxPercentage);
        }
    });
    
    values.sort((a, b) => (a.y - b.y));
    values.forEach((curr, i) => {
        if (i < values.length-2) {
            const next = values[i+1];
            if (curr.y+labelBoxPercentage > next.y && !/min|max/.test(next.elementId)) {
                next.y = curr.y+labelBoxPercentage;
            }
        }
    });
    
    values.sort((a, b) => (b.y - a.y));
    values.forEach((curr, i) => {
        if (i < values.length-2) {
            const next = values[i+1];
            if (next.y+labelBoxPercentage > curr.y && !/min|max/.test(next.elementId)) {
                next.y = curr.y-labelBoxPercentage;
            }
        }
    });

    values.forEach((shiftedValue) => {
        const { elementId, y } = shiftedValue;
        window.document.querySelector(`#${plotId} #${elementId}`).setAttribute('y', y+'%');
        window.document.querySelector(`#${plotId} #${elementId.replace('LabelSvg', 'LinkLine')}`).setAttribute('y2', y+(0.5*labelBoxPercentage)+'%');
    });
    console.debug('box-plot-svg::onLoadPositionLabels::complete');
}

const onLoadPositionLabels = (plotId, plotConfig) => (`
    const position = ${
        positionLabels.toString()
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace("plotConfig = mergeConfig(plotConfig);", "")
    };
    position('${plotId}', ${JSON.stringify(plotConfig)});
`);

module.exports = {
    highlightOnMouseOver,
    highlightOnMouseLeave,
    onLoadPositionLabels,
    positionLabels,
}