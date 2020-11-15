function createBoxPlot(){ 
  d3.csv("FormattedData.csv")
    .then(function(d) { 
      // parse data
      d.forEach(function(d) {
        d.Date = parseDate(d.Date);
        d.Price = parseFloat(d.Price);
      });
      // sort
      d.sort(function(a, b) { return +a.Price - +b.Price});

      let allTickers = groupHeader(d, "Ticker");
      console.log(allTickers)

      // a few features for the box
      var center = 150;
      var width = 80;

      var svg = d3.select("#BOX_PLOT")
      var chart = svg.append("g")
        .attr("transform", 'translate(50,50)');

        // Show the Y scale
      var y = d3.scaleLinear()
      .domain([0, d3.max(d, function(d) {return d.Price;})])
      .range([height, 0]);

      chart
       .call(d3.axisLeft(y))

      // filter by a given ticker
      for (var i = 0; i < allTickers.length; i++){
        var subsetData = d.filter(function(d){ return d.Ticker === allTickers[i] });
        // get prices
        var prices = d3.map(subsetData, function(subsetData){return(subsetData.Price)});

        var q1 = d3.quantile(prices, .25)
        var median = d3.quantile(prices, .5)
        var q3 = d3.quantile(prices, .75)
        var interQuantileRange = q3 - q1
        var min = q1 - 1.5 * interQuantileRange
        var max = q1 + 1.5 * interQuantileRange

        console.log(allTickers[i], min, median, max);

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
          .style("fill", colors[allTickers[i]])

        // show median, min and max horizontal lines
         chart
          .selectAll("toto")
          .data([min, median, max])
          .enter()
          .append("line")
          .attr("x1", center-width/2)
          .attr("x2", center+width/2)
          .attr("y1", function(subsetData){ return(y(subsetData))} )
          .attr("y2", function(subsetData){ return(y(subsetData))} )
          .attr("stroke", "black")

          center += width*2
      };

      

      

      

  });
}