import * as d3 from 'd3';

export function d3StatsGraph(dataArr){
    
    const svg = d3.select('.canvas')
        .append('svg')
        .attr('width', 500)
        .attr('height', 450)
        .call(makeResponsive);

    //create margins and dimensions
    const margin = {top: 20, right: 20, bottom: 100, left: 100};
    const graphWidth = 500 - margin.left - margin.right;
    const graphHeight = 450 - margin.top - margin.bottom;

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
        .range([0, graphWidth])
        .paddingInner(0.2)
        .paddingOuter(0.2);
    
    // color coding easy, medium, and hard
    var colors = d3.scaleOrdinal().range(["#1976d2"]);
    
    //create and call the axes
    const xAxis = d3.axisBottom(x)
    
    const yAxis = d3.axisLeft(y)
        .ticks(5)
        .tickFormat(d => d + ' runs');

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

        
        // get each mileagerange's length and add to state as the count for each one
        var count1 = dataArr.filter((item) => item.distance > 0 && item.distance <= 1.5 ).length;
        var count2 = dataArr.filter((item) => item.distance > 1.5 && item.distance <= 2.5 ).length;
        var count3 = dataArr.filter((item) => item.distance > 2.5 && item.distance <= 3.5 ).length;
        var count4 = dataArr.filter((item) => item.distance > 3.5 && item.distance <= 4.5 ).length;
        var count5 = dataArr.filter((item) => item.distance > 4.5 && item.distance <= 5.5 ).length;
        //console.log(count1, count2, count3, count4, count5);

        // arr of x and y axis data
        var countsArr = [ {"count": count1, "name": "0.0-1.5" }, 
                          {"count": count2, "name": "1.5-2.5" }, 
                          {"count": count3, "name": "2.5-3.5" },
                          {"count": count4, "name": "3.5-4.5" },
                          {"count": count5, "name": "4.5-5.5" }
                        ];
        
        // updating scale domains since they are dependent on new values
        y.domain([0, d3.max(countsArr.map(d => d.count))]);
        x.domain(countsArr.map(item => item.name));
       

        //join the data to rects
        const rects = graph.selectAll('rect')
            .data(countsArr);

        // remove unwanted rectangles
        rects.exit().remove();

        // update current shapes in dom
        rects.attr('width', x.bandwidth)
            .attr('fill', (d,i) => {
                return colors(i);
            })
            .attr('x', d => x(d.name));

        //append the enter selection to the dom
        rects.enter()
            .append('rect')
            .attr('height', 0)
            .attr('fill', (d,i) => {
                return colors(i);
            })
            .attr('x', d => x(d.name))
            .attr('y', graphHeight)
            .merge(rects) // merge the enter selection with current rects
            .transition(t)
                .attrTween('width', widthTween)
                .attr('y', d => y(d.count))
                .attr('height', d => graphHeight - y(d.count));

            rects.enter().append('text')
                .attr('x', d => x(d.name)+20)
                .attr('y', d => y(d.count) - 5)
                .text((d) => d.count);
 
            
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
        var ratio = 450/500;
        
        // resize graph based on screen size
        function resize () {
            if(window.innerWidth > 950){
                svg.attr('width', 450);
                svg.attr('height', 500);
            } else if(window.innerWidth < 950 && window.innerWidth >= 600){
                svg.attr('width', 450);
                svg.attr('height', 540);
            } else if(window.innerWidth < 600 && window.innerWidth >= 410){
                 svg.attr('width', 300);
                 svg.attr('height', 300);
            } else if(window.innerWidth <= 410){
                     svg.attr('width', 250/ratio);
                     svg.attr('height', 300);
            }
        }
    }

    update(dataArr);
} // end func d3EffPerc

