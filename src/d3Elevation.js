import * as d3 from 'd3';

export function d3Elevation(dataArr, canvas, color){
    //dimensions
    const margin = {
        top: 40, 
        right: 20, 
        bottom: 55,
        left: 100
    }

    const graphWidth = 500 - margin.left - margin.right;
    const graphHeight = 350 - margin.top - margin.bottom;

    // create svg in canvas
    const svg = d3.select(canvas)
        .append('svg')
        .attr('width', graphWidth + margin.left + margin.right)
        .attr('height', graphHeight + margin.top + margin.bottom)
        .call(makeResponsive)
        .attr('class', 'svgMain' );
    
    // append graph group element to svg
    const graph = svg.append('g')
        .attr('width', graphWidth)
        .attr('height', graphHeight)
        .attr('transform', `translate(${margin.left}, ${margin.top})`)
        .attr('class', 'svgGraph');

    //scales
    const x = d3.scaleTime().range([0, graphWidth]);
    const y = d3.scaleLinear().range([graphHeight, 0]);

    //append axes groups to graph as nested graphs
    const xAxisGroup = graph.append('g')
        .attr('class', 'x-axis')
        .attr('transform', `translate(0, ${graphHeight})`); // move to bottom of graph

    const yAxisGroup = graph.append('g')
        .attr('class', 'y-axis');

    // creating a d3 line path generator for first line
    const line = d3.line() 
        .x(function(d) { return x(new Date(d.dateTime)) })
        .y(function(d) { return y(d.elevation*3.28084) })
        .curve(d3.curveCardinal); // smoothing line

    // creating a line path element and appending it to graph
    const path = graph.append('path');
    
    const update = (dataArr) => {
        
        // sort data based on date 
        dataArr.sort((a,b) => new Date(a.dateTime) - new Date(b.dateTime));
        
        // set scale domains
        x.domain(d3.extent(dataArr, d => new Date(d.dateTime))); // extend will look thru all dates and return lowest & highest
        y.domain([d3.min(dataArr, d => d.elevation*3.28084)-200, d3.max(dataArr, d => d.elevation*3.28084)]); //max will find max distance for y-axis domain
        //y.domain([0, d3.max(dataArr, d => d.elevation*3.28084)]);
        
        // update path data, and join
        path.data([dataArr])
            .attr('fill', 'none')
            .attr('stroke', color) //rgb(246, 139, 40)
            .attr('stroke-width', 3)
            .attr('d', line)//; // calling line path generator to get data to draw our lines
            .attr('class', 'area');
   
        const xAxis = d3.axisBottom(x) // will create an axis based on the domain/range of the x-scale we set
            .ticks(7)
            .tickSize(-(graphHeight), 0)
            .tickFormat(d3.timeFormat('%H:%M')); // ex: June 2019
            
        const yAxis = d3.axisLeft(y) // will create a y-axis based on domain/range of the y scale we set
            .ticks(6)
            .tickSize(-(graphWidth), 0)
            .tickFormat(d => d + ' feet');        

        // generate axes shapes so we can see them
        xAxisGroup.call(xAxis); 
        yAxisGroup.call(yAxis);

        //rotate axis text
        xAxisGroup.selectAll('text')
            .attr('transform', 'rotate(-40)')
            .attr('text-anchor', 'end');

        return true;
        
    } // end update()

    update(dataArr);

    //resize the graph based on the screen width during rendering
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
        var ratio = parseFloat(350/500);
        function resize () {
            if(window.innerWidth > 1090){
                svg.attr('width', 500);
                svg.attr('height', 350);
            } else if(window.innerWidth > 960 && window.innerWidth < 1090){
                svg.attr('width', parseFloat(275/ratio));
                svg.attr('height', 275);
            } else if(window.innerWidth < 960 && window.innerWidth > 625){
                svg.attr('width', parseFloat(400/ratio));
                svg.attr('height', 400);
            } else if(window.innerWidth < 625 && window.innerWidth > 480){
                svg.attr('width', parseFloat(300/ratio));
                svg.attr('height', 300); 
            } else if(window.innerWidth < 480){
                svg.attr('width', parseFloat(200/ratio));
                svg.attr('height', 200);
            }
        }

    }

    
};
