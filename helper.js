//dimension of the  workspace
const width  = 1920, height = 1080;

const MARGIN = {
    "LEFT":100,
    "RIGHT":100,
    "TOP":100,
    "BOTTOM":100,
};

// For bar chart
var dateIdx = 0
var _barChart; //define a global reference for barchart
let colors = {
    "XST.TO": "#FF0000",
    "XHC.TO": "#e8871a",
    "XQQ.TO": "#00c0c7",
    "XFN.TO": "#9089fa",
    "XIC.TO": "#2780eb",
    "XUT.TO": "#47e26f",
    "XRE.TO": "#dfbf03",
    "XIT.TO": "#da3490",
    "XEG.TO": "#268d6c",
    "XGD.TO": "#6f38b1",
    }

var parseDate = d3.timeParse("%m/%d/%Y");

// create color palette
function colorPalette (group) { 
  return d3.scaleOrdinal()
  .domain(group)
  .range(['#e41a1c','#377eb8','#4daf4a','#984ea3','#ff7f00','#ffff33','#a65628','#f781bf','#999999', '#000000']);
};

// get unique list of ETFs
function groupHeader(d, header) {
  all = d3.map(d, function(d){return(d[header])});
  return all.filter((item, i, ar) => ar.indexOf(item) === i);
};

// filter data for specific date
filterData = function(data, dateStr){
    filteredData = [];
    kIndex = 0;
    for (i = 0; i < data.length; i++){
        if(data[i].Date === dateStr){
            filteredData[kIndex++] = data[i];
        }
    }
    return filteredData;
}

// Use this in the meantime
let dateRange = ["9/21/2015", "9/22/2015", "9/23/2015", "9/24/2015", "9/25/2015", "9/28/2015", "9/29/2015", "9/30/2015", "10/1/2015", "10/2/2015", "10/5/2015", "10/6/2015", "10/7/2015", "10/8/2015", "10/9/2015", "10/13/2015", "10/14/2015", "10/15/2015", "10/16/2015", "10/19/2015", "10/20/2015", "10/21/2015", "10/22/2015", "10/23/2015", "10/26/2015", "10/27/2015", "10/28/2015", "10/29/2015", "10/30/2015", "11/2/2015", "11/3/2015", "11/4/2015", "11/5/2015", "11/6/2015", "11/9/2015", "11/10/2015", "11/11/2015", "11/12/2015", "11/13/2015", "11/16/2015", "11/17/2015", "11/18/2015", "11/19/2015", "11/20/2015", "11/23/2015", "11/24/2015", "11/25/2015", "11/26/2015", "11/27/2015", "11/30/2015", "12/1/2015", "12/2/2015", "12/3/2015", "12/4/2015", "12/7/2015", "12/8/2015", "12/9/2015", "12/10/2015", "12/11/2015", "12/14/2015", "12/15/2015", "12/16/2015", "12/17/2015", "12/18/2015", "12/21/2015", "12/22/2015", "12/23/2015", "12/24/2015", "12/29/2015", "12/30/2015", "12/31/2015", "1/4/2016", "1/5/2016", "1/6/2016", "1/7/2016", "1/8/2016", "1/11/2016", "1/12/2016", "1/13/2016", "1/14/2016", "1/15/2016", "1/18/2016", "1/19/2016", "1/20/2016", "1/21/2016", "1/22/2016", "1/25/2016", "1/26/2016", "1/27/2016", "1/28/2016", "1/29/2016", "2/1/2016", "2/2/2016", "2/3/2016", "2/4/2016", "2/5/2016", "2/8/2016", "2/9/2016", "2/10/2016", "2/11/2016", "2/12/2016", "2/16/2016", "2/17/2016", "2/18/2016", "2/19/2016", "2/22/2016", "2/23/2016", "2/24/2016", "2/25/2016", "2/26/2016", "2/29/2016", "3/1/2016", "3/2/2016", "3/3/2016", "3/4/2016", "3/7/2016", "3/8/2016", "3/9/2016", "3/10/2016", "3/11/2016", "3/14/2016", "3/15/2016", "3/16/2016", "3/17/2016", "3/18/2016", "3/21/2016", "3/22/2016", "3/23/2016", "3/24/2016", "3/28/2016", "3/29/2016", "3/30/2016", "3/31/2016", "4/1/2016", "4/4/2016", "4/5/2016", "4/6/2016", "4/7/2016", "4/8/2016", "4/11/2016", "4/12/2016", "4/13/2016", "4/14/2016", "4/15/2016", "4/18/2016", "4/19/2016", "4/20/2016", "4/21/2016", "4/22/2016", "4/25/2016", "4/26/2016", "4/27/2016", "4/28/2016", "4/29/2016", "5/2/2016", "5/3/2016", "5/4/2016", "5/5/2016", "5/6/2016", "5/9/2016", "5/10/2016", "5/11/2016", "5/12/2016", "5/13/2016", "5/16/2016", "5/17/2016", "5/18/2016", "5/19/2016", "5/20/2016", "5/24/2016", "5/25/2016", "5/26/2016", "5/27/2016", "5/30/2016", "5/31/2016", "6/1/2016", "6/2/2016", "6/3/2016", "6/6/2016", "6/7/2016", "6/8/2016", "6/9/2016", "6/10/2016", "6/13/2016", "6/14/2016", "6/15/2016", "6/16/2016", "6/17/2016", "6/20/2016", "6/21/2016", "6/22/2016", "6/23/2016", "6/24/2016", "6/27/2016", "6/28/2016", "6/29/2016", "6/30/2016", "7/4/2016", "7/5/2016", "7/6/2016", "7/7/2016", "7/8/2016", "7/11/2016", "7/12/2016", "7/13/2016", "7/14/2016", "7/15/2016", "7/18/2016", "7/19/2016", "7/20/2016", "7/21/2016", "7/22/2016", "7/25/2016", "7/26/2016", "7/27/2016", "7/28/2016", "7/29/2016", "8/2/2016", "8/3/2016", "8/4/2016", "8/5/2016", "8/8/2016", "8/9/2016", "8/10/2016", "8/11/2016", "8/12/2016", "8/15/2016", "8/16/2016", "8/17/2016", "8/18/2016", "8/19/2016", "8/22/2016", "8/23/2016", "8/24/2016", "8/25/2016", "8/26/2016", "8/29/2016", "8/30/2016", "8/31/2016", "9/1/2016", "9/2/2016", "9/6/2016", "9/7/2016", "9/8/2016", "9/9/2016", "9/12/2016", "9/13/2016", "9/14/2016", "9/15/2016", "9/16/2016", "9/19/2016", "9/20/2016", "9/21/2016", "9/22/2016", "9/23/2016", "9/26/2016", "9/27/2016", "9/28/2016", "9/29/2016", "9/30/2016", "10/3/2016", "10/4/2016", "10/5/2016", "10/6/2016", "10/7/2016", "10/11/2016", "10/12/2016", "10/13/2016", "10/14/2016", "10/17/2016", "10/18/2016", "10/19/2016", "10/20/2016", "10/21/2016", "10/24/2016", "10/25/2016", "10/26/2016", "10/27/2016", "10/28/2016", "10/31/2016", "11/1/2016", "11/2/2016", "11/3/2016", "11/4/2016", "11/7/2016", "11/8/2016", "11/9/2016", "11/10/2016", "11/11/2016", "11/14/2016", "11/15/2016", "11/16/2016", "11/17/2016", "11/18/2016", "11/21/2016", "11/22/2016", "11/23/2016", "11/24/2016", "11/25/2016", "11/28/2016", "11/29/2016", "11/30/2016", "12/1/2016", "12/2/2016", "12/5/2016", "12/6/2016", "12/7/2016", "12/8/2016", "12/9/2016", "12/12/2016", "12/13/2016", "12/14/2016", "12/15/2016", "12/16/2016", "12/19/2016", "12/20/2016", "12/21/2016", "12/22/2016", "12/23/2016", "12/28/2016", "12/29/2016", "12/30/2016", "1/3/2017", "1/4/2017", "1/5/2017", "1/6/2017", "1/9/2017", "1/10/2017", "1/11/2017", "1/12/2017", "1/13/2017", "1/16/2017", "1/17/2017", "1/18/2017", "1/19/2017", "1/20/2017", "1/23/2017", "1/24/2017", "1/25/2017", "1/26/2017", "1/27/2017", "1/30/2017", "1/31/2017", "2/1/2017", "2/2/2017", "2/3/2017", "2/6/2017", "2/7/2017", "2/8/2017", "2/9/2017", "2/10/2017", "2/13/2017", "2/14/2017", "2/15/2017", "2/16/2017", "2/17/2017", "2/21/2017", "2/22/2017", "2/23/2017", "2/24/2017", "2/27/2017", "2/28/2017", "3/1/2017", "3/2/2017", "3/3/2017", "3/6/2017", "3/7/2017", "3/8/2017", "3/9/2017", "3/10/2017", "3/13/2017", "3/14/2017", "3/15/2017", "3/16/2017", "3/17/2017", "3/20/2017", "3/21/2017", "3/22/2017", "3/23/2017", "3/24/2017", "3/27/2017", "3/28/2017", "3/29/2017", "3/30/2017", "3/31/2017", "4/3/2017", "4/4/2017", "4/5/2017", "4/6/2017", "4/7/2017", "4/10/2017", "4/11/2017", "4/12/2017", "4/13/2017", "4/17/2017", "4/18/2017", "4/19/2017", "4/20/2017", "4/21/2017", "4/24/2017", "4/25/2017", "4/26/2017", "4/27/2017", "4/28/2017", "5/1/2017", "5/2/2017", "5/3/2017", "5/4/2017", "5/5/2017", "5/8/2017", "5/9/2017", "5/10/2017", "5/11/2017", "5/12/2017", "5/15/2017", "5/16/2017", "5/17/2017", "5/18/2017", "5/19/2017", "5/23/2017", "5/24/2017", "5/25/2017", "5/26/2017", "5/29/2017", "5/30/2017", "5/31/2017", "6/1/2017", "6/2/2017", "6/5/2017", "6/6/2017", "6/7/2017", "6/8/2017", "6/9/2017", "6/12/2017", "6/13/2017", "6/14/2017", "6/15/2017", "6/16/2017", "6/19/2017", "6/20/2017", "6/21/2017", "6/22/2017", "6/23/2017", "6/26/2017", "6/27/2017", "6/28/2017", "6/29/2017", "6/30/2017", "7/4/2017", "7/5/2017", "7/6/2017", "7/7/2017", "7/10/2017", "7/11/2017", "7/12/2017", "7/13/2017", "7/14/2017", "7/17/2017", "7/18/2017", "7/19/2017", "7/20/2017", "7/21/2017", "7/24/2017", "7/25/2017", "7/26/2017", "7/27/2017", "7/28/2017", "7/31/2017", "8/1/2017", "8/2/2017", "8/3/2017", "8/4/2017", "8/8/2017", "8/9/2017", "8/10/2017", "8/11/2017", "8/14/2017", "8/15/2017", "8/16/2017", "8/17/2017", "8/18/2017", "8/21/2017", "8/22/2017", "8/23/2017", "8/24/2017", "8/25/2017", "8/28/2017", "8/29/2017", "8/30/2017", "8/31/2017", "9/1/2017", "9/5/2017", "9/6/2017", "9/7/2017", "9/8/2017", "9/11/2017", "9/12/2017", "9/13/2017", "9/14/2017", "9/15/2017", "9/18/2017", "9/19/2017", "9/20/2017", "9/21/2017", "9/22/2017", "9/25/2017", "9/26/2017", "9/27/2017", "9/28/2017", "9/29/2017", "10/2/2017", "10/3/2017", "10/4/2017", "10/5/2017", "10/6/2017", "10/10/2017", "10/11/2017", "10/12/2017", "10/13/2017", "10/16/2017", "10/17/2017", "10/18/2017", "10/19/2017", "10/20/2017", "10/23/2017", "10/24/2017", "10/25/2017", "10/26/2017", "10/27/2017", "10/30/2017", "10/31/2017", "11/1/2017", "11/2/2017", "11/3/2017", "11/6/2017", "11/7/2017", "11/8/2017", "11/9/2017", "11/10/2017", "11/13/2017", "11/14/2017", "11/15/2017", "11/16/2017", "11/17/2017", "11/20/2017", "11/21/2017", "11/22/2017", "11/23/2017", "11/24/2017", "11/27/2017", "11/28/2017", "11/29/2017", "11/30/2017", "12/1/2017", "12/4/2017", "12/5/2017", "12/6/2017", "12/7/2017", "12/8/2017", "12/11/2017", "12/12/2017", "12/13/2017", "12/14/2017", "12/15/2017", "12/18/2017", "12/19/2017", "12/20/2017", "12/21/2017", "12/22/2017", "12/27/2017", "12/28/2017", "12/29/2017", "1/2/2018", "1/3/2018", "1/4/2018", "1/5/2018", "1/8/2018", "1/9/2018", "1/10/2018", "1/11/2018", "1/12/2018", "1/15/2018", "1/16/2018", "1/17/2018", "1/18/2018", "1/19/2018", "1/22/2018", "1/23/2018", "1/24/2018", "1/25/2018", "1/26/2018", "1/29/2018", "1/30/2018", "1/31/2018", "2/1/2018", "2/2/2018", "2/5/2018", "2/6/2018", "2/7/2018", "2/8/2018", "2/9/2018", "2/12/2018", "2/13/2018", "2/14/2018", "2/15/2018", "2/16/2018", "2/20/2018", "2/21/2018", "2/22/2018", "2/23/2018", "2/26/2018", "2/27/2018", "2/28/2018", "3/1/2018", "3/2/2018", "3/5/2018", "3/6/2018", "3/7/2018", "3/8/2018", "3/9/2018", "3/12/2018", "3/13/2018", "3/14/2018", "3/15/2018", "3/16/2018", "3/19/2018", "3/20/2018", "3/21/2018", "3/22/2018", "3/23/2018", "3/26/2018", "3/27/2018", "3/28/2018", "3/29/2018", "4/2/2018", "4/3/2018", "4/4/2018", "4/5/2018", "4/6/2018", "4/9/2018", "4/10/2018", "4/11/2018", "4/12/2018", "4/13/2018", "4/16/2018", "4/17/2018", "4/18/2018", "4/19/2018", "4/20/2018", "4/23/2018", "4/24/2018", "4/25/2018", "4/26/2018", "4/27/2018", "4/30/2018", "5/1/2018", "5/2/2018", "5/3/2018", "5/4/2018", "5/7/2018", "5/8/2018", "5/9/2018", "5/10/2018", "5/11/2018", "5/14/2018", "5/15/2018", "5/16/2018", "5/17/2018", "5/18/2018", "5/22/2018", "5/23/2018", "5/24/2018", "5/25/2018", "5/28/2018", "5/29/2018", "5/30/2018", "5/31/2018", "6/1/2018", "6/4/2018", "6/5/2018", "6/6/2018", "6/7/2018", "6/8/2018", "6/11/2018", "6/12/2018", "6/13/2018", "6/14/2018", "6/15/2018", "6/18/2018", "6/19/2018", "6/20/2018", "6/21/2018", "6/22/2018", "6/25/2018", "6/26/2018", "6/27/2018", "6/28/2018", "6/29/2018", "7/3/2018", "7/4/2018", "7/5/2018", "7/6/2018", "7/9/2018", "7/10/2018", "7/11/2018", "7/12/2018", "7/13/2018", "7/16/2018", "7/17/2018", "7/18/2018", "7/19/2018", "7/20/2018", "7/23/2018", "7/24/2018", "7/25/2018", "7/26/2018", "7/27/2018", "7/30/2018", "7/31/2018", "8/1/2018", "8/2/2018", "8/3/2018", "8/7/2018", "8/8/2018", "8/9/2018", "8/10/2018", "8/13/2018", "8/14/2018", "8/15/2018", "8/16/2018", "8/17/2018", "8/20/2018", "8/21/2018", "8/22/2018", "8/23/2018", "8/24/2018", "8/27/2018", "8/28/2018", "8/29/2018", "8/30/2018", "8/31/2018", "9/4/2018", "9/5/2018", "9/6/2018", "9/7/2018", "9/10/2018", "9/11/2018", "9/12/2018", "9/13/2018", "9/14/2018", "9/17/2018", "9/18/2018", "9/19/2018", "9/20/2018", "9/21/2018", "9/24/2018", "9/25/2018", "9/26/2018", "9/27/2018", "9/28/2018", "10/1/2018", "10/2/2018", "10/3/2018", "10/4/2018", "10/5/2018", "10/9/2018", "10/10/2018", "10/11/2018", "10/12/2018", "10/15/2018", "10/16/2018", "10/17/2018", "10/18/2018", "10/19/2018", "10/22/2018", "10/23/2018", "10/24/2018", "10/25/2018", "10/26/2018", "10/29/2018", "10/30/2018", "10/31/2018", "11/1/2018", "11/2/2018", "11/5/2018", "11/6/2018", "11/7/2018", "11/8/2018", "11/9/2018", "11/12/2018", "11/13/2018", "11/14/2018", "11/15/2018", "11/16/2018", "11/19/2018", "11/20/2018", "11/21/2018", "11/22/2018", "11/23/2018", "11/26/2018", "11/27/2018", "11/28/2018", "11/29/2018", "11/30/2018", "12/3/2018", "12/4/2018", "12/5/2018", "12/6/2018", "12/7/2018", "12/10/2018", "12/11/2018", "12/12/2018", "12/13/2018", "12/14/2018", "12/17/2018", "12/18/2018", "12/19/2018", "12/20/2018", "12/21/2018", "12/24/2018", "12/27/2018", "12/28/2018", "12/31/2018", "1/2/2019", "1/3/2019", "1/4/2019", "1/7/2019", "1/8/2019", "1/9/2019", "1/10/2019", "1/11/2019", "1/14/2019", "1/15/2019", "1/16/2019", "1/17/2019", "1/18/2019", "1/21/2019", "1/22/2019", "1/23/2019", "1/24/2019", "1/25/2019", "1/28/2019", "1/29/2019", "1/30/2019", "1/31/2019", "2/1/2019", "2/4/2019", "2/5/2019", "2/6/2019", "2/7/2019", "2/8/2019", "2/11/2019", "2/12/2019", "2/13/2019", "2/14/2019", "2/15/2019", "2/19/2019", "2/20/2019", "2/21/2019", "2/22/2019", "2/25/2019", "2/26/2019", "2/27/2019", "2/28/2019", "3/1/2019", "3/4/2019", "3/5/2019", "3/6/2019", "3/7/2019", "3/8/2019", "3/11/2019", "3/12/2019", "3/13/2019", "3/14/2019", "3/15/2019", "3/18/2019", "3/19/2019", "3/20/2019", "3/21/2019", "3/22/2019", "3/25/2019", "3/26/2019", "3/27/2019", "3/28/2019", "3/29/2019", "4/1/2019", "4/2/2019", "4/3/2019", "4/4/2019", "4/5/2019", "4/8/2019", "4/9/2019", "4/10/2019", "4/11/2019", "4/12/2019", "4/15/2019", "4/16/2019", "4/17/2019", "4/18/2019", "4/22/2019", "4/23/2019", "4/24/2019", "4/25/2019", "4/26/2019", "4/29/2019", "4/30/2019", "5/1/2019", "5/2/2019", "5/3/2019", "5/6/2019", "5/7/2019", "5/8/2019", "5/9/2019", "5/10/2019", "5/13/2019", "5/14/2019", "5/15/2019", "5/16/2019", "5/17/2019", "5/21/2019", "5/22/2019", "5/23/2019", "5/24/2019", "5/27/2019", "5/28/2019", "5/29/2019", "5/30/2019", "5/31/2019", "6/3/2019", "6/4/2019", "6/5/2019", "6/6/2019", "6/7/2019", "6/10/2019", "6/11/2019", "6/12/2019", "6/13/2019", "6/14/2019", "6/17/2019", "6/18/2019", "6/19/2019", "6/20/2019", "6/21/2019", "6/24/2019", "6/25/2019", "6/26/2019", "6/27/2019", "6/28/2019", "7/2/2019", "7/3/2019", "7/4/2019", "7/5/2019", "7/8/2019", "7/9/2019", "7/10/2019", "7/11/2019", "7/12/2019", "7/15/2019", "7/16/2019", "7/17/2019", "7/18/2019", "7/19/2019", "7/22/2019", "7/23/2019", "7/24/2019", "7/25/2019", "7/26/2019", "7/29/2019", "7/30/2019", "7/31/2019", "8/1/2019", "8/2/2019", "8/6/2019", "8/7/2019", "8/8/2019", "8/9/2019", "8/12/2019", "8/13/2019", "8/14/2019", "8/15/2019", "8/16/2019", "8/19/2019", "8/20/2019", "8/21/2019", "8/22/2019", "8/23/2019", "8/26/2019", "8/27/2019", "8/28/2019", "8/29/2019", "8/30/2019", "9/3/2019", "9/4/2019", "9/5/2019", "9/6/2019", "9/9/2019", "9/10/2019", "9/11/2019", "9/12/2019", "9/13/2019", "9/16/2019", "9/17/2019", "9/18/2019", "9/19/2019", "9/20/2019", "9/23/2019", "9/24/2019", "9/25/2019", "9/26/2019", "9/27/2019", "9/30/2019", "10/1/2019", "10/2/2019", "10/3/2019", "10/4/2019", "10/7/2019", "10/8/2019", "10/9/2019", "10/10/2019", "10/11/2019", "10/15/2019", "10/16/2019", "10/17/2019", "10/18/2019", "10/21/2019", "10/22/2019", "10/23/2019", "10/24/2019", "10/25/2019", "10/28/2019", "10/29/2019", "10/30/2019", "10/31/2019", "11/1/2019", "11/4/2019", "11/5/2019", "11/6/2019", "11/7/2019", "11/8/2019", "11/11/2019", "11/12/2019", "11/13/2019", "11/14/2019", "11/15/2019", "11/18/2019", "11/19/2019", "11/20/2019", "11/21/2019", "11/22/2019", "11/25/2019", "11/26/2019", "11/27/2019", "11/28/2019", "11/29/2019", "12/2/2019", "12/3/2019", "12/4/2019", "12/5/2019", "12/6/2019", "12/9/2019", "12/10/2019", "12/11/2019", "12/12/2019", "12/13/2019", "12/16/2019", "12/17/2019", "12/18/2019", "12/19/2019", "12/20/2019", "12/23/2019", "12/24/2019", "12/27/2019", "12/30/2019", "12/31/2019", "1/2/2020", "1/3/2020", "1/6/2020", "1/7/2020", "1/8/2020", "1/9/2020", "1/10/2020", "1/13/2020", "1/14/2020", "1/15/2020", "1/16/2020", "1/17/2020", "1/20/2020", "1/21/2020", "1/22/2020", "1/23/2020", "1/24/2020", "1/27/2020", "1/28/2020", "1/29/2020", "1/30/2020", "1/31/2020", "2/3/2020", "2/4/2020", "2/5/2020", "2/6/2020", "2/7/2020", "2/10/2020", "2/11/2020", "2/12/2020", "2/13/2020", "2/14/2020", "2/18/2020", "2/19/2020", "2/20/2020", "2/21/2020", "2/24/2020", "2/25/2020", "2/26/2020", "2/27/2020", "2/28/2020", "3/2/2020", "3/3/2020", "3/4/2020", "3/5/2020", "3/6/2020", "3/9/2020", "3/10/2020", "3/11/2020", "3/12/2020", "3/13/2020", "3/16/2020", "3/17/2020", "3/18/2020", "3/19/2020", "3/20/2020", "3/23/2020", "3/24/2020", "3/25/2020", "3/26/2020", "3/27/2020", "3/30/2020", "3/31/2020", "4/1/2020", "4/2/2020", "4/3/2020", "4/6/2020", "4/7/2020", "4/8/2020", "4/9/2020", "4/13/2020", "4/14/2020", "4/15/2020", "4/16/2020", "4/17/2020", "4/20/2020", "4/21/2020", "4/22/2020", "4/23/2020", "4/24/2020", "4/27/2020", "4/28/2020", "4/29/2020", "4/30/2020", "5/1/2020", "5/4/2020", "5/5/2020", "5/6/2020", "5/7/2020", "5/8/2020", "5/11/2020", "5/12/2020", "5/13/2020", "5/14/2020", "5/15/2020", "5/19/2020", "5/20/2020", "5/21/2020", "5/22/2020", "5/25/2020", "5/26/2020", "5/27/2020", "5/28/2020", "5/29/2020", "6/1/2020", "6/2/2020", "6/3/2020", "6/4/2020", "6/5/2020", "6/8/2020", "6/9/2020", "6/10/2020", "6/11/2020", "6/12/2020", "6/15/2020", "6/16/2020", "6/17/2020", "6/18/2020", "6/19/2020", "6/22/2020", "6/23/2020", "6/24/2020", "6/25/2020", "6/26/2020", "6/29/2020", "6/30/2020", "7/2/2020", "7/3/2020", "7/6/2020", "7/7/2020", "7/8/2020", "7/9/2020", "7/10/2020", "7/13/2020", "7/14/2020", "7/15/2020", "7/16/2020", "7/17/2020", "7/20/2020", "7/21/2020", "7/22/2020", "7/23/2020", "7/24/2020", "7/27/2020", "7/28/2020", "7/29/2020", "7/30/2020", "7/31/2020", "8/4/2020", "8/5/2020", "8/6/2020", "8/7/2020", "8/10/2020", "8/11/2020", "8/12/2020", "8/13/2020", "8/14/2020", "8/17/2020", "8/18/2020", "8/19/2020", "8/20/2020", "8/21/2020", "8/24/2020", "8/25/2020", "8/26/2020", "8/27/2020", "8/28/2020", "8/31/2020", "9/1/2020", "9/2/2020", "9/3/2020", "9/4/2020", "9/8/2020", "9/9/2020", "9/10/2020", "9/11/2020", "9/14/2020", "9/15/2020", "9/16/2020", "9/17/2020", "9/18/2020"]