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
`);

module.exports = {
    highlightOnMouseOver,
    highlightOnMouseLeave,
    onLoadPositionLabels,
}