//dimension of the  workspace

var w = window.innerWidth;
var h = window.innerHeight;

const WIDTH_LINE  = 1920*0.6, HEIGHT_LINE = 1080*0.8;
const WIDTH_HEAT  = 1920*0.3, HEIGHT_HEAT = 1080*0.7;

const MARGIN = {
    "LEFT":100,
    "RIGHT":100,
    "TOP":100,
    "BOTTOM":100,
};

var parseDate = d3.timeParse("%m/%d/%Y");

let colors = {
    "Consumer": "#00008B",
    "Healthcare": "#e41a1c",
    "Nasdaq": "#f781bf",
    "Financial": "#4daf4a",
    "Composite": "#999999",
    "Utilities": "#377eb8",
    "RealEstate": "#a65628",
    "Technology": "#984ea3",
    "Energy": "#000000",
    "Gold": "#ff7f00" 
    };

// get unique list
function groupHeader(d, header) {
  all = d3.map(d, function(d){return(d[header])});
  return all.filter((item, i, ar) => ar.indexOf(item) === i);
};
