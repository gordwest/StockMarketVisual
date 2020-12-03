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
            //for (i =0;i<data.length; i++)
            d.forEach(function(d){
                //console.log(d);
                // console.log(d.Date)
                //if(d.Date == parseDate("12/31/2015") || d.Date == parseDate("12/29/2016") || d.Date === parseDate("12/29/2017")|| d.Date === parseDate("12/21/2018") || d.Date === parseDate("12/31/2019") || d.Date === parseDate("9/18/2020")) {
                if(d.Date === "12/31/2015" || d.Date === "12/29/2016" || d.Date === "12/29/2017"|| d.Date === "12/21/2018" || d.Date === "12/31/2019" || d.Date === "9/18/2020"){

                    keepData.push(d)
                    // d = d;
                }
            })

        d.forEach(function(d) {
            d.Date = parseDate(d.Date);
            d.Price = parseFloat(d.Price);
        });

            console.log(keepData);
            


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
            .select(".domain").remove()

        // Build Y scales and axis:
        var y_heatMap = d3.scaleBand()
            .range([HEIGHT - MARGIN.BOTTOM - MARGIN.TOP, 0 ])
            .domain(myVars)
            .padding(0.05);
        heatMap.append("g")
            .style("font-size", 14)
            .call(d3.axisLeft(y_heatMap).tickSize(0))
            .select(".domain").remove()

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

        // Three function that change the tooltip when user hovers
        var mouseover = function(d) {
            tooltip_heatMap
                .style("opacity", 1)
            d3.select(this)
                .style("stroke", "black")
                .style("opacity", 1)
        }
        var mousemove = function(d) {
            tooltip_heatMap
                .html("The price of " + d.Ticker + " on "  + d.Date + " was " + d.Price)
                .style("left", (d3.mouse(this)[0]+70) + "px")
                .style("top", (d3.mouse(this)[1]) + "px")
        }
        var mouseleave = function(d) {
            tooltip_heatMap
                .style("opacity", 0)
            d3.select(this)
                .style("stroke", "none")
                .style("opacity", 0.8)
        }

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
                tooltip_heatMap
                    .html("The price of " + d.Ticker + " on "  + d.Date + " was " + d.Price)
                    .style("opacity", 1)
                    .style("left", (event.screenX+70) + "px")
                    .style("top", (event.screenY) + "px")
                d3.select(this)
                    .style("stroke", "black")
                    .style("opacity", 1)
            })
            .on("mouseleave", function(event,d){
                tooltip_heatMap
                    .style("opacity", 0)
                d3.select(this)
                    .style("stroke", "none")
                    .style("opacity", 0.8)
            })
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

        const tooltip = d3.select('#TOOL_TIP');
        const tooltipLine = line.append('line')
                                .attr("class", "tooltip")
                                .attr('stroke', 'black')
                .attr('x1', 300)
                .attr('x2', 300)
                .attr('y1', 0)
                .attr('y2', HEIGHT);

        // tipBox = line.append('rect')
        //     .attr('width', WIDTH)//-MARGIN.RIGHT)
        //     .attr('height', HEIGHT)//-MARGIN.TOP-MARGIN.BOTTOM)
        //     .attr('opacity', 0)
        //     //.attr("transform", "translate(0," + 200 + ")")
        //     .on('mousemove', function(d) {
        //         console.log("mouse in ")
        //     })
        //     // drawTooltip)
        //     .on('mouseout', removeTooltip);

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
        line
            .selectAll('.line')
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

        // add the brushing
        tipBox = line.append("g")
            .attr("class", "brush")
            .on('mousemove', function() {
                console.log("mouse move")
                drawTooltip
            })
            .on('mouseout',function() {
                console.log("mouse out") 
                removeTooltip
            })
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
            .text(function(d){ return sectors[d]})
            .attr("text-anchor", "left")
            .style("alignment-baseline", "middle")
            .style("font-size", "20")

        function removeTooltip() {
            if (tooltip) tooltip.style('display', 'none');
            if (tooltipLine) tooltipLine.attr('stroke', 'none');
            }
            
        function drawTooltip() { 
                  
            tooltipLine
                .attr('stroke', 'black')
                .attr('x1', 300)
                .attr('x2', 300)
                .attr('y1', 0)
                .attr('y2', HEIGHT);
            
            tooltip.html()
                .style('display', 'block')
                .style('left', d3.event.pageX + 20)
                .style('top', d3.event.pageY - 20)
                .selectAll()
                .data(states).enter()
                .append('div')
                .style('color', d => d.color)
                .html(d => d.name + ': ' + d.history.find(h => h.year == year).population);
        }

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
            // console.log(y.invert(extent[0]), y.invert(extent[1]))
            // console.log(y.invert(extent[0]), y.invert(extent[1]))
            
            // if no selection, back to initial coordinate. Otherwise, update X axis domain
            if(!extent){
                if (!idleTimeout) return idleTimeout = setTimeout(idled, 350);
                x.domain([ 4,8])
            }else{
                x.domain([x.invert(extent[0]), x.invert(extent[1])])
                // y.domain([0, y.invert(extent[1])])
                line.select(".brush").call(brush.move, null) // This remove the grey brush area when selection is made
            }

            // update x axis 
            xAxis
                .transition()
                .duration(700)
                .call(d3.axisBottom(x));
            
            // // update x axis 
            // yAxis
            //     .transition()
            //     .duration(700)
            //     .call(d3.axisLeft(y));

            // update line position
            line
                .selectAll('.line')
                .transition()
                .duration(700)
                .attr('d', function(d) { 
                    return drawLine(d[1])
                })
        }

        // function to clear line chart - activated by button
        function removeAllLines() {
            console.log("remove all");
        }

        // function to make all lines visible - activated by button
        function addAllLines() {
            console.log("add back");
        }
        
        // reinitialize chart on double click
        svg.on("dblclick",function(){
            x.domain([minDate, maxDate])
            // y.domain([0, maxPrice])
            xAxis
                .transition()
                .call(d3.axisBottom(x));
            xAxis.selectAll(".tick text")
                .attr("font-size","16")
                .attr("fill","black");
            // yAxis
            //     .transition()
            //     .call(d3.axisLeft(y));
            // yAxis.selectAll(".tick text")
            //     .attr("font-size","16")
            //     .attr("fill","black");
            line
                .selectAll('.line')
                .transition()
                .attr('d', function(d) { 
                    return drawLine(d[1])
                })
        });
    })
}