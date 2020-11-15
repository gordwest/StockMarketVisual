//Reference: https://www.d3-graph-gallery.com/index.html

var innerRadius = 90,
    outerRadius = Math.min(WIDTH, HEIGHT) / 2;   // the outerRadius goes from the middle of the SVG area to the border


function createDoubleChart(){

    // append the svg object
    var svg = d3.select("#DOUBLE_CHART")
        .append("svg")
        .attr("WIDTH", WIDTH + MARGIN.LEFT + MARGIN.RIGHT)
        .attr("HEIGHT", HEIGHT + MARGIN.TOP + MARGIN.BOTTOM)
        .append("g")
        .attr("transform", "translate(" + (WIDTH / 2 + MARGIN.LEFT) + "," + (HEIGHT / 2 + MARGIN.TOP) + ")");

    d3.csv("data/Data.csv").then(function(data) {

        // X scale: common for 2 data series
        var x = d3.scaleBand()
            .range([0, 2 * Math.PI])    // X axis goes from 0 to 2pi = all around the circle. If I sTOP at 1Pi, it will be around a half circle
            .align(0)                  // This does nothing
            .domain(data.map(function(d) { return d.Ticker; })); // The domain of the X axis is the list of states.

        // Y scale outer variable
        var y = d3.scaleRadial()
            .range([innerRadius, outerRadius])   // Domain will be define later.
            .domain([0, 80]); // Domain of Y is from 0 to the max seen in the data

        // scales for second set of bars
        var ybis = d3.scaleRadial()
            .range([innerRadius, 5])   // Domain will be defined later.
            .domain([0, 80]);

        // Add bars
        svg.append("g")
            .selectAll("path")
            .data(data)
            .enter()
            .append("path")
            .attr("fill", "#69b3a2")
            .attr("class", "yo")
            .attr("d", d3.arc()     // imagine your doing a part of a donut plot
                .innerRadius(innerRadius)
                .outerRadius(function(d) { return y(d['Price']); })
                .startAngle(function(d) { return x(d.Ticker); })
                .endAngle(function(d) { return x(d.Ticker) + x.bandwidth(); })
                .padAngle(0.01)
                .padRadius(innerRadius))

        // Add labels
        svg.append("g")
            .selectAll("g")
            .data(data)
            .enter()
            .append("g")
            .attr("text-anchor", function(d) { return (x(d.Ticker) + x.bandwidth() / 2 + Math.PI) % (2 * Math.PI) < Math.PI ? "end" : "start"; })
            .attr("transform", function(d) { return "rotate(" + ((x(d.Ticker) + x.bandwidth() / 2) * 180 / Math.PI - 90) + ")"+"translate(" + (y(d['Price'])+10) + ",0)"; })
            .append("text")
            .text(function(d){return(d.Ticker)})
            .attr("transform", function(d) { return (x(d.Ticker) + x.bandwidth() / 2 + Math.PI) % (2 * Math.PI) < Math.PI ? "rotate(180)" : "rotate(0)"; })
            .style("font-size", "16px")
            .attr("alignment-baseline", "middle")

        // Add second series
        svg.append("g")
            .selectAll("path")
            .data(data)
            .enter()
            .append("path")
            .attr("fill", "red")
            .attr("d", d3.arc()     // imagine your doing a part of a donut plot
                .innerRadius( function(d) { return ybis(0) })
                .outerRadius( function(d) { return ybis(d['Price']); })
                .startAngle(function(d) { return x(d.Ticker); })
                .endAngle(function(d) { return x(d.Ticker) + x.bandwidth(); })
                .padAngle(0.01)
                .padRadius(innerRadius))

    });

}


