
var margin = {top: 20, right: 160, bottom: 35, left: 30};

var width = 960 - margin.left - margin.right,

    height = 500 - margin.top - margin.bottom;

var svg1 = d3.select("div#vis1")
  .append("svg")
  .attr("preserveAspectRatio", "xMinYMin meet")
  .attr("viewBox", "0 0 960 500")
  .classed("svg-content", true);
 /*.attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom);*/
  
 var g1 = svg1.append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var tooltip1 = d3.select("div#vis1").append("div").attr("class", "tooltip");

var x = d3.scaleBand()
    .rangeRound([0, width])

    .paddingInner(0.05)
    .align(0.1);
	
// x1 defined for Grouped bar graph
var x1 = d3.scaleBand();
	
var y = d3.scaleLinear()
    .range([height, 0]);

var color = d3.scaleOrdinal()
    .range(["#98abc5", "#8a89a6", "#7b6888"]);

/*d3.csv("/CS498FinalTermProject-PERMAnalysis/data/top10cities.csv", function(d, i, columns) {
  for (i = 1, t = 0; i < columns.length; ++i) t += d[columns[i]] = +d[columns[i]];
  d.total = t;
  return d;
}, function(error, data) {
  if (error) throw error;*/
var csv = 'city,year2014,year2015,year2016\nChicago,290,1630,2140\nHouston,335,1891,1871\nSunnyvale,385,1528,2221\nSan Francisco,313,1580,2654\nRedmond,547,739,3632\nMountain View,469,2499,3164\nSan Jose,808,2302,3116\nSanta Clara,345,3115,3588\nNew York,959,4511,5633\nCollege Station,23,7976,3636';

var data = d3.csvParse(csv), columns = ["2014", "2015", "2016"];

data.forEach(function(d) {
    for (i = 1, t = 0; i < columns.length; ++i) t += d[columns[i]] = +d[columns[i]];
    d.total = t;
});

 // var keys = data.columns.slice(1);
var keys = columns;

  data.sort(function(a, b) { return b.total - a.total; });
  
  x.domain(data.map(function(d) { return d.city; }));
  
  //defined for Grouped bar graph  
  x1.domain(keys).rangeRound([0, x.bandwidth()]);
  
  y.domain([0, d3.max(data, function(d) { return d.total; })]).nice();
  color.domain(keys);

  //defined for Stacked bar graph 
  g1.append("g")
	.selectAll("g")
	.data(d3.stack().keys(keys)(data))
	.enter().append("g")
	.attr("fill", function(d) { return color(d.key); })
	.selectAll("rect")
	.data(function(d) { return d; })
	.enter().append("rect")
	.attr("x", function(d) { return x(d.data.city); })
	.attr("y", function(d) { return y(d[1]); })
	.attr("height", function(d) { return y(d[0]) - y(d[1]); })
	.attr("width", x.bandwidth())
	.on("mouseover", function() { tooltip1.style("display", null); })
	.on("mouseout", function() { tooltip1.style("display", "none"); })
  	.on("mousemove", function(d) {
	  tooltip1
		.style("left", d3.event.pageX - 50 + "px")
                .style("top", d3.event.pageY - 150 + "px")		
	  	.style("display", "inline-block")
		.html("Employer City: <b>"+d.data.city+"</b>"+ "<br>" + "Number of Employees: " +"<b>"+(d[1]-d[0]));    			
		});
		
  g1.append("g")
		.attr("class", "axis")
		.attr("transform", "translate(0," + height + ")")
		.call(d3.axisBottom(x));

  g1.append("g")
		.attr("class", "axis")
		.call(d3.axisLeft(y).ticks(null, "s"))
		.append("text")
		.attr("x", 2)
		.attr("y", y(y.ticks().pop()) + 0.5)
		.attr("dy", "0.32em")
		.attr("fill", "#000")
		.attr("font-weight", "bold")
		.attr("text-anchor", "start")
		.text("No. of Employees");

  /*var legend = g1.append("g")
		.attr("font-family", "sans-serif")
		.attr("font-size", 10)
		.attr("text-anchor", "end")
		.selectAll("g")
		.data(keys.slice().reverse())
		.enter().append("g")
		.attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });*/
 var legend = svg.selectAll(".legend")
     		 .attr("font-family", "sans-serif")
		 .attr("font-size", 10)
		 .attr("text-anchor", "end")
      		 .data(keys.slice().reverse())
      		 .enter().append("g")
      //.attr("class", "legend")
      		 .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

  legend.append("rect")
		.attr("x", width - 19)
		.attr("width", 19)
		.attr("height", 19)
		.attr("fill", color);

  legend.append("text")
		.attr("x", width - 24)
		.attr("y", 9.5)
		.attr("dy", "0.32em")
		.text(function(d) { return d; });
		
	
rect = g1.selectAll("rect");

  d3.selectAll("input")
    .on("change", changed);

  function changed() {
    if (this.value === "stacked") transitionStep1();
    else if (this.value === "grouped") transitionStep2();
  }

  function transitionStep1() {
    rect.transition()
      .attr("y", function(d) { return y(d[1]); })
      .attr("x", function(d) { return x(d.data.city); })


      .attr("width", x.bandwidth());
  }
  
	function transitionStep2() {
    rect.transition()
	.attr("x", function(d) { 
      		return x(d.data.city) + x1(d3.select(this.parentNode).datum().key); 
    		})
     	 .attr("width", x.bandwidth() / 7)
      	 .attr("y", function(d) { return y(d[1] - d[0]); });

  }
//});
