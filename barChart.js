function createBarChart() {
    var SVG_BAR = d3.select("#BAR_CHART");
    d3.csv("FormattedData.csv").then(function (d) {
        d.sort(function(x, y){
            return d3.ascending(parseFloat(x.Price), parseFloat(y.Price));
        });
        _barChart = new barChart(d, SVG_BAR);
        _barChart.draw();
    });
};

barChart = function (data, svg) {

    // get data for specific date
    filteredData = filterData(data, dateRange[dateIdx]);

    // creating scales for barchart
    xScale = d3.scaleLinear()
        .domain([0, 100])
        .range([MARGIN.LEFT, width - MARGIN.RIGHT])

    yScale = d3.scaleBand()
        .domain(d3.range(filteredData.length)) 
        .range([height-MARGIN.BOTTOM, MARGIN.TOP])
        .padding(0.1);

    //draws the initial barchart
    this.draw = function(){
        // update date label
        document.getElementById("currentDate").innerHTML = dateRange[dateIdx];

        chart = svg.append('g')
            .attr("class", "barChart");

        bars = chart
            .selectAll('rect')
            .data(filteredData)

        bars
            .enter()
            .append('rect') 
            .attr("class", d => d.Ticker) 
            .attr("x",  d => xScale(0))
            .attr("y", (d,i) => yScale(i)) 
            .attr("width", d => xScale(d.Price) - xScale(0)) 
            .attr("height", yScale.bandwidth)
            .attr("fill", d => colors[d.Ticker]);

        // add prices above bars
        prices = chart
            .selectAll("text")
            .data(filteredData)
            
        prices
            .enter()
            .append("text")
            .attr("x",  d => xScale(d.Price) + 10)
            .attr("y", (d,i) => yScale(i) + 40) 
            .text(d => "$" + d.Price)
            .attr("font-family", "sans-serif")
            .attr("font-size", "20px")
            .attr("fill", "black");
            
        //create the render specifications for y axis
        var yAxis = d3.axisLeft()
            .tickFormat((d,i) => filteredData[i].Ticker)
            .scale(yScale);

        //draw the y axis on our chart
        chart.append("g")
            .style("font", "20px times")
            .attr("transform", "translate("+ MARGIN.LEFT + ","+ 0 +")")
            .call(yAxis);

        //create the render specifications for x axis
        var xAxis = d3.axisTop()
            .scale(xScale);

        //draw the x axis on our chart
        chart.append("g")
            .style("font", "20px times")
            .attr("transform", "translate("+ 0 + ","+ (MARGIN.TOP) +")")
            .attr("class", "xAxis")
            .call(xAxis);
    };

    // update chart with new data
    this.updateChart = function(){
        // update label
        document.getElementById("currentDate").innerHTML = dateRange[dateIdx];

        // get data for a specific date
        nextDateData = filterData(data, dateRange[dateIdx]);

        bars = svg
            .select(".barChart")
            .selectAll('rect')
            .data(nextDateData)

        bars
            .exit()
            .remove()

        bars
            .transition()
            .duration(500)
            .attr("x",  d => xScale(0))
            .attr("y", (d,i) => yScale(i)) 
            .attr("width", d => xScale(d.Price) - xScale(0)) 
            .attr("height", yScale.bandwidth)
            .attr("fill", d => colors[d.Ticker]);

        prices = svg
            .select(".barChart")
            .selectAll('text')
            .data(nextDateData)

        prices
            .exit()
            .remove()

        prices
            .transition()
            .duration(500)
            .attr("x",  d => xScale(d.Price) + 10)
            .attr("y", (d,i) => yScale(i) + 40) 
            .text(d => "$" + d.Price)
            .attr("font-family", "sans-serif")
            .attr("font-size", "20px")
            .attr("fill", "black");

        // creating scales for barchart
        xScale = d3.scaleLinear()
            .domain([0, 100])
            .range([MARGIN.LEFT, width - MARGIN.RIGHT])

        yScale = d3.scaleBand()
            .domain(d3.range(nextDateData.length)) 
            .range([height-MARGIN.BOTTOM, MARGIN.TOP])
            .padding(0.1);

        //create the render specifications for y axis
        var yAxis = d3.axisLeft()
            .tickFormat((d,i) => nextDateData[i].Ticker)
            .scale(yScale);
            
        //draw the y axis on our chart
        chart.append("g")
            .style("font", "20px times")
            .attr("transform", "translate("+ MARGIN.LEFT + ","+ 0 +")")
            .call(yAxis);

        //create the render specifications for x axis
        var xAxis = d3.axisTop()
            .scale(xScale);

        //draw the y axis on our chart
        chart.append("g")
            .style("font", "20px times")
            .attr("transform", "translate("+ 0 + ","+ (MARGIN.TOP) +")")
            .attr("class", "xAxis")
            .call(xAxis);

        // update data after delay
        setTimeout(function() {
            incrementDate();
        }, 200);
    };
};

// increment date and then update chart
function incrementDate() {
    if (dateIdx < 1255){
        _barChart.updateChart();
        dateIdx += 1;
    } 
    else {
        console.log("Animation is finished!")
        dateIdx = 0;
    }
};

// Start animation
function start(){
    incrementDate();
};