function makeChart() {
    // set the dimensions and margins of the graph
    var margin = {top: 10, right: 30, bottom: 30, left: 60},
        width = 1920 - margin.left - margin.right,
        height = 1080 - margin.top - margin.bottom;

    // append the svg object to the body of the page
    var svg = d3.select("#LINE_CHART")
    .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
    .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

    //Read the data
    d3.csv("data/FormattedData.csv")
        .then(function(d) { 
        d.forEach(function(d) {
            d.Date = parseDate(d.Date);
            d.Price = parseFloat(d.Price);
        });

        var minDate = d3.min(d, function(d) {return d.Date;});
        var maxDate = d3.max(d, function(d) {return d.Date;});
        var maxPrice = d3.max(d, function(d) {return d.Price;});

        // Add X axis --> it is a date format
        var x = d3.scaleTime()
        .domain([minDate, maxDate])
        .range([0, WIDTH - MARGIN.RIGHT])
        xAxis = svg.append("g")
        .attr("transform", "translate(0," + 980 + ")")
        .call(d3.axisBottom(x));

        // Add Y axis
        var y = d3.scaleLinear()
        .domain([0, maxPrice])
        .range([HEIGHT-MARGIN.BOTTOM, MARGIN.TOP])
        yAxis = svg.append("g")
        .call(d3.axisLeft(y));

        // Add a clipPath: everything out of this area won't be drawn.
        var clip = svg.append("defs").append("svg:clipPath")
            .attr("id", "clip")
            .append("svg:rect")
            .attr("width", WIDTH-MARGIN.RIGHT )
            .attr("height", HEIGHT )
            .attr("x", 0)
            .attr("y", 0);

        // Add brushing
        var brush = d3.brushX()                   // Add the brush feature using the d3.brush function
            .extent( [ [0,100], [WIDTH, HEIGHT-MARGIN.TOP] ] )  // initialise the brush area: start at 0,0 and finishes at width,height: it means I select the whole graph area
            .on("end", updateChart)               // Each time the brush selection changes, trigger the 'updateChart' function

        // Create the line variable: where both the line and the brush take place
        var line = svg.append('g')
        .attr("clip-path", "url(#clip)")

        var makeLine = d3.line()
        .x(function(d) { return x(d.Date);})
        .y(function(d) { return y(d.Price);});

        var groupData = d3.group(d, d => d.Ticker)
        var tickers = groupHeader(d, "Ticker")
        var color = d3.scaleOrdinal()
            .domain(tickers)
            .range(['#e41a1c','#377eb8','#4daf4a','#984ea3','#ff7f00','#00008B','#a65628','#f781bf','#999999','#000000'])


        // Add the line
        line.selectAll('.line')
        .data(groupData)
        .enter()
        .append("path")
        .attr("class", "line")  // I add the class line to be able to modify this line later on.
        .attr('d', function(d) { 
            return makeLine(d[1])
        })
        .attr("fill", "none")
        .attr("stroke", d => color(d[0]))
        .attr("stroke-width", 3)

        // Add the brushing
        line
        .append("g")
            .attr("class", "brush")
            .call(brush);

        // A function that set idleTimeOut to null
        var idleTimeout
        function idled() { idleTimeout = null; }

        // A function that update the chart for given boundaries
        function updateChart(event) {

        // What are the selected boundaries?
        extent = event.selection
        maxPrice = d3.max(d, function(d) {return d.Price;});
        console.log(maxPrice)
        
        // If no selection, back to initial coordinate. Otherwise, update X axis domain
        if(!extent){
            if (!idleTimeout) return idleTimeout = setTimeout(idled, 350); // This allows to wait a little bit
            x.domain([ 4,8])
        }else{
            x.domain([x.invert(extent[0]), x.invert(extent[1])])
            line.select(".brush").call(brush.move, null) // This remove the grey brush area as soon as the selection has been done
        }

        // Update axis and line position
        xAxis.transition().duration(1000).call(d3.axisBottom(x))
        line
            .selectAll('.line')
            .transition()
            .duration(1000)
            .attr('d', function(d) { 
                return makeLine(d[1])
            })
        }

        // If user double click, reinitialize the chart
        svg.on("dblclick",function(){
        x.domain([minDate, maxDate])
        xAxis.transition().call(d3.axisBottom(x))
        line
            .selectAll('.line')
            .transition()
            .attr('d', function(d) { 
                return makeLine(d[1])
            })
        });
    })
}