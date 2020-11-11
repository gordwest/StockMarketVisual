
// const MARGIN = {
//   "LEFT":100,
//   "RIGHT":100,
//   "TOP":100,
//   "BOTTOM":200,
// };
// const width  = 1920, height = 1080;

var parseDate = d3.timeParse("%m/%d/%Y");

d3.csv("FormattedData2.csv")
  .then(function(d) { 
    d.forEach(function(d) {
      d.Date = parseDate(d.Date);
      d.Price = parseFloat(d.Price);
    });
  
    var minDate = d3.min(d, function(d) {return d.Date;});
    var maxDate = d3.max(d, function(d) {return d.Date;});
    var maxPrice = d3.max(d, function(d) {return d.Price;});

    var y = d3.scaleLinear()
      .domain([0, maxPrice])
      .range([height-MARGIN.BOTTOM, MARGIN.TOP])

    var x = d3.scaleTime()
      .domain([minDate, maxDate])
      .range([0, width - MARGIN.RIGHT])

    var yAxis = d3.axisLeft(y);
    var xAxis = d3.axisBottom(x); 

    var svg = d3.select("#LINE_CHART")
    
    var chart = svg.append("g")
      .attr("transform", 'translate(50,50)');

    var line = d3.line()
      .x(function(d) { return x(d.Date);})
      .y(function(d) { return y(d.Price);});

    // draw line
    chart.append('path')
      .data(d)
      .attr("d", line(d));

      // add axis
      chart.append('g')
        .attr('class','x axis')
        .attr("transform", "translate("+ 0 + ","+ (height - MARGIN.BOTTOM) + ")")
        .call(xAxis)

      chart.append('g')
        .attr('class','y axis')
        .call(yAxis)


  });