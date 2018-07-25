var margin = {top: 20, right: 160, bottom: 35, left: 30};

var width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

var svg = d3.select("div#vis2")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom);
var g = svg.append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var tooltip = d3.select("div#vis2").append("div").attr("class", "tooltip");

var x = d3.scaleBand()
    .rangeRound([0, width])
    .paddingInner(0.05)
    .align(0.1);

var y = d3.scaleLinear()
    .rangeRound([height, 0]);

var z = d3.scaleOrdinal()
    .range(["#98abc5", "#8a89a6", "#7b6888"]);

d3.csv("/CS498FinalTermProject-PERMAnalysis/data/top10employers.csv", function(d, i, columns) {
  for (i = 1, t = 0; i < columns.length; ++i) t += d[columns[i]] = +d[columns[i]];
  d.total = t;
  return d;
}, function(error, data) {
  if (error) throw error;

  var keys = data.columns.slice(1);

  data.sort(function(a, b) { return b.total - a.total; });
  x.domain(data.map(function(d) { return d.employer; }));
  y.domain([0, d3.max(data, function(d) { return d.total; })]).nice();
  z.domain(keys);

  g.append("g")
	.selectAll("g")
	.data(d3.stack().keys(keys)(data))
	.enter().append("g")
	.attr("fill", function(d) { return z(d.key); })
	.selectAll("rect")
	.data(function(d) { return d; })
	.enter().append("rect")
	.attr("x", function(d) { return x(d.data.employer); })
	.attr("y", function(d) { return y(d[1]); })
	.attr("height", function(d) { return (y(d[0]) - y(d[1]))/1.5; })
	.attr("width", x.bandwidth())
	.on("mouseover", function() { tooltip.style("display", null); })
 	.on("mouseout", function() { tooltip.style("display", "none"); })
  	.on("mousemove", function(d) {
		var xPosition = d3.mouse(this)[0] - 15;
   		var yPosition = d3.mouse(this)[1] - 25;
	  	tooltip
		.style("left",xPosition+ "px")
                .style("top", yPosition+ "px")		
	  	.style("display", "inline-block")
		.html("Employer Name: <b>"+d.data.employer+"</b>"+ "<br>" + "Number of Employees: " +"<b>"+(d[1]-d[0]));    			
		});

  g.append("g")
		.attr("class", "axis")
		.attr("transform", "translate(0," + height + ")")
		.call(d3.axisBottom(x))
		.selectAll("text")  
          	.style("text-anchor", "end")
            	.attr("dx", "-.3em")
            	.attr("dy", "-.50em")
            	.attr("transform", function(d) {
                return "rotate(-45)" 
                });

  g.append("g")
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

  var legend = g.append("g")
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

});
