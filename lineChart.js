function createLineChart(){

  d3.csv("FormattedData.csv")
    .then(function(d) { 
      d.forEach(function(d) {
        d.Date = parseDate(d.Date);
        d.Price = parseFloat(d.Price);
      });

      // group ETFs so we can color them separately
      let allTickers = groupHeader(d, "Ticker")
      // let colors = colorPalette(allTickers)
    
      // variables for axis ranges
      var minDate = d3.min(d, function(d) {return d.Date;});
      var maxDate = d3.max(d, function(d) {return d.Date;});
      var maxPrice = d3.max(d, function(d) {return d.Price;});

      // selecting html element and appending the svg
      var svg = d3.select("#LINE_CHART")
      var chart = svg.append("g")
        .attr("transform", 'translate(50,50)');

      // creating the scales
      var y = d3.scaleLinear()
        .domain([0, maxPrice])
        .range([height-MARGIN.BOTTOM, MARGIN.TOP])

      var x = d3.scaleTime()
        .domain([minDate, maxDate])
        .range([0, width - MARGIN.RIGHT])

      // creating the axises
      var yAxis = d3.axisLeft(y);
      var xAxis = d3.axisBottom(x); 

      var line = d3.line()
        .x(function(d) { return x(d.Date);})
        .y(function(d) { return y(d.Price);});

      // loop through groups and draw line
      for (var i = 0; i < allTickers.length; i++){
        chart.append('path')
          .attr("stroke", colors[allTickers[i]])
          .attr("stroke-width", "4px")
          .attr("fill", "none")
          .attr("d", line(d.filter(function(d){ return d.Ticker == allTickers[i]})));
      }
      
      // add axises
      chart.append('g')
        .attr('class','x axis')
        .attr("transform", "translate("+ 0 + ","+ (height - MARGIN.BOTTOM) + ")")
        .call(xAxis)

      chart.append('g')
        .attr('class','y axis')
        .call(yAxis)
    });
}