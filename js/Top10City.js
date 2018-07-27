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
var x1 = d3.scaleBand()
    .padding(0.05);
	
var y = d3.scaleLinear()
    .rangeRound([height, 0]);

var z = d3.scaleOrdinal()
    .range(["#98abc5", "#8a89a6", "#7b6888"]);

d3.csv("/CS498FinalTermProject-PERMAnalysis/data/top10cities.csv", function(d, i, columns) {
  for (i = 1, t = 0; i < columns.length; ++i) t += d[columns[i]] = +d[columns[i]];
  d.total = t;
  return d;
}, function(error, data) {
  if (error) throw error;

  var keys = data.columns.slice(1);

  data.sort(function(a, b) { return b.total - a.total; });
  
  x.domain(data.map(function(d) { return d.city; }));
  
  //defined for Grouped bar graph  
  x1.domain(keys).rangeRound([0, x0.bandwidth()])
  
  y.domain([0, d3.max(data, function(d) { return d.total; })]).nice();
  z.domain(keys);

  //defined for Stacked bar graph 
  g1.append("g")
	.selectAll("g")
	.data(d3.stack().keys(keys)(data))
	.enter().append("g")
	.attr("fill", function(d) { return z(d.key); })
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

  var legend = g1.append("g")
		.attr("font-family", "sans-serif")
		.attr("font-size", 10)
		.attr("text-anchor", "end")
		.selectAll("g")
		.data(keys.slice().reverse())
		.enter().append("g")
		.attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

  legend.append("rect")
		.attr("x", width - 19)
		.attr("width", 19)
		.attr("height", 19)
		.attr("fill", z);

  legend.append("text")
		.attr("x", width - 24)
		.attr("y", 9.5)
		.attr("dy", "0.32em")
		.text(function(d) { return d; });
		
	
  d3.selectAll("input").on("change", change);

  var timeout = setTimeout(function() {
    d3.select("input[value=\"stacked\"]").property("checked", true).each(change);
  }, 2000);

  function change() {
    clearTimeout(timeout);
    if (this.value === "grouped") transitiongrouped();
    else transitionStacked();
  }

  function transitiongrouped() {
    var t = svg1.transition().duration(750),
        /*g = t.selectAll(".group").attr("transform", function(d) { return "translate(0," + y0(d.key) + ")"; });
		g.selectAll("rect").attr("y", function(d) { return y1(d.value); });
		g.select(".group-label").attr("y", function(d) { return y1(d.values[0].value / 2); })*/	
		g1 = t.selectAll("g")
			.data(data)
			.enter().append("g")
			.attr("transform", function(d) { return "translate(" + x0(d.State) + ",0)"; })
			.selectAll("rect")
			.data(function(d) { return keys.map(function(key) { return {key: key, value: d[key]}; }); })
			.enter().append("rect")
			.attr("x", function(d) { return x1(d.key); })
			.attr("y", function(d) { return y(d.value); })
			.attr("width", x1.bandwidth())
			.attr("height", function(d) { return height - y(d.value); })
			.attr("fill", function(d) { return z(d.key); });
  }

  function transitionStacked() {
    var t = svg.transition().duration(750),
        /*g = t.selectAll(".group").attr("transform", "translate(0," + y0(y0.domain()[0]) + ")");
    g.selectAll("rect").attr("y", function(d) { return y1(d.value + d.valueOffset); });
    g.select(".group-label").attr("y", function(d) { return y1(d.values[0].value / 2 + d.values[0].valueOffset); })*/
	g1 = t.selectAll("g")
	.data(d3.stack().keys(keys)(data))
	.enter().append("g")
	.attr("fill", function(d) { return z(d.key); })
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
  }
});
