//Reference: https://www.d3-graph-gallery.com/index.html

function createHeatMap(){

// append the svg object to the body of the page
    var svg = d3.select("#HEAT_MAP1")
        .append("svg")
        .attr("width", WIDTH + MARGIN.LEFT + MARGIN.RIGHT)
        .attr("height", HEIGHT)
        .append("g")
        .attr("transform",
            "translate(" + MARGIN.LEFT + "," + MARGIN.TOP + ")");

//Read the data
    d3.csv("data/Data2.csv").then(function(data) {

        // Labels of row and columns using the unique names: 'date' and 'ticker'
        var myGroups = groupHeader(data, "date")
        var myVars = groupHeader(data, "ticker")

        // Build X scales and axis:
        var x = d3.scaleBand()
            .range([0, WIDTH - MARGIN.RIGHT])
            .domain(myGroups)
            .padding(0.05);
        svg.append("g")
            .style("font-size", 14)
            .attr("transform", "translate(0," + (HEIGHT - 200) + ")")
            .call(d3.axisBottom(x).tickSize(0))
            .select(".domain").remove()

        // Build Y scales and axis:
        var y = d3.scaleBand()
            .range([HEIGHT - MARGIN.BOTTOM - MARGIN.TOP, 0 ])
            .domain(myVars)
            .padding(0.05);
        svg.append("g")
            .style("font-size", 14)
            .call(d3.axisLeft(y).tickSize(0))
            .select(".domain").remove()

        // Build color scale
        var myColor = d3.scaleSequential()
            .interpolator(d3.interpolateInferno)
            .domain([1,100])

        // create a tooltip
        var tooltip = d3.select("#HEAT_TOOLTIP")
            .append("div")
            .style("opacity", 0)
            .attr("class", "tooltip")
            .style("background-color", "white")
            .style("border", "solid")
            .style("border-width", "2px")
            .style("border-radius", "5px")
            .style("padding", "5px")

        // Three function that change the tooltip when user hovers
        var mouseover = function(d) {
            tooltip
                .style("opacity", 1)
            d3.select(this)
                .style("stroke", "black")
                .style("opacity", 1)
        }
        var mousemove = function(d) {
            tooltip
                .html("The price of " + d.ticker + " on "  + d.date + " was " + d.value)
                .style("left", (d3.mouse(this)[0]+70) + "px")
                .style("top", (d3.mouse(this)[1]) + "px")
        }
        var mouseleave = function(d) {
            tooltip
                .style("opacity", 0)
            d3.select(this)
                .style("stroke", "none")
                .style("opacity", 0.8)
        }

        // add the squares for the map
        svg.selectAll()
            .data(data, function(d) {return d.date+':'+d.ticker;})
            .enter()
            .append("rect")
            .attr("x", function(d) { return x(d.date) })
            .attr("y", function(d) { return y(d.ticker) })
            .attr("rx", 4)
            .attr("ry", 4)
            .attr("width", x.bandwidth() )
            .attr("height", y.bandwidth() )
            .style("fill", function(d) { return myColor(d.value)} )
            .style("stroke-width", 4)
            .style("stroke", "none")
            .style("opacity", 0.8)
            .on("mouseover", function(event,d){
                tooltip
                    .html("The price of " + d.ticker + " on "  + d.date + " was " + d.value)
                    .style("opacity", 1)
                    .style("left", (event.screenX+70) + "px")
                    .style("top", (event.screenY) + "px")
                d3.select(this)
                    .style("stroke", "black")
                    .style("opacity", 1)
            })
            .on("mouseleave", function(event,d){
                tooltip
                    .style("opacity", 0)
                d3.select(this)
                    .style("stroke", "none")
                    .style("opacity", 0.8)
            })
    })

// Add title
    svg.append("text")
        .attr("x", 0)
        .attr("y", -50)
        .attr("text-anchor", "left")
        .style("font-size", "22px")
        .text("An ETF Heatmap");

// Add subtitle
    svg.append("text")
        .attr("x", 0)
        .attr("y", -20)
        .attr("text-anchor", "left")
        .style("font-size", "14px")
        .style("fill", "grey")
        .style("max-width", 400)
        .text("This heatmap shows the value on the last trading day for each year of our data ");


}
