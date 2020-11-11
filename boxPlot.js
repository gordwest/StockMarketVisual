d3.csv("FormattedData.csv")
  .then(function(d) { 
    d.forEach(function(d) {
      d.Date = parseDate(d.Date);
      d.Price = parseFloat(d.Price);
    });

    d.sort(function(a, b) {
        return +a.Price - +b.Price
    });

    let prices = d3.map(d, function(d){return(d.Price)});
    console.log(prices)

    var q1 = d3.quantile(prices, .25)
    var median = d3.quantile(prices, .5)
    var q3 = d3.quantile(prices, .75)
    var interQuantileRange = q3 - q1
    var min = q1 - 1.5 * interQuantileRange
    var max = q1 + 1.5 * interQuantileRange

    console.log(q1, median, q3, interQuantileRange, min, max)

    var svg = d3.select("#LINE_CHART")
    var chart = svg.append("g")
      .attr("transform", 'translate(50,50)');

    // Show the Y scale
    var y = d3.scaleLinear()
        .domain([0,24])
        .range([height, 0]);

    chart
        .call(d3.axisLeft(y))

    // a few features for the box
    var center = 200
    var width = 100

    // Show the main vertical line
    chart
        .append("line")
        .attr("x1", center)
        .attr("x2", center)
        .attr("y1", y(min) )
        .attr("y2", y(max) )
        .attr("stroke", "black")

    // Show the box
    chart
        .append("rect")
        .attr("x", center - width/2)
        .attr("y", y(q3) )
        .attr("height", (y(q1)-y(q3)) )
        .attr("width", width )
        .attr("stroke", "black")
        .style("fill", "#69b3a2")

    // show median, min and max horizontal lines
    chart
        .selectAll("toto")
        .data([min, median, max])
        .enter()
        .append("line")
        .attr("x1", center-width/2)
        .attr("x2", center+width/2)
        .attr("y1", function(d){ return(y(d))} )
        .attr("y2", function(d){ return(y(d))} )
        .attr("stroke", "black")

});