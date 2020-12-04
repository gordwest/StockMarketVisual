function makeLineChart() {
    // append the svg object to the body of the page
    var svg = d3.select("#LINE_CHART")
        .append("svg")
        .attr("width", WIDTH + MARGIN.LEFT + MARGIN.RIGHT)
        .attr("height", HEIGHT + MARGIN.TOP + MARGIN.BOTTOM)
        .append("g")
        .attr("transform", "translate(150,-100)");

    var heatMap = d3.select("#HEAT_MAP")
        .append("svg")
        .attr("width", WIDTH + MARGIN.LEFT + MARGIN.RIGHT)
        .attr("height", HEIGHT)
        .append("g")
        .attr("transform",
            "translate(" + MARGIN.LEFT + "," + MARGIN.TOP + ")");

    //Read the data
    d3.csv("data/FormattedData.csv")
        .then(function(d) { 
            keepData = [];
            d.forEach(function(d){
                //if(d.Date == parseDate("12/31/2015") || d.Date == parseDate("12/29/2016") || d.Date === parseDate("12/29/2017")|| d.Date === parseDate("12/21/2018") || d.Date === parseDate("12/31/2019") || d.Date === parseDate("9/18/2020")) {
                if(d.Date === "12/31/2015" || d.Date === "12/29/2016" || d.Date === "12/29/2017"|| d.Date === "12/21/2018" || d.Date === "12/31/2019" || d.Date === "9/18/2020"){
                    keepData.push(d)
                }
            })

        d.forEach(function(d) {
            d.Date = parseDate(d.Date);
            d.Price = parseFloat(d.Price);
        });

        // line chart vars
        var minDate = d3.min(d, function(d) {return d.Date;});
        var maxDate = d3.max(d, function(d) {return d.Date;});
        var maxPrice = d3.max(d, function(d) {return d.Price;});

        // Labels of row and columns using the unique names: 'date' and 'ticker'
        var myGroups = groupHeader(keepData, "Date")
        var myVars = groupHeader(keepData, "Ticker")
        console.log(myVars)

        // Add X axis
        var x = d3.scaleTime()
            .domain([minDate, maxDate])
            .range([0, WIDTH - MARGIN.RIGHT])
        xAxis = svg.append("g")
            .attr("transform", "translate(0," + (HEIGHT) + ")")
            .call(d3.axisBottom(x));

        // format X axis
        xAxis.selectAll(".tick text")
            .attr("font-size","16")
            .attr("fill","black")

        // add Y axis
        var y = d3.scaleLinear()
            .domain([0, maxPrice])
            .range([HEIGHT-MARGIN.BOTTOM, MARGIN.TOP])
        yAxis = svg.append("g")
            .attr("transform", "translate(0," + (MARGIN.BOTTOM) + ")")
            .call(d3.axisLeft(y));
        // format Y axis
        yAxis.selectAll(".tick text")
            .text(d => "$" + d)
            .attr("font-size","16")
            .attr("fill","black")

        // Build X scales and axis for heatMap ########################################################
        var x_heatMap = d3.scaleBand()
            .range([0, WIDTH - MARGIN.RIGHT])
            .domain(myGroups)
            .padding(0.05);
        heatMap.append("g")
            .style("font-size", 14)
            .style("opacity", "0")
            .attr("transform", "translate(0," + (HEIGHT - 200) + ")")
            .call(d3.axisBottom(x_heatMap).tickSize(0))
            .select(".domain").remove();

        // Build Y scales and axis:
        var y_heatMap = d3.scaleBand()
            .range([HEIGHT - MARGIN.BOTTOM - MARGIN.TOP, 0 ])
            .domain(myVars)
            .padding(0.05);

        vert = heatMap.append("g")
            .style("font-size", 16)
            .attr("class", "heatTick")
            .call(d3.axisLeft(y_heatMap).tickSize(0))
            .select(".domain").remove()

        vert.selectAll(".heatTick")
            .text("yeet")
            .attr("font-size","20")
            .attr("fill","black")

        // Build color scale
        var myColor = d3.scaleSequential()
            .interpolator(d3.interpolateGreens)
            .domain([1,100])

        // create a tooltip
        var tooltip_heatMap = d3.select("#HEAT_TOOLTIP")
            .append("div")
            .style("opacity", 0)
            .attr("class", "tooltip_heat")
            .style("background-color", "white")
            .style("border", "solid")
            .style("border-width", "2px")
            .style("border-radius", "5px")
            .style("padding", "5px")

        // add the squares for the map
        heatMap.selectAll()
            .data(keepData, function(d) {return d.Date+':'+d.Ticker;})
            .enter()
            .append("rect")
            .attr("x", function(d) { return x_heatMap(d.Date) })
            .attr("y", function(d) { return y_heatMap(d.Ticker) })
            .attr("rx", 4)
            .attr("ry", 4)
            .attr("width", x_heatMap.bandwidth() )
            .attr("height", y_heatMap.bandwidth() )
            .style("fill", function(d) { return myColor(d.Price)} )
            .style("stroke-width", 4)
            .style("stroke", "none")
            .style("opacity", 0.8)
            .on("mouseover", function(event,d){
                mouseOver(d)
                tooltip_heatMap
                    .html("The price of " + d.Ticker + " on "  + d.Date.toString().slice(4,15) + " was $" + d.Price)
                    .style("opacity", 1)
                    .style("left", (event.screenX+70) + "px")
                    .style("top", (event.screenY) + "px")
                d3.select(this)
                    .style("stroke", "black")
                    .style("opacity", 1)
            })
            .on("mouseleave", function(event,d){
                mouseLeave(d)
                tooltip_heatMap
                    .style("opacity", 0)
                d3.select(this)
                    .style("stroke", "none")
                    .style("opacity", 0.8)
            })

            function mouseOver(data) {
                line.selectAll(".circle")
                .select(function(d){
                    return d.Ticker === data.Ticker && d.Date == data.Date ? this :null; 
                })
                .style("r", "15")
                .style("fill", "none")
                .style("stroke", "red")
                .style("stroke-width", "4");
            }
            function mouseLeave(data) {
                line.selectAll(".circle")
                .select(function(d){
                    return d.Ticker === data.Ticker && d.Date == data.Date ? this :null; 
                })
                .style("stroke", "none");
            }
// #################################################################################################################

        // add a clipPath
        var clip = svg.append("defs").append("svg:clipPath")
            .attr("id", "clip")
            .append("svg:rect")
            .attr("width", WIDTH-MARGIN.RIGHT )
            .attr("height", HEIGHT )
            .attr("x", 0)
            .attr("y", 0);

        // add brushing
        var brush = d3.brushX()                  
            .extent( [ [0,200], [WIDTH, HEIGHT]])  
            .on("end", updateChart)             

        var line = svg.append('g')
            // .attr("transform", "translate(0," + (MARGIN.BOTTOM) + ")")
            .attr("clip-path", "url(#clip)")
        
        // function to draw a line on the chart
        var drawLine = d3.line()
            .x(function(d) { return x(d.Date);})
            .y(function(d) { return y(d.Price);});

        var groupData = d3.group(d, d => d.Ticker) // group data by ETF
        var tickers = groupHeader(d, "Ticker") // get unique ETF tickers
        var color = d3.scaleOrdinal() // color scale
            .domain(tickers)
            .range(['#e41a1c','#377eb8','#4daf4a','#984ea3','#ff7f00','#00008B','#a65628','#f781bf','#999999','#000000'])
            // .range(["#58b5e1", "#cf4179", "#38e278", "#8b6fed", "#9f5827", "#154e56", "#f4cf92", "#ec102f", "#b1d34f", "#12982d"])

        // draw lines on the chart
        line.selectAll('.line')
            .data(groupData)
            .enter()
            .append("path")
            .attr("class", d => "line " + d[0]) 
            // .attr("class", "line") 
            .attr('d', function(d) { 
                return drawLine(d[1])
            })
            .attr("fill", "none")
            .attr("stroke", d => color(d[0]))
            .attr("stroke-width", 2)
            .attr("transform", "translate(0," + (MARGIN.BOTTOM) + ")")

        line.selectAll("myCircles")
            .data(d)
            .enter()
            .append("circle")
            .attr("class", "circle")
            .attr("fill", "none")
            // .attr("stroke", "none")
            .attr("cx", function(d) { return x(d.Date) })
            .attr("cy", function(d) { return y(d.Price)+100 })
            .attr("r", 1)

        var tooltipLine = line.append('line')
            .attr("class", "tooltip")
            .attr('stroke', 'black')
            .attr('stroke-width', '2')
            .attr('x1', 300)
            .attr('x2', 300)
            .attr('y1', 0)
            .attr('y2', HEIGHT);

        // add the brushing
        line.append("g")
            .attr("class", "brush")
            .call(brush);

        // add a dot for each ETF
        line.selectAll("mydots")
            .data(tickers)
            .enter()
            .append("circle")
            .attr("cx", function(d,i){ return 50 + i*160})
            .attr("cy", 150)
            .attr("r", 15)
            .style("fill", function(d){ return color(d)})
            .style("stroke", function(d){ return color(d)})
            .on("click", function(d, name) {
                if (d3.select(this).classed('clicked')) {
                    d3.select(this).classed('clicked', false);
                    d3.select(this).style('fill-opacity', 1);
                    toggleLine(name, false)
                } 
                else {
                    d3.select(this).classed('clicked', true);
                    d3.select(this).style('fill-opacity', 0);
                    toggleLine(name, true)
                }
            });

        // add the ETF category name for each dot
        line.selectAll("mylabels")
            .data(tickers)
            .enter()
            .append("text")
            .attr("x", function(d,i){ return 70 + i*160})
            .attr("y", 152)
            .style("fill", function(d){ return color(d)})
            .text(function(d){ return d})
            .attr("text-anchor", "left")
            .style("alignment-baseline", "middle")
            .style("font-size", "20")

        // remove/add line to chart     
        function toggleLine(name, state) {
            if (state) {
                line.selectAll("."+name)
                    .style("opacity", "0")
            }
            else {
                line.selectAll("."+name)
                    .style("opacity", "1")
            }
        }

        // set idleTimeOut to null
        var idleTimeout
        function idled() { idleTimeout = null; }

        // update the chart for given boundaries
        function updateChart(event) {
            extent = event.selection
            
            // if no selection, back to initial coordinate. Otherwise, update X axis domain
            if(!extent){
                if (!idleTimeout) return idleTimeout = setTimeout(idled, 350);
                x.domain([ 4,8])
            }else{
                x.domain([x.invert(extent[0]), x.invert(extent[1])])
                line.select(".brush").call(brush.move, null) // This remove the grey brush area when selection is made
            }

            // update x axis 
            xAxis
                .transition()
                .duration(700)
                .call(d3.axisBottom(x));
    
            // update line position
            line
                .selectAll('.line')
                .transition()
                .duration(700)
                .attr('d', function(d) { 
                    return drawLine(d[1])
                })

            line.selectAll(".circle")
                .transition()
                .duration(700)
                .attr("cx", function(d) { return x(d.Date) })
                .attr("cy", function(d) { return y(d.Price)+100 })
        }

        // reinitialize chart on double click
        svg.on("dblclick",function(){
            x.domain([minDate, maxDate])
            xAxis
                .transition()
                .call(d3.axisBottom(x));
            xAxis.selectAll(".tick text")
                .attr("font-size","16")
                .attr("fill","black");
            line
                .selectAll('.line')
                .transition()
                .attr('d', function(d) { 
                    return drawLine(d[1])
                })
            line.selectAll(".circle")
                .transition()
                .attr("cx", function(d) { return x(d.Date) })
                .attr("cy", function(d) { return y(d.Price)+100 })
            
        });
    })
}