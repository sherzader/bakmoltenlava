const data = dataArray.map(data => {
    return { month: data.month, price: data.averagePrice };
});
console.log(data);

const margin = { top: 20, right: 20, bottom: 30, left: 50 };
const height = 500;
const width = 700;

const xScale = d3
    .scalePoint()
    .domain(data.map(d => d.month))
    .range([0, width]);

const yScale = d3
    .scaleLinear()
    .domain(
        d3.extent(data, function(d) {
            return d.price;
        })
    )
    .rangeRound([height, 0]);

const line = d3
    .line()
    .x(function(d) {
        return xScale(d.month);
    })
    .y(function(d) {
        return yScale(d.price);
    })
    .curve(d3.curveCardinal);

const xPoints = data.map(d => xScale(d.month));

const svg = d3
    .select(".line-chart__container")
    .append("svg")
    .attr("class", "line-chart")
    .attr("width", width)
    .attr("height", height);

const g = svg
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

g.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(xScale));

g.append("g")
    .call(d3.axisLeft(yScale).ticks(6))
    .append("text")
    .attr("fill", "#000")
    .attr("transform", "rotate(-90)")
    .attr("y", 6)
    .attr("dy", "0.71em")
    .attr("text-anchor", "end")
    .text("Price ($)");

g.append("path")
    .datum(data)
    .attr("class", "line")
    .attr("fill", "none")
    .attr("stroke", "#078CEA")
    .attr("stroke-width", 1.5)
    .attr("stroke-linejoin", "round")
    .attr("stroke-linecap", "round")
    .attr("d", line);

g.selectAll("circle")
    .data(data)
    .enter()
    .append("circle")
    .attr("fill", "#078CEA")
    .attr("cx", function(d) {
        return xScale(d.month);
    })
    .attr("cy", function(d) {
        return yScale(d.price);
    })
    .attr("r", 4);

const focus = g
    .append("g")
    .attr("class", "focus")
    .style("display", "none");

focus
    .append("line")
    .attr("class", "x-hover-line hover-line")
    .attr("y1", 0)
    .attr("y2", height);

focus
    .append("line")
    .attr("class", "y-hover-line hover-line")
    .attr("x1", width)
    .attr("x2", width);

focus.append("circle").attr("r", 7.5);

const tooltip = d3
    .select(".line-chart__container")
    .append("div")
    .attr("class", "tooltip");

svg.append("rect")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
    .attr("class", "overlay")
    .attr("width", width)
    .attr("height", height)
    .on("mouseover", function() {
        focus.style("display", null);
        tooltip.style("display", null);
    })
    .on("mouseout", function() {
        focus.style("display", "none");
        tooltip.style("display", "none");
    })
    .on("mousemove", mousemove);

function mousemove(monthIdx) {
    let i = 0;
    let d = null;
    if (monthIdx !== undefined) {
        // came from time slider
        focus.style("display", null);
        i = monthIdx;
    } else {
        // came from mouse hover
        // remove this invert
        const x = d3.mouse(this)[0]; // x point in pixels
        // bisector will find the closest point in dataset given the mouse point
        i = d3.bisector(d => d).left(xPoints, x); // month idx in data
    }
    d = data[i];
    focus.attr(
        "transform",
        "translate(" + xScale(d.month) + "," + yScale(d.price) + ")"
    );
    focus.select(".x-hover-line").attr("y2", height - yScale(d.price));
    focus.select(".y-hover-line").attr("x2", width + width);
    tooltip
        .html(`${d.month} $${d.price}`)
        .style("visibility", "visible")
        .style("top", yScale(d.price) + 40 + "px")
        .style("left", xScale(d.month) + "px");
}
