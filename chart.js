window.onload = function(){
    setup("DataTest.csv");
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

/**
 * This function loads the data and calls other necessary functions to create our visualization
 * @param dataPath - the path to your data file from the project's root folder
 */
setup = function (dataPath) {
    //defining an easy reference for out SVG Container
    var SVG = d3.select("#SVG_CONTAINER");

    //Loading in our Data with D3
    d3.csv(dataPath).then(function (d) {

        d.sort(function(x, y){
            return new Date(x.Date) - new Date(y.Date);
        });

        //create a barchart object
        _barChart = new barChart(d, SVG);
        _barChart.draw();

    });

};

/**
 * We define our barChart object here
 * @Param data - the data to be use for this bar chart
 * @Param svg - the svg where the bar chart will be drawn
 */
barChart = function (data, svg) {

    //creating the scales for our bar chart
    xScale = d3.scaleBand() //a band scale automatically determines sizes of objects based on amount of data and draw space
        .domain(d3.range(data.length/3)) //amount of data
        .range([MARGIN.LEFT, width - MARGIN.RIGHT]) //draw space
        .padding(0.1) //space between each data mark

    //the frequency of occurrence
    yScale = d3.scaleLinear()   //a linear scale is simply a continuous linear growth axis
        .domain([0, 50])      //the "input" that you want to map, essentially the extent of your numeric data
        .range([height-MARGIN.BOTTOM, MARGIN.TOP]);   //the "output" you map it to, basically the pixels on your screen
            //the range is reversed because pixels height are counted downward,
            // and we want to map our largest value to the highest point, which is 0


    //draws our barchart
    this.draw = function(){

        //creating a group that will confine our bar chart. This is for organization purposes.
        //the actual creation is from svg.append onward
        //the first part assigns the result of that call to "chart"
        chart = svg.append('g')
            .attr("class", "barChart");

        bars = chart
            .selectAll('rect')  //we are going to bind all the rectangle
            .data(data) //to this data


        bars
            .enter() // so go into the data
            .append('rect') //and create a rectangle for each row of data from the csv, with the following attributes detailed below
            .attr("class", d => d.Ticker) //class = from a particular row in data, return letter from that row
            .attr("x", (d,i) => xScale(i) ) // x = for a particular row of data, return the row's index * (barWidth+spacing)
            .attr("y", d => yScale(d.Price)) //y = the where ever our scale thinks the top most of the bar should be
            //(x,y) denotes the top left corner of the rectangle
            .attr("width", xScale.bandwidth) //d3.scaleBand provides its calculated fields for you.
            //this technically is not a number, so you cannot do calculations with it
            .attr("height", d => yScale(0) - yScale(d.Price)) //the height of the rectangle is the difference between the top most part (frequency scaled)  and it's lowest part (0 scaled)
            .attr("fill", "steelblue") //set the color of the rectangle to blue
            .attr("class", d=> d.isCool);

        // add prices above bars
        prices = chart
            .selectAll("text")
            .data(data)
            .enter()
            .append("text")
            .attr("x", (d,i) => xScale(i) + 5)
            .attr("y", d => yScale(d.Price) - 20)
            .text(d => "$" + d.Price)
            .attr("font-family", "sans-serif")
            .attr("font-size", "14px")
            .attr("fill", "black");
            

        //create the render specifications for y axis
        var yAxis = d3.axisLeft()
            .scale(yScale);

        //draw the y axis on our chart
        chart.append("g")
            .attr("transform", "translate("+ MARGIN.LEFT + ","+ 0 +")")
            .call(yAxis);

        //create the render specifications for x axis
        var xAxis = d3.axisBottom()
            .tickFormat((d,i) => data[i].Date)
            .scale(xScale);

        //draw the y axis on our chart
        chart.append("g")
            .attr("transform", "translate("+ 0 + ","+ (height-MARGIN.BOTTOM) +")")
            .attr("class", "xAxis")
            .call(xAxis);
    };

    this.singleDay = function () {

        //creating a subset of our data that we want to keep (the cool letters)
        keepData = [];
        kIndex = 0;
        for (i = 0; i < data.length; i++){

            if(data[i].Date === '9/28/2015')
                keepData[kIndex++] = data[i];
        }

        //Update our scale for our subset
        xScale
            .domain(d3.range(keepData.length));
        
            var newAxis = d3.axisBottom()
                .tickFormat((d,i) => keepData[i].Date)
                .scale(xScale)

            svg.select(".xAxis")
                .transition()
                .duration(500)
                .call(newAxis);

        //define our selection
        bars = svg
            .select(".barChart")
            .selectAll('rect')
            .data(keepData) //rebind our new data
            // since we have 4 rows of data left, this just binds the data to the first 4 rects

        //remove what we don't want
        bars
            .exit() //select dom elements that have no data correlated to it
            .remove() // remove those objects

        // update bar width and x-position, also add some nice animation
        // update our remaining rects to correctly represent the data
        bars
            .transition()
            .duration(500)
            .attr("height", d => yScale(0) - yScale(d.Price))
            .attr("width", xScale.bandwidth)
            .attr("y", d => yScale(d.Price))
            .attr("x", (d,i) => xScale(i))
            .attr("fill", "lightblue");

    };

    this.allLetters = function () {

        // return our scale back to the uncool state
        xScale = d3.scaleBand() //a band scale automatically determines sizes of objects based on amount of data and draw space
        .domain(d3.range(data.length/3)) //amount of data
        .range([MARGIN.LEFT, width - MARGIN.RIGHT]) //draw space
        .padding(0.1) //space between each data mark

        var xAxis = d3.axisBottom()
            .tickFormat((d,i) => data[i].Date)
            .scale(xScale);

        svg.select(".xAxis")
            .transition()
            .duration(500)
            .call(xAxis);

        bars = svg
            .select(".barChart")
            .selectAll('rect')
            .data(data);
        

        // Make a nice animation and update the rect attributes as necessary
        bars
            .enter()
            .append('rect')
            .merge(bars)
            .transition()
            .duration(500)
            .attr("class", d=> d.isCool )
            .attr("x", (d,i) => xScale(i) )
            .attr("y", d => yScale(d.Price))
            .attr("width", xScale.bandwidth)
            .attr("height", d => yScale(0) - yScale(d.Price))
            .attr("fill", "steelblue");
    }
};

//this function handles the onclick event for our button in index.html
function switchFilter(){

    text = document.getElementById("switchFilter").innerHTML;

    if(text === "Single Day: OFF"){
        _barChart.singleDay();
        document.getElementById("switchFilter").innerHTML = "Single Day: ON";
    }
    else{
        _barChart.allLetters();
        document.getElementById("switchFilter").innerHTML = "Single Day: OFF";
    }


}