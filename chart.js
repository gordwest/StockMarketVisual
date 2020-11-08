window.onload = function(){
    setup("DataTest2.csv");
};

const MARGIN = {
    "LEFT":100,
    "RIGHT":100,
    "TOP":100,
    "BOTTOM":200,
};

//dimension of our workspace
const width  = 1920, height = 1080;
var _barChart; //define a global reference for barchart

setup = function (dataPath) {
    var SVG = d3.select("#SVG_CONTAINER");
    d3.csv(dataPath).then(function (d) {
        d.sort(function(x, y){
            return d3.descending(parseFloat(x.Price), parseFloat(y.Price));
        });
        _barChart = new barChart(d, SVG);
        _barChart.draw();

    });
};

var dateIdx = 0
dateRange = ["9/21/2015","9/21/2016","9/21/2017","9/21/2018","9/20/2019","9/18/2020"]

barChart = function (data, svg) {
    filteredData = [];
    kIndex = 0;
    for (i = 0; i < data.length; i++){
        if(data[i].Date === dateRange[dateIdx])
            filteredData[kIndex++] = data[i];
    }

    // creating scales for barchart
    xScale = d3.scaleBand()
        .domain(d3.range(filteredData.length)) 
        .range([MARGIN.LEFT, width - MARGIN.RIGHT])
        .padding(0.1) 

    yScale = d3.scaleLinear()
        .domain([0, 100])    
        .range([height-MARGIN.BOTTOM, MARGIN.TOP]); 

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
            .attr("x", (d,i) => xScale(i) )
            .attr("y", d => yScale(d.Price)) 
            .attr("width", xScale.bandwidth)
            .attr("height", d => yScale(0) - yScale(d.Price))
            .attr("fill", "steelblue")

        // add prices above bars
        prices = chart
            .selectAll("text")
            .data(filteredData)
            
        prices
            .enter()
            .append("text")
            .attr("x", (d,i) => xScale(i) + 45)
            .attr("y", d => yScale(d.Price) - 20)
            .text(d => "$" + d.Price)
            .attr("font-family", "sans-serif")
            .attr("font-size", "20px")
            .attr("fill", "black");
            
        //create the render specifications for y axis
        var yAxis = d3.axisLeft()
            .scale(yScale);

        //draw the y axis on our chart
        chart.append("g")
            .style("font", "20px times")
            .attr("transform", "translate("+ MARGIN.LEFT + ","+ 0 +")")
            .call(yAxis);

        //create the render specifications for x axis
        var xAxis = d3.axisBottom()
            .tickFormat((d,i) => filteredData[i].Ticker)
            .scale(xScale);

        //draw the x axis on our chart
        chart.append("g")
            .style("font", "20px times")
            .attr("transform", "translate("+ 0 + ","+ (height-MARGIN.BOTTOM) +")")
            .attr("class", "xAxis")
            .call(xAxis);
    };

    // update chart with new data
    this.updateChart = function(){
        // update label
        document.getElementById("currentDate").innerHTML = dateRange[dateIdx];

        nextDateData = [];
        kIndex = 0;
        for (i = 0; i < data.length; i++){
            if(data[i].Date === dateRange[dateIdx])
            nextDateData[kIndex++] = data[i];
        }

        xScale
            .domain(d3.range(nextDateData.length));
        
            var newAxis = d3.axisBottom()
                .tickFormat((d,i) => nextDateData[i].Ticker)
                .scale(xScale)

            svg.select(".xAxis")
                .transition()
                .duration(500)
                .call(newAxis);

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
            .attr("height", d => yScale(0) - yScale(d.Price))
            .attr("width", xScale.bandwidth)
            .attr("y", d => yScale(d.Price))
            .attr("x", (d,i) => xScale(i))
            .attr("fill", "steelblue");

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
            .attr("x", (d,i) => xScale(i) + 45)
            .attr("y", d => yScale(d.Price) - 20)
            .text(d => "$" + d.Price)
            .attr("font-family", "sans-serif")
            .attr("font-size", "20px")
            .attr("fill", "black");

        xScale = d3.scaleBand()
            .domain(d3.range(nextDateData.length)) 
            .range([MARGIN.LEFT, width - MARGIN.RIGHT])
            .padding(0.1) 
    
        //the frequency of occurrence
        yScale = d3.scaleLinear()
            .domain([0, 100])    
            .range([height-MARGIN.BOTTOM, MARGIN.TOP]);

        //create the render specifications for y axis
        var yAxis = d3.axisLeft()
            .scale(yScale);

        //draw the y axis on our chart
        chart.append("g")
            .style("font", "20px times")
            .attr("transform", "translate("+ MARGIN.LEFT + ","+ 0 +")")
            .call(yAxis);

        //create the render specifications for x axis
        var xAxis = d3.axisBottom()
            .tickFormat((d,i) => nextDateData[i].Ticker)
            .scale(xScale);

        //draw the y axis on our chart
        chart.append("g")
            .style("font", "20px times")
            .attr("transform", "translate("+ 0 + ","+ (height-MARGIN.BOTTOM) +")")
            .attr("class", "xAxis")
            .call(xAxis);

        // update data after 1 sec
        setTimeout(function() {
            incrementDate();
        }, 1000);
        
    };

};

function incrementDate() {
    //your code to be executed after 1 second
    if (dateIdx < 5)
        dateIdx += 1;
    else
        dateIdx = 0;
 
    _barChart.updateChart();

};

// Start animation
function start(){
    incrementDate();
};