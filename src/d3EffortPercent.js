import * as d3 from 'd3';

export function d3EffortPercent(dataArr, from, to){
    
    const svg = d3.select('.canvas')
        .append('svg')
        .attr('width', 700)
        .attr('height', 400)
        .call(makeResponsive);

    //create margins and dimensions
    const margin = {top: 20, right: 20, bottom: 100, left: 100};
    const graphWidth = 700 - margin.left - margin.right;
    const graphHeight = 400 - margin.top - margin.bottom;

    const graph = svg.append('g')
        .attr('width', graphWidth)
        .attr('height', graphHeight)
        .attr('transform', `translate(${margin.left}, ${margin.top})`);

    const xAxisGroup = graph.append('g')
        .attr('transform', `translate(0, ${graphHeight})`)
        .attr('class', 'x-axis-perc');

    const yAxisGroup = graph.append('g')
        .attr('class', 'y-axis-perc');

    // scales
    const y = d3.scaleLinear()
        .range([graphHeight, 0]);
        
    const x = d3.scaleBand()
        .range([0,550])
        .paddingInner(0.2)
        .paddingOuter(0.2);
    
    // color coding easy, medium, and hard
    var colors = d3.scaleOrdinal().range(["#25a2bb","#25BA88","#F68B28"]);

    //create and call the axes
    const xAxis = d3.axisBottom(x)
    
    const yAxis = d3.axisLeft(y)
        .ticks(10)
        .tickFormat(d => d*100 + '%');

    // update x-axis text
    xAxisGroup.selectAll('text')
        .attr('transform', 'rotate(-40)')
        .attr('text-anchor', 'end')
        .attr('fill', (d,i) => {
            return colors(i);
        });

    // transitions
    const t = d3.transition().duration(1500);

    //update function
    const update = (dataArr) => {

        let dataArr2 = dataArr;
        if(to && from){
            // filter activities by date
            dataArr2 = dataArr.filter((d) => { 
                return ((new Date(d.activityDate) >= new Date(from)) && 
                (new Date(d.activityDate) <= new Date(to) ))
            });
            
            //console.log(dataArr2);
        }
        // capture % of various effort levels in these vars
        var easy = 0.0;
        var medium = 0.0;
        var hard = 0.0;
        var total = dataArr2.length; // total # of all efforts

        // get a count of the different effort levels
        for(var i = 0; i < dataArr2.length; i++){
            
            var effort;
            effort = parseFloat(dataArr2[i].averagePace/60); // get average pace

            if(effort > 11.0){
                easy++;
            } else if (effort > 9.0 && effort <= 11.0) {
                medium++;
            } else if (effort <= 9.0){
                hard++;
            }   
        }
        // set percentages
        var easyP = easy/total;
        var mediumP = medium/total;
        var hardP = hard/total;
        var effortsArr = [{"percent": easyP, "name": "easy", "number": easy }, 
                          {"percent": mediumP, "name": "medium", "number": medium}, 
                          {"percent": hardP, "name": "hard", "number": hard}];
        
        // updating scale domains since they are dependent on new values
        y.domain([0, 1]);
        x.domain(effortsArr.map(item => item.name));
       

        //join the data to rects
        const rects = graph.selectAll('rect')
            .data(effortsArr);

        // remove unwanted rectangles
        rects.exit().remove();

        // update current shapes in dom
        rects.attr('width', x.bandwidth)
            .attr('fill', (d,i) => {
                return colors(i);
            })
            .attr('x', d => x(d.name));
        
        // create a div for the rectangles hover effect
        var div = d3.select('body')
            .append('div')
                .attr('class', 'tip')
                .style('opacity', 0);

        //append the enter selection to the dom and add the tooltip
        rects.enter()
            .append('rect')
            .on('mouseover', function(d, i) {
                d3.select(this)
                    .transition()
                    .duration(100)
                    .attr('opacity', 0.5);

                div.transition(100)
                    .duration(100)
                    .style('opacity', 0.9);

                // keep tooltip responsive at differing screen widths
                if(window.innerWidth > 700){
                    div.html(`<p>Number of runs: ${d.number}</br>Type: ${d.name}</p>`)
                        .style('left', (x(d.name)+ 55) + "px")
                        .style('top', (y(d.percent) + 110) + "px");
                } else if(window.innerWidth <= 700 && window.innerWidth >= 545){
                    div.html(`<p>Number of runs: ${d.number}</br>Type: ${d.name}</p>`)
                        .style('left', (d3.event.pageX - 58) + "px")
                        .style('top', (d3.event.pageY - 70) + "px");
                } else if(window.innerWidth < 545){
                    div.html(`<p>Number of runs: ${d.number}</br>Type: ${d.name}</p>`)
                        .style('left', (d3.event.pageX - 58) + "px")
                        .style('top', (d3.event.pageY - 70) + "px");
                } 
               
            })
            .on('mouseout', function(d) {
                d3.select(this)
                    .transition()
                    .duration(100)
                    .attr('opacity', 1);
                div.transition()
                    .duration(0)
                    .style('opacity', 0);
                    
            })
            .attr('height', 0)
            .attr('fill', (d,i) => {
                return colors(i);
            })
            .attr('x', d => x(d.name))
            .attr('y', graphHeight)
            .merge(rects) // merge the enter selection with current rects
            .transition(t)
                .attrTween('width', widthTween)
                .attr('y', d => y(d.percent))
                .attr('height', d => graphHeight - y(d.percent));

            rects.enter().append('text')
                .attr('x', d => x(d.name) + 55)
                .attr('y', d => y(d.percent) - 5)
                .text((d) => Math.round(d.percent*100) + "%");
 
            
        // call axes
        xAxisGroup.call(xAxis);
        yAxisGroup.call(yAxis);
        
    };
    
    // TWEEN
    const widthTween = (d) => {
        // define interpolation
        // d3.interpolate returns a function which we call i
        let i = d3.interpolate(0, x.bandwidth());

        // return a function which takes in a time ticker 't'
        return function(t){
            // return the value from the passing the ticker into the inerpolation
            return i(t);
        }
    }

    // resize the graph based on the screen width during rendering
    function makeResponsive(svg) {
        
        // get svg element and it's attributes
        var width = parseInt(svg.style('width'));
        var height = parseInt(svg.style('height'));
       
        //for initial load
        svg.attr('viewBox', '0 0 ' + width + ' ' + height)
            .attr('preserveAspectRatio', 'xMinYMid')
            .call(resize);       
        
        // for resize event
        window.addEventListener('resize', function(){
        
            svg.attr('viewBox', '0 0 ' + width + ' ' + height)
                .attr('preserveAspectRatio', 'xMinYMid')
                .call(resize);
        });
        var ratio = parseFloat(350/800);
        function resize () {
            if(window.innerWidth > 820){
                svg.attr('width', 800);
                svg.attr('height', 350);
            } else if(window.innerWidth > 720 && window.innerWidth < 820){
                svg.attr('width', parseFloat(300/ratio));
                svg.attr('height', 300);
            } else if(window.innerWidth < 720 && window.innerWidth > 480){
                svg.attr('width', parseFloat(200/ratio));
                svg.attr('height', 200);
            } else if(window.innerWidth < 480){
                svg.attr('width', parseFloat(175/ratio));
                svg.attr('height', 175); 
            } else if(window.innerWidth < 400){
                svg.attr('width', parseFloat(140/ratio));
                svg.attr('height', 140);
            }
        }

    }

    update(dataArr);
} // end func d3EffPerc

