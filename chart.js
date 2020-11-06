// Load CSV
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

/**
 * This function loads the data and calls other necessary functions to create our visualization
 * @param dataPath - the path to your data file from the project's root folder
 */
setup = function (dataPath) {
    //defining an easy reference for out SVG Container
    var SVG = d3.select("#SVG_CONTAINER");

    //Loading in our Data with D3
    d3.csv(dataPath).then(function (d) {
        //sort data by date, descending
        d.sort(function(x, y){  
            return new Date(x.Date) - new Date(y.Date);
        });
        //create a barchart object
        barChart = new barChart(d, SVG);  
    });
};

barChart = function (data, svg) {
    // Scales
    xScale = d3.scaleBand()
        .domain(d3.range(data.length))
        .range([MARGIN.LEFT, width - MARGIN.RIGHT])
        .padding(0.1);

    yScale = d3.scaleLinear()
        .domain([0, 50])
        .range([height - MARGIN.BOTTOM, MARGIN.TOP]);

    // create an svg group for the bar chart
    chart = svg.append("g")
        .attr("class", "bar chart")

    // Create the bars in the bar chart
    bars = chart.selectAll("rect")
        .data(data)
        .enter()
        .append("rect")
        .attr("class", function (d) {
            return d.Ticker;
        })
        .attr("x", (d,i) => xScale(i)) // function shorthand
        .attr("y", d => yScale(d.Price))
        .attr("width", xScale.bandwidth) 
        .attr("height", d => yScale(0) - yScale(d.Price)) 
        .attr("fill", "steelblue")
        
    // create Y axis using yScale
    var yAxis = d3.axisLeft()
        .scale(yScale);
    chart.append("g")
        .attr("transform", "translate(" + MARGIN.LEFT + "," + 0 + ")")
        .call(yAxis)
        
    // create X axis using xScale    
    var xAxis = d3.axisBottom()
        .tickFormat((d,i) => data[i].Date)
        .scale(xScale);
    chart.append("g")
        .attr("transform", "translate(" + 0 + "," + (height - MARGIN.BOTTOM + 10) + ")")
        .call(xAxis)

};