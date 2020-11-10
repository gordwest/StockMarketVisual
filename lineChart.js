// set the dimensions and margin2s of the graph
var margin2 = {top: 10, right: 30, bottom: 30, left: 60},
    width2 = 460 - margin2.left - margin2.right,
    height2 = 400 - margin2.top - margin2.bottom;

// append the svg object to the body of the page
var svg = d3.select("#LINE_CHART")
  .append("svg")
    .attr("width", width2 + margin2.left + margin2.right)
    .attr("height", height2 + margin2.top + margin2.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin2.left + "," + margin2.top + ")");

//Read the data
d3.csv("FormattedData.csv",

  // When reading the csv, I must format variables:
  function(d){
    return { Date : d3.timeParse("%Y-%m-%d")(d.Date), Price : d.Price }
  },

  // Now I can use this dataset:
  function(data) {

    // Add X axis --> it is a Date format
    var x = d3.scaleTime()
      .domain(d3.extent(data, function(d) { return d.Date; }))
      .range([ 0, width2 ]);
    svg.append("g")
      .attr("transform", "translate(0," + height2 + ")")
      .call(d3.axisBottom(x));

    // Add Y axis
    var y = d3.scaleLinear()
      .domain([0, d3.max(data, function(d) { return +d.Price; })])
      .range([ height2, 0 ]);
    svg.append("g")
      .call(d3.axisLeft(y));

    // Add the line
    svg.append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", "steelblue")
      .attr("stroke-width2", 1.5)
      .attr("d", d3.line()
        .x(function(d) { return x(d.Date) })
        .y(function(d) { return y(d.Price) })
        )

})