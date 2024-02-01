
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
// string function to be called in SVG when loaded

const onLoadPositionLabels = (plotConfig) => (`
    var boxPlotSVG = window.document.querySelector('#boxPlot');
    var labelSVGs = window.document.querySelectorAll('.label-box');

    var labelBoxPercentage = (labelSVGs[0].children[0].height.baseVal.value/boxPlotSVG.getBBox().height)*100;

    if (${plotConfig.inverted} == true) {
        window.document.querySelector('#maxLabelSvg').setAttribute('y', ${plotConfig.padding}+'%');
        window.document.querySelector('#minLabelSvg').setAttribute('y', 100-${plotConfig.padding}-labelBoxPercentage+'%');
    } else {
        window.document.querySelector('#maxLabelSvg').setAttribute('y', 100-${plotConfig.padding}-labelBoxPercentage+'%');
        window.document.querySelector('#minLabelSvg').setAttribute('y', ${plotConfig.padding}+'%');
    }

    var values = [];
    labelSVGs.forEach((element) => {
        values.push({ 
            id: element.id, 
            y: Number(element.getAttribute('y').toString().replace('%', ''))
        });
    });

    values.forEach((ele) => {
        if (!/min|max/.test(ele.id)) {
            ele.y = ele.y - (0.5*labelBoxPercentage);
        }
    });
    
    values.sort((a, b) => (a.y - b.y));
    values.forEach((curr, i) => {
        if (i &lt; values.length-2) {
            const next = values[i+1];

            if (curr.y+labelBoxPercentage &gt; next.y &amp;&amp; !/min|max/.test(next.id)) {
                console.info(i, 'end: ', curr.y+labelBoxPercentage, '; next:', next.y);
                next.y = curr.y+labelBoxPercentage;
            }
        }
    });
    console.info(values);

    
    values.sort((a, b) => (b.y - a.y));
    values.forEach((curr, i) => {
        if (i &lt; values.length-2) {
            const next = values[i+1];
            if (next.y+labelBoxPercentage &gt; curr.y &amp;&amp; !/min|max/.test(next.id)) {
                next.y = curr.y-labelBoxPercentage;
                console.info('SHFIT SFHIT');
            }
        }
    });

    values.forEach((shiftedValue) => {
        const { id, y } = shiftedValue;
        console.info(id, y);
        window.document.querySelector('#'+id).setAttribute('y', y+'%');
        window.document.querySelector('#'+id.replace('LabelSvg', 'LinkLine')).setAttribute('y2', y+(0.5*labelBoxPercentage)+'%');
    });
    console.info(values);
`)

// clean and fix any overlap that may have been calculated
const dep = () => {
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
            // ! need to find new way to detect overlaps due to mixed units `%` and `px`s
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
            // ! need to find new way to detect overlaps due to mixed units `%` and `px`s
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
}

module.exports = {
    percentage,
    invert,
    scaleUnit,
    onLoadPositionLabels
}