const { percentage, invert, scaleUnit } = require('./utils');

const createBoxPlotSvgElements = ({
    min, max, median, q1, q3
}, plotConfig) => {
    const plotElements = [];
    const plotAttributes = getPlotAttributes({ min, max, median, q1, q3 }, plotConfig)
    const labelAttributes = getLabelAttributes(plotAttributes, plotConfig);
    const boxPlotCenterX = plotConfig.padding+(0.5*plotConfig.boxWidth)+plotConfig.boxInset;

    // background graph number-line
    plotElements.push(`
        <line id="center-line"
            x1="${boxPlotCenterX}%" y1="${plotConfig.padding}%" 
            x2="${boxPlotCenterX}%" y2="${100 - plotConfig.padding}%"
            stroke="${plotConfig.color.line}" stroke-width="${plotConfig.stroke.line}"
        />
    `);

    // link lines on hover state
    plotElements.push(`
        <line id="maxLinkLine" display="none"
            x1="${boxPlotCenterX+plotConfig.boxInset}%" y1="${plotAttributes.max.y}%" 
            x2="${labelAttributes.textContainerX}%" y2="${labelAttributes.max.y+(0.5*labelAttributes.textBoxHeight)}%"
            stroke="${plotConfig.color.lineHover}" stroke-width="${plotConfig.stroke.line}"
        />
    `)
    plotElements.push(`
        <line id="q3LinkLine" display="none"
            x1="${boxPlotCenterX+(0.5*plotConfig.boxWidth)}%" y1="${plotAttributes.q3.y+(0.5*plotAttributes.q3.h)}%" 
            x2="${labelAttributes.textContainerX}%" y2="${labelAttributes.q3.y+(0.5*labelAttributes.textBoxHeight)}%"
            stroke="${plotConfig.color.lineHover}" stroke-width="${plotConfig.stroke.line}"
        />
    `)

    plotElements.push(`
        <line id="medianLinkLine" display="none"
            x1="${boxPlotCenterX+(0.5*plotConfig.boxWidth)+plotConfig.boxInset}%" y1="${plotAttributes.median.y}%" 
            x2="${labelAttributes.textContainerX}%" y2="${labelAttributes.median.y+(0.5*labelAttributes.textBoxHeight)}%"
            stroke="${plotConfig.color.lineHover}" stroke-width="${plotConfig.stroke.line}"
        />
    `)
    plotElements.push(`
        <line id="q1LinkLine" display="none"
            x1="${boxPlotCenterX+(0.5*plotConfig.boxWidth)}%" y1="${plotAttributes.q1.y+(0.5*plotAttributes.q1.h)}%" 
            x2="${labelAttributes.textContainerX}%" y2="${labelAttributes.q1.y+(0.5*labelAttributes.textBoxHeight)}%"
            stroke="${plotConfig.color.lineHover}" stroke-width="${plotConfig.stroke.line}"
        />
    `)
    plotElements.push(`
        <line id="minLinkLine" display="none"
            x1="${boxPlotCenterX+plotConfig.boxInset}%" y1="${plotAttributes.min.y}%" 
            x2="${labelAttributes.textContainerX}%" y2="${labelAttributes.min.y+(0.5*labelAttributes.textBoxHeight)}%"
            stroke="${plotConfig.color.lineHover}" stroke-width="${plotConfig.stroke.line}"
        />
    `)

    // inter-quartile boxes and median line
    plotElements.push(`
        <rect id="q3"
            height="${plotAttributes.q3.h}%" width="${plotConfig.boxWidth}%"
            x="${plotConfig.padding+plotConfig.boxInset}%" 
            y="${plotAttributes.q3.y}%"
            fill="${plotConfig.color.fill}"
            stroke="${plotConfig.color.border}" stroke-width="${plotConfig.stroke.box}"
            onmouseenter="${highlightOnMouseOver(['#q3', '#q3TextBox'], ['#q3LinkLine'], plotConfig)}"
            onmouseleave="${highlightOnMouseLeave(['#q3', '#q3TextBox'], ['#q3LinkLine'], plotConfig)}"
        />
    `);
    plotElements.push(`
        <rect id="q1"
            height="${plotAttributes.q1.h}%" width="${plotConfig.boxWidth}%"
            x="${plotConfig.padding+plotConfig.boxInset}%" 
            y="${plotAttributes.q1.y}%"
            fill="${plotConfig.color.fill}"
            stroke="${plotConfig.color.border}" stroke-width="${plotConfig.stroke.box}"
            onmouseenter="${highlightOnMouseOver(['#q1', '#q1TextBox'], ['#q1LinkLine'], plotConfig)}"
            onmouseleave="${highlightOnMouseLeave(['#q1', '#q1TextBox'], ['#q1LinkLine'], plotConfig)}"
        />
    `);
    plotElements.push(`
        <line id="median"
            x1="${plotConfig.padding}%" y1="${plotAttributes.median.y}%" 
            x2="${plotConfig.padding+plotConfig.boxWidth+(plotConfig.boxInset*2)}%" y2="${plotAttributes.median.y}%"
            stroke="${plotConfig.color.line}" stroke-width="${plotConfig.stroke.line*1.5}"
            onmouseenter="${highlightOnMouseOver(['#median', '#medianTextBox'], ['#medianLinkLine'], plotConfig)}"
            onmouseleave="${highlightOnMouseLeave(['#median', '#medianTextBox'], ['#medianLinkLine'], plotConfig)}"
        />
    `);
    plotElements.push(`
        <line id="max"
            x1="${plotConfig.padding+(0.5*plotConfig.boxWidth)}%" y1="${plotAttributes.max.y}%" 
            x2="${plotConfig.padding+(0.5*plotConfig.boxWidth)+(plotConfig.boxInset*2)}%" y2="${plotAttributes.max.y}%"
            stroke="${plotConfig.color.line}" stroke-width="${plotConfig.stroke.line*1.5}"
            onmouseenter="${highlightOnMouseOver(['#max', '#maxTextBox'], ['#maxLinkLine'], plotConfig)}"
            onmouseleave="${highlightOnMouseLeave(['#max', '#maxTextBox'], ['#maxLinkLine'], plotConfig)}"
        />
    `);
    plotElements.push(`
        <line id="min"
            x1="${plotConfig.padding+(0.5*plotConfig.boxWidth)}%" y1="${plotAttributes.min.y}%" 
            x2="${plotConfig.padding+(0.5*plotConfig.boxWidth)+(plotConfig.boxInset*2)}%" y2="${plotAttributes.min.y}%"
            stroke="${plotConfig.color.line}" stroke-width="${plotConfig.stroke.line*1.5}"
            onmouseenter="${highlightOnMouseOver(['#min', '#minTextBox'], ['#minLinkLine'], plotConfig)}"
            onmouseleave="${highlightOnMouseLeave(['#min', '#minTextBox'], ['#minLinkLine'], plotConfig)}"
        />
    `);
    
    // Labels and annotations 
    plotElements.push(`
        <rect id="maxTextBox"
            x="${labelAttributes.textContainerX}%" 
            y="${labelAttributes.max.y}%"
            rx="${plotConfig.text.radius}"
            width="${labelAttributes.textContainerWidth}%"
            height="${plotConfig.text.size*2+plotConfig.text.padding*2}%" 
            fill="${plotConfig.color.fill}"
            stroke="${plotConfig.color.border}" stroke-width="${0}"
            onmouseenter="${highlightOnMouseOver(['#max', '#maxTextBox'], ['#maxLinkLine'], plotConfig)}"
            onmouseleave="${highlightOnMouseLeave(['#max', '#maxTextBox'], ['#maxLinkLine'], plotConfig)}"
        />
            <text fill="${plotConfig.color.label}"
                x="${labelAttributes.textContainerX+plotConfig.text.padding}%" 
                y="${labelAttributes.max.textY}%" font-size="${plotConfig.text.size}vh"
                onmouseenter="${highlightOnMouseOver(['#max', '#maxTextBox'], ['#maxLinkLine'], plotConfig)}"
                onmouseleave="${highlightOnMouseLeave(['#max', '#maxTextBox'], ['#maxLinkLine'], plotConfig)}"
            > Max </text>
            <text fill="${plotConfig.color.text}"
                x="${labelAttributes.textContainerX+plotConfig.text.padding}%" 
                y="${labelAttributes.max.textY+plotConfig.text.size}%" font-size="${plotConfig.text.size}vh"
                onmouseenter="${highlightOnMouseOver(['#max', '#maxTextBox'], ['#maxLinkLine'], plotConfig)}"
                onmouseleave="${highlightOnMouseLeave(['#max', '#maxTextBox'], ['#maxLinkLine'], plotConfig)}"
            > ${max} </text>
    `);

    plotElements.push(`
        <rect id="q3TextBox"
            x="${labelAttributes.textContainerX}%" 
            y="${labelAttributes.q3.y}%"
            rx="${plotConfig.text.radius}"
            width="${labelAttributes.textContainerWidth}%"
            height="${plotConfig.text.size*2+plotConfig.text.padding*2}%" 
            fill="${plotConfig.color.fill}"
            stroke="${plotConfig.color.border}" stroke-width="${0}"
            onmouseenter="${highlightOnMouseOver(['#q3', '#q3TextBox'], ['#q3LinkLine'], plotConfig)}"
            onmouseleave="${highlightOnMouseLeave(['#q3', '#q3TextBox'], ['#q3LinkLine'], plotConfig)}"
        />
            <text fill="${plotConfig.color.label}"
                x="${labelAttributes.textContainerX+plotConfig.text.padding}%" 
                y="${labelAttributes.q3.textY}%" font-size="${plotConfig.text.size}vh"
                onmouseenter="${highlightOnMouseOver(['#q3', '#q3TextBox'], ['#q3LinkLine'], plotConfig)}"
                onmouseleave="${highlightOnMouseLeave(['#q3', '#q3TextBox'], ['#q3LinkLine'], plotConfig)}"
            > 75th Percentile </text>
            <text fill="${plotConfig.color.text}"
                x="${labelAttributes.textContainerX+plotConfig.text.padding}%" 
                y="${labelAttributes.q3.textY+plotConfig.text.size}%" font-size="${plotConfig.text.size}vh"
                onmouseenter="${highlightOnMouseOver(['#q3', '#q3TextBox'], ['#q3LinkLine'], plotConfig)}"
                onmouseleave="${highlightOnMouseLeave(['#q3', '#q3TextBox'], ['#q3LinkLine'], plotConfig)}"
            > ${q3} </text>
    `);
    plotElements.push(`
        <rect id="q1TextBox"
            x="${labelAttributes.textContainerX}%" 
            y="${labelAttributes.q1.y}%"
            rx="${plotConfig.text.radius}"
            width="${labelAttributes.textContainerWidth}%"
            height="${plotConfig.text.size*2+plotConfig.text.padding*2}%" 
            fill="${plotConfig.color.fill}"
            stroke="${plotConfig.color.border}" stroke-width="${0}"
            onmouseenter="${highlightOnMouseOver(['#q1', '#q1TextBox'], ['#q1LinkLine'], plotConfig)}"
            onmouseleave="${highlightOnMouseLeave(['#q1', '#q1TextBox'], ['#q1LinkLine'], plotConfig)}"
        />
            <text fill="${plotConfig.color.label}"
                x="${labelAttributes.textContainerX+plotConfig.text.padding}%" 
                y="${labelAttributes.q1.textY}%" font-size="${plotConfig.text.size}vh"
                onmouseenter="${highlightOnMouseOver(['#q1', '#q1TextBox'], ['#q1LinkLine'], plotConfig)}"
                onmouseleave="${highlightOnMouseLeave(['#q1', '#q1TextBox'], ['#q1LinkLine'], plotConfig)}"
            > 25th Percentile </text>
            <text fill="${plotConfig.color.text}"
                x="${labelAttributes.textContainerX+plotConfig.text.padding}%" 
                y="${labelAttributes.q1.textY+plotConfig.text.size}%" font-size="${plotConfig.text.size}vh"
                onmouseenter="${highlightOnMouseOver(['#q1', '#q1TextBox'], ['#q1LinkLine'], plotConfig)}"
                onmouseleave="${highlightOnMouseLeave(['#q1', '#q1TextBox'], ['#q1LinkLine'], plotConfig)}"
            > ${q1} </text>
    `);
    plotElements.push(`
        <rect id="medianTextBox"
            x="${labelAttributes.textContainerX}%" 
            y="${labelAttributes.median.y}%"
            rx="${plotConfig.text.radius}"
            width="${labelAttributes.textContainerWidth}%"
            height="${plotConfig.text.size*2+plotConfig.text.padding*2}%" 
            fill="${plotConfig.color.fill}"
            stroke="${plotConfig.color.border}" stroke-width="${0}"
            onmouseenter="${highlightOnMouseOver(['#median', '#medianTextBox'], ['#medianLinkLine'], plotConfig)}"
            onmouseleave="${highlightOnMouseLeave(['#median', '#medianTextBox'], ['#medianLinkLine'], plotConfig)}"
        />
            <text fill="${plotConfig.color.label}"
                x="${labelAttributes.textContainerX+plotConfig.text.padding}%" 
                y="${labelAttributes.median.textY}%" font-size="${plotConfig.text.size}vh"
                onmouseenter="${highlightOnMouseOver(['#median', '#medianTextBox'], ['#medianLinkLine'], plotConfig)}"
                onmouseleave="${highlightOnMouseLeave(['#median', '#medianTextBox'], ['#medianLinkLine'], plotConfig)}"
            > Median </text>
            <text fill="${plotConfig.color.text}"
                x="${labelAttributes.textContainerX+plotConfig.text.padding}%" 
                y="${labelAttributes.median.textY+plotConfig.text.size}%" font-size="${plotConfig.text.size}vh"
                onmouseenter="${highlightOnMouseOver(['#median', '#medianTextBox'], ['#medianLinkLine'], plotConfig)}"
                onmouseleave="${highlightOnMouseLeave(['#median', '#medianTextBox'], ['#medianLinkLine'], plotConfig)}"
            > ${median} </text>
    `);
    plotElements.push(`
        <rect id="minTextBox"
            x="${labelAttributes.textContainerX}%" 
            y="${labelAttributes.min.y}%"
            rx="${plotConfig.text.radius}"
            width="${labelAttributes.textContainerWidth}%"
            height="${plotConfig.text.size*2+plotConfig.text.padding*2}%" 
            fill="${plotConfig.color.fill}"
            stroke="${plotConfig.color.border}" stroke-width="${0}"
            onmouseenter="${highlightOnMouseOver(['#min', '#minTextBox'], ['#minLinkLine'], plotConfig)}"
            onmouseleave="${highlightOnMouseLeave(['#min', '#minTextBox'], ['#minLinkLine'], plotConfig)}"
        />
            <text fill="${plotConfig.color.label}"
                x="${labelAttributes.textContainerX+plotConfig.text.padding}%" 
                y="${labelAttributes.min.textY}%" font-size="${plotConfig.text.size}vh"
                onmouseenter="${highlightOnMouseOver(['#min', '#minTextBox'], ['#minLinkLine'], plotConfig)}"
                onmouseleave="${highlightOnMouseLeave(['#min', '#minTextBox'], ['#minLinkLine'], plotConfig)}"
            > Min </text>
            <text fill="${plotConfig.color.text}"
                x="${labelAttributes.textContainerX+plotConfig.text.padding}%" 
                y="${labelAttributes.min.textY+plotConfig.text.size}%" font-size="${plotConfig.text.size}vh"
                onmouseenter="${highlightOnMouseOver(['#min', '#minTextBox'], ['#minLinkLine'], plotConfig)}"
                onmouseleave="${highlightOnMouseLeave(['#min', '#minTextBox'], ['#minLinkLine'], plotConfig)}"
            > ${min} </text>
    `);

    return plotElements
}

/**
 * Generator functions that calculate heights, offsets, labels, etc...
 * all private functions
 */

const getPlotAttributes = ({
    min, max, median, q1, q3
}, plotConfig) => {
    const q1PercentStart = scaleUnit( percentage(Number(q1-min), (max-min)), plotConfig );
    const q3PercentStart = scaleUnit( percentage(Number(q3-min) , (max-min)), plotConfig );
    const medianPercentStart = scaleUnit( percentage(Number(median-min), (max-min)), plotConfig );
    // console.debug({ median, q1, q3, q1PercentStart, q3PercentStart, medianPercentStart }); 

    if (plotConfig.inverted) {
        return {
            q3: {
                h: invert(medianPercentStart) - invert(q3PercentStart),
                y: invert(q3PercentStart),
            },
            median: { 
                y: invert(medianPercentStart),
            },
            q1: {
                h: invert(q1PercentStart) - invert(medianPercentStart),
                y: invert(q1PercentStart) - (invert(q1PercentStart) - invert(medianPercentStart)), // subtract height to align
            },
            max: { y: plotConfig.padding },
            min: { y: 100-plotConfig.padding },
        }
    } else {
        return {
            q1: {
                h: medianPercentStart - q1PercentStart,
                y: q1PercentStart,
            },
            median: { 
                y: medianPercentStart,
            },
            q3: {
                h: q3PercentStart - medianPercentStart,
                y: q3PercentStart - (q3PercentStart - medianPercentStart), // subtract height to align
            },
            min: { y: plotConfig.padding },
            max: { y: 100-plotConfig.padding },
        }
    }
}

const getLabelAttributes = ({
    q1, q3, median, max, min
}, plotConfig) => {
    const textContainerX = plotConfig.padding*7 + plotConfig.boxWidth;
    const textBoxHeight = plotConfig.text.size*2+plotConfig.text.padding*2;
    const textContainerWidth = 100 - plotConfig.padding*8 - plotConfig.boxWidth;
    const labelConfig = {
        min: { y: undefined, textY: undefined },
        max: { y: undefined, textY: undefined },
        q1: { y: undefined, textY: undefined },
        median: { y: undefined, textY: undefined },
        q3: { y: undefined, textY: undefined },
        textContainerX,
        textBoxHeight,
        textContainerWidth,
    }

    labelConfig.min.y = min.y;
    labelConfig.max.y = max.y-textBoxHeight;
    labelConfig.q1.y = q1.y+(0.5*q1.h)-(0.5*textBoxHeight);
    labelConfig.median.y = median.y-(0.5*textBoxHeight);
    labelConfig.q3.y = q3.y+(0.5*q3.h)-(0.5*textBoxHeight);

    if (plotConfig.inverted) {
        labelConfig.max.y = max.y;
        labelConfig.min.y = min.y-textBoxHeight;
    }


    // clean and fix any overlap that may have been calculated
    const keys = Object.keys(labelConfig);
    const values = keys.map((key) => ({
        // track all keys with y property
        key, y: labelConfig[key].y
    })).filter((val) => (!!val.y))

    // check top -> down
    values.sort((a, b) => (a.y - b.y));
    values.forEach((curr, i) => {
        // only shift up second to last element (no shifting max/min)
        if (i < values.length-2) {
            const next = values[i+1];
            // check for "overlapping", and shift down to "next pixel"
            if (curr.y+textBoxHeight > next.y) {
                next.y = curr.y+textBoxHeight;
            }
        }
    });
    
    // check bottom -> up
    values.sort((a, b) => (b.y - a.y));
    values.forEach((curr, i) => {
        // only shift up second to last element (no shifting max/min)
        if (i < values.length-2) {
            const next = values[i+1];
            // check for "overlapping", and shift up to "next pixel"
            if (next.y+textBoxHeight > curr.y) {
                next.y = curr.y-textBoxHeight;
            }
        }
    });

    // update y values that required shifting
    values.forEach((shiftedValue) => {
        const { key, y } = shiftedValue;
        labelConfig[key].y = y;
    });


    // set text height based on text box y position
    const textOffset = plotConfig.text.size+(0.5*plotConfig.text.padding);
    labelConfig.min.textY = labelConfig.min.y+textOffset;
    labelConfig.max.textY = labelConfig.max.y+textOffset;
    labelConfig.q1.textY = labelConfig.q1.y+textOffset;
    labelConfig.median.textY = labelConfig.median.y+textOffset;
    labelConfig.q3.textY = labelConfig.q3.y+textOffset;

    // console.debug(labelConfig);
    return labelConfig;
}

const highlightOnMouseOver = (fillTags, showTags, plotConfig) => { 
    return `
        window.document.querySelectorAll('${fillTags.join(',')}')
            .forEach((element) => {
                element.setAttribute('fill', '${plotConfig.color.fillHover}');
            });
        window.document.querySelectorAll('${showTags.join(',')}')
            .forEach((element) => {
                element.setAttribute('display', '1');
            });
    `.replace(/\s*/g, '');
}
const highlightOnMouseLeave = (fillTags, showTags, plotConfig) => {
    return `
        window.document.querySelectorAll('${fillTags.join(',')}')
            .forEach((element) => {
                element.setAttribute('fill', '${plotConfig.color.fill}');
            });
        window.document.querySelectorAll('${showTags.join(',')}')
            .forEach((element) => {
                element.setAttribute('display', 'none');
            });
    `.replace(/\s*/g, '');
}

module.exports = {
    createBoxPlotSvgElements: createBoxPlotSvgElements
};