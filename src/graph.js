const { percentage, invert, scaleUnit } = require('./utils');
const { highlightOnMouseOver, highlightOnMouseLeave } = require('./events');

const createBoxPlotSvgElements = ({
    min, max, median, q1, q3
}, plotConfig, plotId) => {
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
        <line id="maxLinkLine" class="link-link"
            x1="${boxPlotCenterX+plotConfig.boxInset}%" y1="${plotAttributes.max.y}%" 
            x2="${labelAttributes.textContainerX}%" y2="${labelAttributes.max.y}%"
            stroke="${plotConfig.color.lineHover}" stroke-width="${plotConfig.stroke.line}"
        />
    `)
    plotElements.push(`
        <line id="q3LinkLine" display="none" class="link-link"
            x1="${boxPlotCenterX+(0.5*plotConfig.boxWidth)}%" y1="${plotAttributes.q3.y+(plotConfig.inverted ? 0 : plotAttributes.q3.h)}%" 
            x2="${labelAttributes.textContainerX}%" y2="${labelAttributes.q3.y}%"
            stroke="${plotConfig.color.lineHover}" stroke-width="${plotConfig.stroke.line}"
        />
    `)

    plotElements.push(`
        <line id="medianLinkLine" display="none" class="link-link"
            x1="${boxPlotCenterX+(0.5*plotConfig.boxWidth)+plotConfig.boxInset}%" y1="${plotAttributes.median.y}%" 
            x2="${labelAttributes.textContainerX}%" y2="${labelAttributes.median.y}%"
            stroke="${plotConfig.color.lineHover}" stroke-width="${plotConfig.stroke.line}"
        />
    `)
    plotElements.push(`
        <line id="q1LinkLine" display="none" class="link-link"
            x1="${boxPlotCenterX+(0.5*plotConfig.boxWidth)}%" y1="${plotAttributes.q1.y+(plotConfig.inverted ? plotAttributes.q1.h : 0)}%" 
            x2="${labelAttributes.textContainerX}%" y2="${labelAttributes.q1.y}%"
            stroke="${plotConfig.color.lineHover}" stroke-width="${plotConfig.stroke.line}"
        />
    `)
    plotElements.push(`
        <line id="minLinkLine" class="link-link"
            x1="${boxPlotCenterX+plotConfig.boxInset}%" y1="${plotAttributes.min.y}%" 
            x2="${labelAttributes.textContainerX}%" y2="${labelAttributes.min.y}%"
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
            onmouseenter="${highlightOnMouseOver(plotId, ['#q3', '#q3TextBox'], ['#q3LinkLine'], plotConfig)}"
            onmouseleave="${highlightOnMouseLeave(plotId, ['#q3', '#q3TextBox'], ['#q3LinkLine'], plotConfig)}"
        />
    `);
    plotElements.push(`
        <rect id="q1"
            height="${plotAttributes.q1.h}%" width="${plotConfig.boxWidth}%"
            x="${plotConfig.padding+plotConfig.boxInset}%" 
            y="${plotAttributes.q1.y}%"
            fill="${plotConfig.color.fill}"
            stroke="${plotConfig.color.border}" stroke-width="${plotConfig.stroke.box}"
            onmouseenter="${highlightOnMouseOver(plotId, ['#q1', '#q1TextBox'], ['#q1LinkLine'], plotConfig)}"
            onmouseleave="${highlightOnMouseLeave(plotId, ['#q1', '#q1TextBox'], ['#q1LinkLine'], plotConfig)}"
        />
    `);
    plotElements.push(`
        <line id="median"
            x1="${plotConfig.padding}%" y1="${plotAttributes.median.y}%" 
            x2="${plotConfig.padding+plotConfig.boxWidth+(plotConfig.boxInset*2)}%" y2="${plotAttributes.median.y}%"
            stroke="${plotConfig.color.line}" stroke-width="${plotConfig.stroke.line}"
            onmouseenter="${highlightOnMouseOver(plotId, ['#median', '#medianTextBox'], ['#medianLinkLine'], plotConfig)}"
            onmouseleave="${highlightOnMouseLeave(plotId, ['#median', '#medianTextBox'], ['#medianLinkLine'], plotConfig)}"
        />
    `);
    plotElements.push(`
        <line id="max"
            x1="${plotConfig.padding+(0.5*plotConfig.boxWidth)}%" y1="${plotAttributes.max.y}%" 
            x2="${plotConfig.padding+(0.5*plotConfig.boxWidth)+(plotConfig.boxInset*2)}%" y2="${plotAttributes.max.y}%"
            stroke="${plotConfig.color.line}" stroke-width="${plotConfig.stroke.line}"
            onmouseenter="${highlightOnMouseOver(plotId, ['#max', '#maxTextBox'], [], plotConfig)}"
            onmouseleave="${highlightOnMouseLeave(plotId, ['#max', '#maxTextBox'], [], plotConfig)}"
        />
    `);
    plotElements.push(`
        <line id="min"
            x1="${plotConfig.padding+(0.5*plotConfig.boxWidth)}%" y1="${plotAttributes.min.y}%" 
            x2="${plotConfig.padding+(0.5*plotConfig.boxWidth)+(plotConfig.boxInset*2)}%" y2="${plotAttributes.min.y}%"
            stroke="${plotConfig.color.line}" stroke-width="${plotConfig.stroke.line}"
            onmouseenter="${highlightOnMouseOver(plotId, ['#min', '#minTextBox'], [], plotConfig)}"
            onmouseleave="${highlightOnMouseLeave(plotId, ['#min', '#minTextBox'], [], plotConfig)}"
        />
    `);
    
    // Labels and annotations 
    plotElements.push(`
        <svg class="label-box" id="maxLabelSvg"
            x="${labelAttributes.textContainerX}%" 
            y="${labelAttributes.max.y}%"
        >
            <rect id="maxTextBox"
                rx="${plotConfig.text.radius}"
                width="${labelAttributes.textContainerWidth}%"
                height="${labelAttributes.textBoxHeight}px" 
                fill="${plotConfig.color.fill}"
                stroke="${plotConfig.color.border}" stroke-width="${0}"
                onmouseenter="${highlightOnMouseOver(plotId, ['#max', '#maxTextBox'], [], plotConfig)}"
                onmouseleave="${highlightOnMouseLeave(plotId, ['#max', '#maxTextBox'], [], plotConfig)}"
            />
                <text fill="${plotConfig.color.label}"
                    x="${plotConfig.text.padding}px" 
                    y="${labelAttributes.textLabelY}px" font-size="${plotConfig.text.size}px"
                    onmouseenter="${highlightOnMouseOver(plotId, ['#max', '#maxTextBox'], [], plotConfig)}"
                    onmouseleave="${highlightOnMouseLeave(plotId, ['#max', '#maxTextBox'], [], plotConfig)}"
                > Max </text>
                <text fill="${plotConfig.color.text}"
                x="${plotConfig.text.padding}px" 
                y="${labelAttributes.textValueY}px" font-size="${plotConfig.text.size}px"
                    onmouseenter="${highlightOnMouseOver(plotId, ['#max', '#maxTextBox'], [], plotConfig)}"
                    onmouseleave="${highlightOnMouseLeave(plotId, ['#max', '#maxTextBox'], [], plotConfig)}"
                > ${max} </text>
        </svg>
    `);

    plotElements.push(`
        <svg class="label-box" id="q3LabelSvg"
            x="${labelAttributes.textContainerX}%" 
            y="${labelAttributes.q3.y}%"
        >
            <rect id="q3TextBox"
                rx="${plotConfig.text.radius}"
                width="${labelAttributes.textContainerWidth}%"
                height="${labelAttributes.textBoxHeight}px" 
                fill="${plotConfig.color.fill}"
                stroke="${plotConfig.color.border}" stroke-width="${0}"
                onmouseenter="${highlightOnMouseOver(plotId, ['#q3', '#q3TextBox'], ['#q3LinkLine'], plotConfig)}"
                onmouseleave="${highlightOnMouseLeave(plotId, ['#q3', '#q3TextBox'], ['#q3LinkLine'], plotConfig)}"
            />
                <text fill="${plotConfig.color.label}"
                    x="${plotConfig.text.padding}px" 
                    y="${labelAttributes.textLabelY}px" font-size="${plotConfig.text.size}px"
                    onmouseenter="${highlightOnMouseOver(plotId, ['#q3', '#q3TextBox'], ['#q3LinkLine'], plotConfig)}"
                    onmouseleave="${highlightOnMouseLeave(plotId, ['#q3', '#q3TextBox'], ['#q3LinkLine'], plotConfig)}"
                > 75th Percentile </text>
                <text fill="${plotConfig.color.text}"
                    x="${plotConfig.text.padding}px" 
                    y="${labelAttributes.textValueY}px" font-size="${plotConfig.text.size}px"
                    onmouseenter="${highlightOnMouseOver(plotId, ['#q3', '#q3TextBox'], ['#q3LinkLine'], plotConfig)}"
                    onmouseleave="${highlightOnMouseLeave(plotId, ['#q3', '#q3TextBox'], ['#q3LinkLine'], plotConfig)}"
                > ${q3} </text>
        </svg>
    `);
    plotElements.push(`
        <svg class="label-box" id="q1LabelSvg"
            x="${labelAttributes.textContainerX}%" 
            y="${labelAttributes.q1.y}%"
        >
            <rect id="q1TextBox"
                rx="${plotConfig.text.radius}"
                width="${labelAttributes.textContainerWidth}%"
                height="${labelAttributes.textBoxHeight}px" 
                fill="${plotConfig.color.fill}"
                stroke="${plotConfig.color.border}" stroke-width="${0}"
                onmouseenter="${highlightOnMouseOver(plotId, ['#q1', '#q1TextBox'], ['#q1LinkLine'], plotConfig)}"
                onmouseleave="${highlightOnMouseLeave(plotId, ['#q1', '#q1TextBox'], ['#q1LinkLine'], plotConfig)}"
            />
                <text fill="${plotConfig.color.label}"
                    x="${plotConfig.text.padding}px" 
                    y="${labelAttributes.textLabelY}px" font-size="${plotConfig.text.size}px"
                    onmouseenter="${highlightOnMouseOver(plotId, ['#q1', '#q1TextBox'], ['#q1LinkLine'], plotConfig)}"
                    onmouseleave="${highlightOnMouseLeave(plotId, ['#q1', '#q1TextBox'], ['#q1LinkLine'], plotConfig)}"
                > 25th Percentile </text>
                <text fill="${plotConfig.color.text}"
                    x="${plotConfig.text.padding}px" 
                    y="${labelAttributes.textValueY}px" font-size="${plotConfig.text.size}px"
                    onmouseenter="${highlightOnMouseOver(plotId, ['#q1', '#q1TextBox'], ['#q1LinkLine'], plotConfig)}"
                    onmouseleave="${highlightOnMouseLeave(plotId, ['#q1', '#q1TextBox'], ['#q1LinkLine'], plotConfig)}"
                > ${q1} </text>
        </svg>
    `);
    plotElements.push(`
        <svg class="label-box" id="medianLabelSvg"
            x="${labelAttributes.textContainerX}%" 
            y="${labelAttributes.median.y}%"
        >
            <rect id="medianTextBox"
                rx="${plotConfig.text.radius}"
                width="${labelAttributes.textContainerWidth}%"
                height="${labelAttributes.textBoxHeight}px" 
                fill="${plotConfig.color.fill}"
                stroke="${plotConfig.color.border}" stroke-width="${0}"
                onmouseenter="${highlightOnMouseOver(plotId, ['#median', '#medianTextBox'], ['#medianLinkLine'], plotConfig)}"
                onmouseleave="${highlightOnMouseLeave(plotId, ['#median', '#medianTextBox'], ['#medianLinkLine'], plotConfig)}"
            />
                <text fill="${plotConfig.color.label}"
                    x="${plotConfig.text.padding}px" 
                    y="${labelAttributes.textLabelY}px" font-size="${plotConfig.text.size}px"
                    onmouseenter="${highlightOnMouseOver(plotId, ['#median', '#medianTextBox'], ['#medianLinkLine'], plotConfig)}"
                    onmouseleave="${highlightOnMouseLeave(plotId, ['#median', '#medianTextBox'], ['#medianLinkLine'], plotConfig)}"
                > Median </text>
                <text fill="${plotConfig.color.text}"
                    x="${plotConfig.text.padding}px" 
                    y="${labelAttributes.textValueY}px" font-size="${plotConfig.text.size}px"
                    onmouseenter="${highlightOnMouseOver(plotId, ['#median', '#medianTextBox'], ['#medianLinkLine'], plotConfig)}"
                    onmouseleave="${highlightOnMouseLeave(plotId, ['#median', '#medianTextBox'], ['#medianLinkLine'], plotConfig)}"
                > ${median} </text>
        </svg>
    `);
    plotElements.push(`
        <svg class="label-box" id="minLabelSvg"
            x="${labelAttributes.textContainerX}%" 
            y="${labelAttributes.min.y}%"
        >
            <rect id="minTextBox"
                rx="${plotConfig.text.radius}"
                width="${labelAttributes.textContainerWidth}%"
                height="${labelAttributes.textBoxHeight}px" 
                fill="${plotConfig.color.fill}"
                stroke="${plotConfig.color.border}" stroke-width="${0}"
                onmouseenter="${highlightOnMouseOver(plotId, ['#min', '#minTextBox'], [], plotConfig)}"
                onmouseleave="${highlightOnMouseLeave(plotId, ['#min', '#minTextBox'], [], plotConfig)}"
            />
                <text fill="${plotConfig.color.label}"
                    x="${plotConfig.text.padding}px" 
                    y="${labelAttributes.textLabelY}px" font-size="${plotConfig.text.size}px"
                    onmouseenter="${highlightOnMouseOver(plotId, ['#min', '#minTextBox'], [], plotConfig)}"
                    onmouseleave="${highlightOnMouseLeave(plotId, ['#min', '#minTextBox'], [], plotConfig)}"
                > Min </text>
                <text fill="${plotConfig.color.text}"
                    x="${plotConfig.text.padding}px" 
                    y="${labelAttributes.textValueY}px" font-size="${plotConfig.text.size}px"
                    onmouseenter="${highlightOnMouseOver(plotId, ['#min', '#minTextBox'], [], plotConfig)}"
                    onmouseleave="${highlightOnMouseLeave(plotId, ['#min', '#minTextBox'], [], plotConfig)}"
                > ${min} </text>
        </svg>
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
    const textContainerX = plotConfig.padding*3 + plotConfig.boxWidth + plotConfig.boxInset;
    const textBoxHeight = plotConfig.text.size*2+plotConfig.text.padding*2; // px
    const textContainerWidth = 100 - plotConfig.padding*4 - plotConfig.boxWidth - plotConfig.boxInset;
    const labelConfig = {
        min: { y: undefined },
        max: { y: undefined },
        q1: { y: undefined },
        median: { y: undefined },
        q3: { y: undefined },
        textLabelY: plotConfig.text.size+(plotConfig.text.padding*0.5), // px
        textValueY: (plotConfig.text.size*2)+(plotConfig.text.padding*0.5), // px
        textContainerX,
        textBoxHeight,
        textContainerWidth,
    }

    labelConfig.min.y = min.y;
    labelConfig.max.y = max.y;
    labelConfig.q1.y = q1.y+(0.5*q3.h);
    labelConfig.median.y = median.y;
    labelConfig.q3.y = q3.y+(0.5*q3.h);

    if (plotConfig.staticLabels) {
        labelConfig.min.y = plotConfig.inverted ? 85 : 7;
        labelConfig.max.y = plotConfig.inverted ? 7 : 85;
        labelConfig.q1.y = plotConfig.inverted ? 70: 30;
        labelConfig.median.y = 50;
        labelConfig.q3.y = plotConfig.inverted ? 30 : 70;
    }
    // console.debug(labelConfig);
    return labelConfig;
}

module.exports = {
    createBoxPlotSvgElements,
};