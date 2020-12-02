function createLineChart(){

  d3.csv("data/FormattedData.csv")
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
      var chart = d3.select("#LINE_CHART")
        .append("g")
        .attr("clip-path", "url(#clip)")
        .attr("transform", 'translate(50,0)');

      // creating the scales
      var y = d3.scaleLinear()
        .domain([0, maxPrice])
        .range([HEIGHT-MARGIN.BOTTOM, MARGIN.TOP])

      var x = d3.scaleTime()
        .domain([minDate, maxDate])
        .range([0, WIDTH - MARGIN.RIGHT])

      // creating the axises
      var yAxis = d3.axisLeft(y);
      var xAxis = d3.axisBottom(x); 

      var clip = chart.append("defs").append("svg:clipPath")
        .attr("id", "clip")
        .append("svg:rect")
        .attr("width", WIDTH )
        .attr("height", HEIGHT )
        .attr("x", 0)
        .attr("y", 0);

      var line = d3.line()
        .x(function(d) { return x(d.Date);})
        .y(function(d) { return y(d.Price);});

      // Add brushing
      var brush = d3.brushX()                  
        .extent( [ [0,100], [WIDTH, HEIGHT-MARGIN.TOP] ] )  
        .on("end", updateChart)  

      var groupData = d3.group(d, d => d.Ticker)
      var tickers = groupHeader(d, "Ticker")
      var color = d3.scaleOrdinal()
        .domain(tickers)
        .range(['#e41a1c','#377eb8','#4daf4a','#984ea3','#ff7f00','#00008B','#a65628','#f781bf','#999999','#000000'])

      chart.selectAll('.line')
        .data(groupData)
        .enter()
        .append('path')
        .attr('d', function(d) { 
          return line(d[1])
        })
        .attr("fill", "none")
        .attr("stroke-width", "3px")
        .attr("stroke", d => color(d[0]))

      chart
        .append('g')
        .attr("class", "brush")
        .call(brush)

      // add axises
      chart.append('g')
        .attr('class','x axis')
        .attr("transform", "translate("+ 0 + ","+ (HEIGHT - MARGIN.BOTTOM) + ")")
        .call(xAxis)

      chart.append('g')
        .attr('class','y axis')
        .call(yAxis)

      var idleTimeout
      function idled() { idleTimeout = null; }
  
      function updateChart() {
        // What are the selected boundaries?
        extent = d3.event.selection
        console.log(extent)
  
        // If no selection, back to initial coordinate. Otherwise, update X axis domain
        if(!extent){
          if (!idleTimeout) return idleTimeout = setTimeout(idled, 350); // This allows to wait a little bit
          x.domain([ 4,8])
        }else{
          x.domain([ x.invert(extent[0]), x.invert(extent[1]) ])
          line.select(".brush").call(brush.move, null) // This remove the grey brush area as soon as the selection has been done
        }
  
        // Update axis and line position
        xAxis.transition().duration(1000).call(d3.axisBottom(x))
        line
            .select('.line')
            .transition()
            .duration(1000)
            .attr('d', function(d) { 
              return line(d[1])
            })
      }
    });

}