var svg = d3.select("div#vis1")
  .append("svg")
  .attr("preserveAspectRatio", "xMinYMin meet")
  .attr("viewBox", "0 0 960 410")
  .classed("svg-content", true);

 
var margin = {top: 20, right: 20, bottom: 140, left:70},
    width = 820,
    height = 250;
  
var tooltip = d3.select("body").append("div").attr("class", "toolTip");
var x = d3.scaleBand().rangeRound([0, width]).padding(0.2),
    y = d3.scaleLinear().rangeRound([height, 0]);
  
var colours = d3.scaleOrdinal()
    .range(["#377eb8", "#377eb8","#377eb8","#377eb8","#377eb8","#377eb8","#377eb8","#377eb8","#377eb8","#377eb8"]);
var g = svg.append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
d3.csv("/CS498FinalTermProject-PERMAnalysis/data/us_perm_visas.xlsb", function(error, data) {
      data.forEach(function(d) {
    d.case_number = +d.case_number;
	console.log(d.case_number);
    });
    x.domain(data.map(function(d) { return d.title; }));
    y.domain([0, d3.max(data, function(d) { return d.count; })]);
    g.append("g")
        .attr("class", "axis axis--x")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x))
		.selectAll("text")  
            .style("text-anchor", "end")
            .attr("dx", "-.5em")
            .attr("dy", "-.90em")
            .attr("transform", function(d) {
                return "rotate(-45)" 
                });
    g.append("g")
      	.attr("class", "axis axis--y")
      	.call(d3.axisLeft(y).ticks(5).tickFormat(function(d) { return parseInt(d / 1000) + "K"; }))
      .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", -50)
        .attr("dy", "0.71em")
        .attr("text-anchor", "center")
        .attr("fill", "#5D6971")
        .text("No of H1B Application - (K)");
        
    g.selectAll(".bar")
      	.data(data)
      .enter().append("rect")
        .attr("x", function(d) { return x(d.title); })
        .attr("y", function(d) { return y(d.count); })
        .attr("width", x.bandwidth())
        .attr("height", function(d) { return height - y(d.count); })
        .attr("fill", function(d) { return colours(d.title); })
		.on("mousemove", function(d){
            tooltip
              .style("left", d3.event.pageX - 50 + "px")
              .style("top", d3.event.pageY - 70 + "px")
              .style("display", "inline-block")
              .html((d.title) + "<br>" + "No of H1B Application: " + (d.count));
        })
    		.on("mouseout", function(d){ tooltip.style("display", "none");});
			
    g.selectAll(".text")  		
	  .data(data)
	  .enter()
	  .append("text")
	  .attr("class","label")
	  .attr("x", (function(d) { return x(d.title); }  ))
	  .attr("y", function(d) { return y(d.count) - 40; })
	  .attr("dy", ".75em")
	  .attr("fill", "#E8336D")
	  .style("font-size", "16px")
	  .text(function(d) { return d.text; });
	  
	g.selectAll("line.arrow")
        .data(data.filter(function(d) { return d.count == 6096; }))
        .enter().append("line")
            .attr("class", "arrow")
            .attr("x1", function (d) {
                return x(d.title)+x.bandwidth()/2;
            })
            .attr("x2", function (d) {
                return x(d.title)+x.bandwidth()/2;
            })
            .attr("y2", function (d) {
                return y(d.count) - 20;
            })
            .attr("y1", function (d) {
                return y(d.count);
            })
            .attr("marker-end","url(#arrow)");
			
			
    });
	
	g.append("text")
        .attr("x", (width / 2))             
        .attr("y", 0 - (margin.top/5))
        .attr("text-anchor", "middle")  
        .style("font-size", "16px") 
		.style("font-width", "bold")
        .text("Companies Vs Application Count");
