var svg1 = d3.select("#vis1"),
    margin = {top: 20, right: 20, bottom: 20, left: 20},
    width = +svg1.attr("width") - margin.left - margin.right,
    height = +svg1.attr("height") - margin.top - margin.bottom,
    g1 = svg1.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var x1 = d3.scaleBand()
    .rangeRound([0, width])
    .padding(0.08);

var y1 = d3.scaleLinear()
    .range([height, 0]);

var color = d3.scaleOrdinal()
    .range(["#7fc97f", "#beaed4", "#fdc086"]);

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
    color.domain(keys);

    var stackData = d3.stack().keys(keys)(data);
    stackData.forEach(element => {
        var keyIdx = keys.findIndex(e => e === element.key);
        element.forEach(e2 => { e2.keyIdx = keyIdx; });
    });

    g1.append("g")
    .selectAll("g")
    .data(stackData)
    .enter().append("g")
        .attr("fill", function(d) { return color(d.key); })
    .selectAll("rect")
    .data(function(d) { return d; })
    .enter().append("rect")
        .attr("x", function(d) { return x1(d.data.Year); })
        .attr("y", function(d) { return y1(d[1]); })
        .attr("height", function(d) { return y1(d[0]) - y(d[1]); })
        .attr("width", x1.bandwidth())
        .attr("stroke", "black");

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
    .attr("width", x.bandwidth())
    .attr("stroke", "green");
}

function transitionStep2() {
    rect.transition()
    .attr("x", function(d, i) { return x1(d.data.city) + x1.bandwidth() / (keys.length+1) * d.keyIdx; })
    .attr("width", x1.bandwidth() / (keys.length+1))
    .attr("y", function(d) { return y1(d[1] - d[0]); })
    .attr("stroke", "red");
}
