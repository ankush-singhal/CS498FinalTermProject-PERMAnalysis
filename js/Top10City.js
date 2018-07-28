var svg1 = d3.select("#vis1"),
    margin1 = {top: 20, right: 160, bottom: 35, left: 30},
    width1 = +svg1.attr("width") - margin1.left - margin1.right,
    height1 = +svg1.attr("height") - margin1.top - margin1.bottom,
    g1 = svg1.append("g").attr("transform", "translate(" + margin1.left + "," + margin1.top + ")");

var tooltip1 = d3.select("div#vbar_container").append("div").attr("class", "tooltip")

var x1 = d3.scaleBand()
    .rangeRound([0, width1])
    .padding(0.08);

var y1 = d3.scaleLinear()
    .range([height1, 0]);

var z = d3.scaleOrdinal()
    .range(["#9bc7e4", "#8ed07f", "#f7ae54"]);

var keys;

d3.csv("/CS498FinalTermProject-PERMAnalysis/data/top10cities.csv", function(d, i, columns) {
    for (i = 1, t = 0; i < columns.length; ++i) t += d[columns[i]] = +d[columns[i]];
    d.total = t;
    return d;
}, function(error, data) {
    if (error) throw error;

    keys = data.columns.slice(1);

    x1.domain(data.map(function(d) { return d.city; }));
    y1.domain([0, d3.max(data, function(d) { return d.total; })]).nice();
    z.domain(keys);

    var stackData = d3.stack().keys(keys)(data);
    stackData.forEach(element => {
        var keyIdx = keys.findIndex(e => e === element.key);
        element.forEach(e2 => { e2.keyIdx = keyIdx; });
    });

    g1.append("g")
    .selectAll("g")
    .data(stackData)
    .enter().append("g")
     .attr("fill", function(d) { return z(d.key); })
    .selectAll("rect")
    .data(function(d) { return d; })
    .enter().append("rect")
        .attr("x", function(d) { return x1(d.data.city); })
        .attr("y", function(d) { return y1(d[1]); })
        .attr("height", function(d) { return y1(d[0]) - y1(d[1]); })
        .attr("width", x1.bandwidth())
        //.attr("stroke", "black")
	.on("mouseover", function() { tooltip1.style("display", null); })
 	.on("mouseout", function() { tooltip1.style("display", "none"); })
  	.on("mousemove", function(d) {
		tooltip1
		.style("left", d3.event.pageX - 50 + "px")
         	.style("top", d3.event.pageY - 50 + "px")
	  	.style("display", "inline-block")
		.html("City Name: <b>"+d.data.city+"</b>"+ "<br>" + "Number of Employees: " +"<b>"+(d[1]-d[0]));    			
		});
		
	 g1.append("g")
			.attr("class", "axis")
			.attr("transform", "translate(0," + height1 + ")")
			.call(d3.axisBottom(x1))
			.selectAll("text") ;

	  g1.append("g")
			.attr("class", "axis")
			.call(d3.axisLeft(y1).ticks(null, "s"))
			.append("text")
			.attr("x", 2)
			.attr("y", y1(y1.ticks().pop()) + 0.5)
			.attr("dy", "0.32em")
			.attr("fill", "#000")
			.attr("font-weight", "bold")
			.attr("text-anchor", "start")
			.text("No. of Employees");
	
    rect = g1.selectAll("rect");
});

d3.selectAll("input")
    .on("change", changed);

function changed() {
    if (this.value === "stacked") transitionStep1();
    else if (this.value === "grouped") transitionStep2();
}

function transitionStep1() {
    rect.transition()
    .attr("y", function(d) { return y1(d[1]); })
    .attr("x", function(d) { return x1(d.data.city); })
    .attr("width", x1.bandwidth())
    .attr("stroke", "green");
}

function transitionStep2() {
    rect.transition()
    .attr("x", function(d, i) { return x1(d.data.city) + x1.bandwidth() / (keys.length+1) * d.keyIdx; })
    .attr("width", x1.bandwidth() / (keys.length+1))
    .attr("y", function(d) { return y1(d[1] - d[0]); })
    .attr("stroke", "blue");
}
