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

const onLoadPositionLabels = (id, plotConfig) => (`
    var boxPlotSVG = window.document.querySelector('#${id}');
    var labelSVGs = window.document.querySelectorAll('.label-box');
    var textBoxRect = window.document.querySelector('.label-box rect');

    var labelBoxPercentage = (textBoxRect.height.baseVal.value/boxPlotSVG.getBBox().height)*100;

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
                next.y = curr.y+labelBoxPercentage;
            }
        }
    });
    
    values.sort((a, b) => (b.y - a.y));
    values.forEach((curr, i) => {
        if (i &lt; values.length-2) {
            const next = values[i+1];
            if (next.y+labelBoxPercentage &gt; curr.y &amp;&amp; !/min|max/.test(next.id)) {
                next.y = curr.y-labelBoxPercentage;
            }
        }
    });

    values.forEach((shiftedValue) => {
        const { id, y } = shiftedValue;
        window.document.querySelector('#'+id).setAttribute('y', y+'%');
        window.document.querySelector('#'+id.replace('LabelSvg', 'LinkLine')).setAttribute('y2', y+(0.5*labelBoxPercentage)+'%');
    });
    console.debug('box-plot-svg::onLoadPositionLabels::complete');
`);

module.exports = {
    highlightOnMouseOver,
    highlightOnMouseLeave,
    onLoadPositionLabels,
}