import * as d3 from 'd3';
//import firebase from './Firebase';


// d3 code for to generate a graph of avgPace over time
export function d3AvgPace(dataArr, distance, effort, from, to){
    //dimensions
    const margin = {
        top: 40, 
        right: 20, 
        bottom: 55,
        left: 100
    }

    const graphWidth = 800 - margin.left - margin.right;
    const graphHeight = 350 - margin.top - margin.bottom;

    // create svg in canvas
    const svg = d3.select('.canvas')
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

    // creating a d3 line path generator
    const line = d3.line()
        .x(function(d) { return x(new Date(d.activityDate)) })
        .y(function(d) { return y(d.averagePace/60) });

    // creating a line path element and appending it to graph
    const path = graph.append('path');

    const update = (dataArr) => {
        // filter based on dates
        dataArr = dataArr.filter((d) => { 
               
            return ((new Date(d.activityDate) >= new Date(from)) && 
            (new Date(d.activityDate) <= new Date(to) ))
        });
        // filter based on distance selected
        dataArr = dataArr.filter(((d) => (d.distance < distance + 0.5) && (d.distance > distance - 0.5)));
        // filter based on effort level selected
        switch(effort){
            case "all":
                break;
            case "easy":
                dataArr = dataArr.filter((d) => d.averagePace/60 > 11.0);
                break;
            case "medium":
                dataArr = dataArr.filter((d) => d.averagePace/60 > 9.0 && d.averagePace/60 <= 11.0 );
                break;
            case "hard":
                dataArr = dataArr.filter((d) => d.averagePace/60 <= 9.0);
                break;
            default:
                break;
        }
        //console.log(dataArr);
        // catch an empty array and give usr feedback
        if(dataArr.length === 0){
            var msg = d3.select('.innerCanvas').append('div');
            msg.html(`<h3 class="noData">Sorry, there is no data that matches these requirements. Try something else.</h3>`);
        } 
     
        // sort data based on date 
        dataArr.sort((a,b) => new Date(a.activityDate) - new Date(b.activityDate));
        
        // set scale domains
        x.domain(d3.extent(dataArr, d => new Date(d.activityDate))); // extend will look thru all dates and return lowest & highest
        y.domain([0, d3.max(dataArr, d => d.averagePace/60)]); //max will find max distance for y-axis domain

        // update path data, and join
        path.data([dataArr])
            .attr('fill', 'none')
            .attr('stroke', 'rgb(246, 139, 40)')
            .attr('stroke-width', 8)
            .attr('d', line); // calling line path generator to get data to draw our lines

        //create circles for data objects and join data to selection
        const circles = graph.selectAll('circle')
            .data(dataArr)
            

        // remove unwanted points
        circles.exit().remove();
        
        // update current points
        circles.attr('cx', d => x(new Date(d.activityDate))) // center x coord
            .attr('cy', d => y(d.averagePace/60)); // center y coord
           

        // create a div for the circle hover effect
        var div = d3.select('body')
            .append('div')
                .attr('class', 'tip')
                .style('opacity', 0)
                .style('display', 'none');        

        // add new points
        circles.enter()
            .append('circle')
                .attr('r', 3) // set radius
                .attr('class', 'circ')
                .attr('fill', '#fff3e0')
                .attr('stroke', 'rgb(246, 139, 40)')
                .attr('stroke-width', 1.5)
                .attr('cx', d => x(new Date(d.activityDate))) // center x coord
                .attr('cy', d => y(d.averagePace/60)) // center y coord
                .on('mouseover', function(d,i) {

                    var seconds = "0"; 
                    // formatting seconds so 1-9 secs have a zero in front
                    if(d.averagePaceSeconds < 10){
                        seconds += d.averagePaceSeconds.toString();
                    } else {
                        seconds = d.averagePaceSeconds.toString();
                    }
                    
                    // code for displaying the tooltip
                    d3.select(this)
                        .transition()
                        .duration(100)
                        .attr('r', 6);
                    
                    div.transition(100)
                        .duration(100)
                        .style('opacity', 0.9)
                        .style('display', '');
                    div.html(
                        `<p>${d.averagePaceMinutes}:${seconds} min/mi </br>
                         ${new Date(d.activityDate).toDateString()}</p>`
                        )
                        .style('left', (d3.event.pageX - 58) + "px")
                        .style('top', (d3.event.pageY - 70) + "px");
                })
                .on('mouseout', function(d,i) {
                    d3.select(this)
                        .transition()
                        .duration(0)
                        .attr('r', 3);
                        
                     div.transition()
                        .duration(0)
                        .style('opacity', 0)
                        .style('display', 'none');
                })
                .on('click', (d) => {
                    let href = 'http://www.strava.com/activities/';
                    let str = d.activityID.toString();
                    href += str;
                    window.open(href, '_blank');
                });

        const xAxis = d3.axisBottom(x) // will create an axis based on the domain/range of the x-scale we set
            .ticks(7)
            .tickSize(-(graphHeight), 0)
            .tickFormat(d3.timeFormat('%b %Y')); // ex: June 2019
            
        const yAxis = d3.axisLeft(y) // will create a y-axis based on domain/range of the y scale we set
            .ticks(6)
            .tickSize(-(graphWidth), 0)
            .tickFormat(d => d + 'min/mi');

        

        // generate axes shapes so we can see them
        xAxisGroup.call(xAxis); 
        yAxisGroup.call(yAxis);

        //rotate axis text
        xAxisGroup.selectAll('text')
        .attr('transform', 'rotate(-40)')
        .attr('text-anchor', 'end');

        //console.log(dataArr);
        return true;
        
    } // end update()

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
    
} //D3 code for chart

