//Reference: https://www.d3-graph-gallery.com/index.html

function createDonutChart(){

    // The radius of the pieplot is half the WIDTH or half the HEIGHT (smallest one). I subtract a bit of margin.
    var radius = Math.min(WIDTH, HEIGHT) / 2

    d3.csv("data/Data.csv").then(function(data) {
        
        var svg = d3.select("#DONUT_CHART")
            .append("svg")
            .attr("width", WIDTH)
            .attr("height", HEIGHT)
            .append("g")
            .attr("transform", "translate(" + (WIDTH / 2 + MARGIN.LEFT) + "," + (HEIGHT / 2) + ")");

        // set the color scale
        var color = d3.scaleOrdinal()
            .domain(data.map(function(d) { return d.Ticker; }))
            .range(d3.schemeDark2);

        // This section will compute the position of each group on the pie
        var pie = d3.pie()
            .sort(null) // Do not sort group by size
            .value(function(d) {return d.Price; })
        var data_ready = pie(data)

        // arc generator
        var arc = d3.arc()
            .innerRadius(radius * 0.5)         // This is the size of the donut hole
            .outerRadius(radius * 0.8)


        var outerArc = d3.arc()
            .innerRadius(radius * 0.9)
            .outerRadius(radius * 0.9)

        // Build the pie chart
        svg
            .selectAll('allSlices')
            .data(data_ready)
            .enter()
            .append('path')
            .attr('d', arc)
            .attr('fill', function(d){ return(colors[d.data.Ticker]) })
            .attr("stroke", "white")
            .style("stroke-width", "2px")
            .style("opacity", 0.7)

        // Add the polylines between chart and labels:
        svg
            .selectAll('allPolylines')
            .data(data_ready)
            .enter()
            .append('polyline')
            .attr("stroke", "black")
            .style("fill", "none")
            .attr("stroke-width", 1)
            .attr('points', function(d) {
                var posA = arc.centroid(d) // line insertion in the slice
                var posB = outerArc.centroid(d) // line break: we use the other arc generator that has been built only for that
                var posC = outerArc.centroid(d); // Label position = almost the same as posB
                var midangle = d.startAngle + (d.endAngle - d.startAngle) / 2 // we need the angle to see if the X position will be at the extreme right or extreme left
                posC[0] = radius * 0.95 * (midangle < Math.PI ? 1 : -1); // multiply by 1 or -1 to put it on the right or on the left
                return [posA, posB, posC]
            })


        svg
            .selectAll('allLabels')
            .data(data_ready)
            .enter()
            .append('text')
            .text( function(d) { return d.data.Ticker } )
            .attr('transform', function(d) {
                var pos = outerArc.centroid(d);
                var midangle = d.startAngle + (d.endAngle - d.startAngle) / 2
                pos[0] = radius * 0.99 * (midangle < Math.PI ? 1 : -1);
                return 'translate(' + pos + ')';
            })
            .style('text-anchor', function(d) {
                var midangle = d.startAngle + (d.endAngle - d.startAngle) / 2
                return (midangle < Math.PI ? 'start' : 'end')
            })
        });
}