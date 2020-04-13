/* If you're feeling fancy you can add interactivity
    to your site with Javascript */

// prints "hi" in the browser's dev tools console
console.log("hi");

const generateObj = (obj, arr, val) => {
  if (arr.length === 1) {
    if (val.includes(",")) {
      val = val.split(",");
    }
    obj[arr[0]] = val;
    return;
  }
  if (!obj[arr[0]]) {
    obj[arr[0]] = {};
  }
  const restArr = arr.splice(1);
  generateObj(obj[arr[0]], restArr, val);
};

const getData = id => {
  const genForm = document.getElementById("general_params");
  const genInputCollection = genForm.getElementsByTagName("input");
  const genInputArray = [...genInputCollection];

  const form = document.getElementById(id);
  const inputCollection = form.getElementsByTagName("input");
  const inputArray = [...inputCollection].concat(genInputArray);
  const data = {};
  inputArray.map(input => {
    const { name, value } = input;
    const splitName = name.split(".");
    generateObj(data, splitName, value);
  });
  return data;
};

const metricToggle = document.getElementById("metricToggle");
console.log(metricToggle.value);
$(function() {
  $("#metricToggle").change(function() {
    updateGraphEVSI(globalData);
    updateGraphNetEVSI(globalData, sliderPrev.value());
    updateGraphSample(globalData);
  });
});

// Set the dimensions of the canvas / graph
var margin = { top: 30, right: 20, bottom: 30, left: 50 },
  width = 600 - margin.left - margin.right,
  height = 270 - margin.top - margin.bottom;

// Set the ranges
var xEvsi = d3.scaleLinear().range([0, width]);
var yEvsi = d3.scaleLinear().range([height, 0]);
var xNet = d3.scaleLinear().range([0, width]);
var yNet = d3.scaleLinear().range([height, 0]);
var xSample = d3.scaleLinear().range([0, width]);
var ySample = d3.scaleLinear().range([height, 0]);

// Define the axes
var xAxisEvsi = d3.axisBottom(xEvsi).ticks(5);
var yAxisEvsi = d3.axisLeft(yEvsi).ticks(5);
var xAxisNet = d3.axisBottom(xNet).ticks(5);
var yAxisNet = d3.axisLeft(yNet).ticks(5);
var xAxisSample = d3.axisBottom(xSample).ticks(5);
var yAxisSample = d3.axisLeft(ySample).ticks(5);

// Define the line
var valuelineEvsi = d3
  .line()
  .x(function(d) {
    return xEvsi(d[0]);
  })
  .y(function(d) {
    return yEvsi(d[1]);
  });
var valuelineNet = d3
  .line()
  .x(function(d) {
    return xNet(d[0]);
  })
  .y(function(d) {
    return yNet(d[1]);
  });
var valuelineSample = d3
  .line()
  .x(function(d) {
    return xSample(d[0]);
  })
  .y(function(d) {
    return ySample(d[1]);
  });

// Adds the svg canvas
var svgEVSI = d3
  .select("#evsiChartHolder")
  .append("svg")
  .attr("id", "evsiChart")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// CREATE HOVER TOOLTIP WITH VERTICAL LINE //
var tooltipEvsi = d3
  .select("#evsiChartHolder")
  .append("div")
  .attr("id", "tooltipEvsi")
  .attr("class", "tooltip evsi")
  .style("position", "absolute")
  .style("padding", 6)
  .style("display", "none")
  .style("max-width", "100px");

var mouseGEVSI = svgEVSI.append("g").attr("class", "mouse-over-effects");

var svgNet = d3
  .select("#netEvsiChartHolder")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var tooltipNet = d3
  .select("#netEvsiChartHolder")
  .append("div")
  .attr("id", "tooltipNet")
  .attr("class", "tooltip net")
  .style("position", "absolute")
  .style("padding", 6)
  .style("display", "none")
  .style("max-width", "100px");

var mouseGNet = svgNet.append("g").attr("class", "mouse-over-effects");


var svgSample = d3
  .select("#sampleChartHolder")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var tooltipSample = d3
  .select("#sampleChartHolder")
  .append("div")
  .attr("id", "tooltipSample")
  .attr("class", "tooltip sample")
  .style("position", "absolute")
  .style("padding", 6)
  .style("display", "none")
  .style("max-width", "100px");

var mouseGSample = svgSample.append("g").attr("class", "mouse-over-effects");


var sliderPrev = d3
  .sliderBottom()
  .min(0)
  .max(1)
  .width(300)
  .tickFormat(d3.format(".2"))
  .ticks(5)
  .step(0.05)
  .default(0.15)
  .on("onchange", val => {
    console.log(val)
    updateGraphNetEVSI(globalData, val);
  });

var gPrev = d3
  .select("#netPrevSliderHolder")
  .append("svg")
  .attr("width", 500)
  .attr("height", 100)
  .append("g")
  .attr("transform", "translate(30,30)");

gPrev.call(sliderPrev);

var sliderPower = d3
  .sliderBottom()
  .min(0)
  .max(1)
  .width(300)
  .tickFormat(d3.format(".2"))
  .ticks(5)
  .step(0.01)
  .default(0.42)
  .on("onchange", val => {
    console.log(val)
    updatePowerLines(globalData, val);
  });

var gPower = d3
  .select("#powerSliderHolder")
  .append("svg")
  .attr("width", 500)
  .attr("height", 100)
  .append("g")
  .attr("transform", "translate(30,30)");

gPower.call(sliderPower);

var globalData;
// Get the data
d3.json(
  "https://cdn.glitch.com/962fc690-25df-458f-aee3-61c0c64cfb50%2Fdefault-response-net.json?v=1586707800546"
).then(function(defaultJson) {
  globalData = defaultJson.data.meta;
  drawGraphEVSI(globalData);
  drawGraphNetEVSI(globalData, sliderPrev.value());
  drawGraphSample(globalData);
  drawPowerLines(globalData, sliderPower.value());


  makeTipsSample(globalData);
  makeTipsEvsi(globalData);
  makeTipsNet(globalData);
});

function xEvsiMax(data) {
  return d3.max(Object.keys(data[getMetric()]), function(d) {
      return Number(d);
    })
}
function yEvsiMax(data) {
  return d3.max(Object.values(data[getMetric()]), function(d) {
      return Number(d);
    })
}

function drawGraphEVSI(data) {
  // Scale the range of the data again
  xEvsi.domain([
    0,
    xEvsiMax(data)
  ]);
  yEvsi.domain([
    0,
    yEvsiMax(data)
  ]);

  // Add the valueline path.
  svgEVSI
    .append("path")
    .datum(Object.entries(data[getMetric()]))
    .attr("class", "lineEVSI")
    .attr("d", valuelineEvsi);

  // Add the X Axis
  svgEVSI
    .append("g")
    .attr("class", "x axis evsi")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxisEvsi);

  // Add the Y Axis
  svgEVSI
    .append("g")
    .attr("class", "y axis evsi")
    .call(yAxisEvsi);
}


function xNetMax(data) {
  return d3.max(Object.keys(data[getMetric()]), function(d) {
      return Number(d);
    })
}
function yNetMax(data) {
  return d3.max(Object.values(data["net_evsi"][getMetric()][sliderPrev.value()]), function(d) {
      return Number(d);
    })
}
function drawGraphNetEVSI(data, prev) {
  prev = prev.toFixed(2);
  // Scale the range of the data again
  xNet.domain([
    0,
    xNetMax(data)
  ]);
  yNet.domain([
    0,
    yNetMax(data)
  ]);

  // Add the valueline path.

  svgNet
    .append("path")
    .datum(Object.entries(data["net_evsi"][getMetric()][prev]))
    .attr("class", "lineNetEVSI")
    .attr("d", valuelineNet);
  // Add the X Axis
  svgNet
    .append("g")
    .attr("class", "x axis net")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxisNet);

  // Add the Y Axis
  svgNet
    .append("g")
    .attr("class", "y axis net")
    .call(yAxisNet);
}

function xSampleMax(data) {
  return d3.max(Object.keys(data["optimal_study"][getMetric()]), function(d) {
      return Number(d);
    })
}
function ySampleMax(data) {
  return d3.max(Object.values(data["optimal_study"][getMetric()]), function(d) {
      return Number(d);
    })
}
function drawGraphSample(data) {
  console.log("here");
  // Scale the range of the data again
  xSample.domain([
    0,
    xSampleMax(data)
  ]);
  ySample.domain([
    0,
    ySampleMax(data)
  ]);

  // Add the valueline path.
  svgSample
    .append("path")
    .datum(Object.entries(data["optimal_study"][getMetric()]))
    .attr("class", "lineSample")
    .attr("d", valuelineSample);
  // Add the X Axis
  svgSample
    .append("g")
    .attr("class", "x axis sample")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxisSample);

  // Add the Y Axis
  svgSample
    .append("g")
    .attr("class", "y axis sample")
    .call(yAxisSample);
}

function drawPowerLines(data, event_prob) {

  svgNet
    .append("line") // vertical powerline
    .attr("class", "power-line net")
    .style("stroke", "#A9A9A9")
    .style("stroke-width", 2)

  svgSample
    .append("line") // horizontal powerline
    .attr("class", "power-line sample")
    .style("stroke", "#A9A9A9")
    .style("stroke-width", 2);

  updatePowerLines(data, event_prob);
}

function updatePowerLines(data, event_prob) {
  event_prob = event_prob.toFixed(2);
  var sampleSize = data["power_calculation"][event_prob];
  var svg = d3.select("body").transition();

  svg.select(".power-line.net")
    .attr("x1", xNet(sampleSize))
    .attr("y1", yNet(0))
    .attr("x2", xNet(sampleSize))
    .attr("y2", yNet(yNetMax(data)));

  svg.select(".power-line.sample")
    .attr("x1", xSample(0))
    .attr("y1", ySample(sampleSize))
    .attr("x2", xSample(1))
    .attr("y2", ySample(sampleSize));
}

function updateGraphEVSI(data) {
  // Scale the range of the data again
  xEvsi.domain([
    0,
    d3.max(Object.keys(data[getMetric()]), function(d) {
      return Number(d);
    })
  ]);
  yEvsi.domain([
    0,
    d3.max(Object.values(data[getMetric()]), function(d) {
      return d;
    })
  ]);

  // Select the section we want to apply our changes to
  var svgEVSI = d3.select("body").transition();

  // Make the changes
  svgEVSI
    .select(".lineEVSI") // change the line
    .duration(750)
    .attr("d", valuelineEvsi(Object.entries(data[getMetric()])));
  svgEVSI
    .select(".x.axis.evsi") // change the x axis
    .duration(750)
    .call(xAxisEvsi);
  svgEVSI
    .select(".y.axis.evsi") // change the y axis
    .duration(750)
    .call(yAxisEvsi);
  mouseGEVSI.selectAll(".mouse-per-line").data([Object.entries(data[getMetric()])]);

  mouseGEVSI.on("mousemove", function() {
    var mouse = d3.mouse(this);
    updateTooltipContentEvsi(mouse, Object.entries(globalData[getMetric()]));
  });
}

function updateGraphNetEVSI(data, prev) {
  prev = prev.toFixed(2);

  // Scale the range of the data again
  xNet.domain([
    0,
    d3.max(Object.keys(data[getMetric()]), function(d) {
      return Number(d);
    })
  ]);
  yNet.domain([
    0,
    d3.max(Object.values(data["net_evsi"][getMetric()][prev]), function(d) {
      return d;
    })
  ]);

  // Select the section we want to apply our changes to
  var svgNet = d3.select("body").transition();

  // Make the changes
  svgNet
    .select(".lineNetEVSI") // change the line
    .duration(750)
    .attr(
      "d",
      valuelineNet(Object.entries(data["net_evsi"][getMetric()][prev]))
    );
  svgNet
    .select(".x.axis.net") // change the x axis
    .duration(750)
    .call(xAxisNet);
  svgNet
    .select(".y.axis.net") // change the y axis
    .duration(750)
    .call(yAxisNet);
  mouseGNet.selectAll(".mouse-per-line").data([Object.entries(data["net_evsi"][getMetric()][prev])]);

  mouseGNet.on("mousemove", function() {
    var mouse = d3.mouse(this);
    updateTooltipContentNet(mouse, Object.entries(data["net_evsi"][getMetric()][prev]));
  });
}

function updateGraphSample(data) {
  // Scale the range of the data again
  xSample.domain([
    0,
    d3.max(Object.keys(data["optimal_study"][getMetric()]), function(d) {
      return Number(d);
    })
  ]);
  ySample.domain([
    0,
    d3.max(Object.values(data["optimal_study"][getMetric()]), function(d) {
      return d;
    })
  ]);

  // Select the section we want to apply our changes to
  var svgSample = d3.select("body").transition();

  // Make the changes
  svgSample
    .select(".lineSample") // change the line
    .duration(750)
    .attr(
      "d",
      valuelineSample(Object.entries(data["optimal_study"][getMetric()]))
    );
  svgSample
    .select(".x.axis.sample") // change the x axis
    .duration(750)
    .call(xAxisSample);
  svgSample
    .select(".y.axis.sample") // change the y axis
    .duration(750)
    .call(yAxisSample);
  mouseGSample.selectAll(".mouse-per-line").data([Object.entries(data["optimal_study"][getMetric()])]);

  mouseGSample.on("mousemove", function() {
    var mouse = d3.mouse(this);
    updateTooltipContentSample(mouse, Object.entries(data["optimal_study"][getMetric()]));
  });
}

function getMetric() {
  if (metricToggle.checked) {
    return "nmb";
  } else {
    return "qaly";
  }
}

function updateData() {
  var xmlhttp = new XMLHttpRequest(); // new HttpRequest instance
  var theUrl = "https://clinicalvoi.herokuapp.com/evsi";
  xmlhttp.open("POST", theUrl);
  xmlhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
  xmlhttp.onload = function(e) {
    if (xmlhttp.readyState === 4) {
      if (xmlhttp.status === 200) {
        loopTask(xmlhttp.responseText);
      } else {
        console.error(xmlhttp.statusText);
      }
    }
  };
  xmlhttp.onerror = function(e) {
    console.error(xmlhttp.statusText);
  };
  xmlhttp.send(JSON.stringify(getData("subpop1")));
}

function loopTask(taskId) {
  console.log(taskId);
  // trim quotes
  url = "https://clinicalvoi.herokuapp.com/tasks/" + taskId.slice(1, -2);
  console.log(url);
  var interval = setInterval(function() {
    d3.json(url, {
      method: "GET",
      mode: "cors"
    }).then(data => {
      if (data.data.meta.progress > 0) {
        globalData = data.data.meta;
        updateGraphEVSI(globalData);
        updateGraphNetEVSI(globalData, sliderPrev.value());
        updateGraphSample(globalData);
        updatePowerLines(globalData, sliderPower.value())
      }
      if (data.data.task_status == "finished") {
        clearInterval(interval);
      }
    });
  }, 3000);
}

function updateTooltipContentEvsi(mouse, data) {
  // use 'invert' to get distance from mouse position relative to svg
  var xPos = xEvsi.invert(mouse[0]);
  var bisect = d3.bisector(function(d) {
    return Number(d[0]);
  }).left; // retrieve index in data
  var idx = bisect(data, xPos);

  if (idx > 1) {
    var leftData = Number(data[idx - 1][0]);
    var rightData = Number(data[idx][0]);
    var closest =
      xPos - leftData > rightData - xPos ? data[idx] : data[idx - 1];
  } else {
    var closest = data[idx];
  }

  tooltipEvsi
    .html(
      "A study size of " +
        closest[0] +
        " has an expected value of " +
        closest[1].toFixed(2) +
        " " +
        getMetric() +
        " " +
        "per patient"
    )

    .style("left", d3.event.pageX + 20 + "px")
    .style("top", d3.event.pageY - 20 + "px")
    .style("display", "inline")
    .style("font-size", 11.5);
}

function makeTipsEvsi(data) {
  mouseGEVSI
    .append("path") // create vertical line to follow mouse
    .attr("class", "mouse-line")
    .style("stroke", "#A9A9A9")
    .style("stroke-width", 2)
    .style("opacity", "0");

  var lines = document.getElementsByClassName("line");

  var mousePerLine = mouseGEVSI
    .selectAll(".mouse-per-line")
    .data([Object.entries(data[getMetric()])])
    .enter()
    .append("g")
    .attr("class", "mouse-per-line evsi");

  mousePerLine
    .append("circle")
    .attr("r", 4)
    .style("stroke", function(d) {
      return "#A9A9A9";
    })
    .style("fill", "none")
    .style("stroke-width", 2)
    .style("opacity", "0");

  mouseGEVSI
    .append("svg:rect") // append a rect to catch mouse movements on canvas
    .attr("width", width)
    .attr("height", height)
    .attr("fill", "none")
    .attr("pointer-events", "all")
    .on("mouseout", function() {
      // on mouse out hide line, circles and text
      d3.select(".mouse-line").style("opacity", "0");
      d3.selectAll(".mouse-per-line circle").style("opacity", "0");
      d3.selectAll(".mouse-per-line text").style("opacity", "0");
      d3.selectAll(".tooltip").style("display", "none");
    })
    .on("mouseover", function() {
      // on mouse in show line, circles and text
      d3.select(".mouse-line").style("opacity", "0");
      d3.selectAll(".mouse-per-line,.evsi circle").style("opacity", "1");
      d3.selectAll(".tooltip evsi").style("display", "inline");
    })
    .on("mousemove", function() {
      // update tooltip content, line, circles and text when mouse moves
      var mouse = d3.mouse(this);
      d3.selectAll(".mouse-per-line.evsi").attr("transform", function(d, i) {
        // use 'invert' to get distance from mouse position relative to svg
        var xPos = xEvsi.invert(mouse[0]);
        var bisect = d3.bisector(function(d) {
          return Number(d[0]);
        }).left; // retrieve index in data
        var idx = bisect(d, xPos);

        if (idx > 1) {
          var leftData = Number(d[idx - 1][0]);
          var rightData = Number(d[idx][0]);
          var closest =
            xPos - leftData > rightData - xPos ? d[idx] : d[idx - 1];
        } else {
          var closest = d[idx];
        }

        d3.select(".mouse-line").attr("d", function() {
          var data = "M" + xEvsi(Number(closest[0])) + "," + height;
          data += " " + xEvsi(Number(closest[0])) + "," + 0;
          return data;
        });
        return (
          "translate(" +
          xEvsi(Number(closest[0])) +
          "," +
          yEvsi(Number(closest[1])) +
          ")"
        );
      });
      updateTooltipContentEvsi(mouse, Object.entries(data[getMetric()]));
    });
}

function updateTooltipContentNet(mouse, data) {
  // use 'invert' to get distance from mouse position relative to svg
  var xPos = xNet.invert(mouse[0]);
  var bisect = d3.bisector(function(d) {
    return Number(d[0]);
  }).left; // retrieve index in data
  var idx = bisect(data, xPos);

  if (idx > 1) {
    var leftData = Number(data[idx - 1][0]);
    var rightData = Number(data[idx][0]);
    var closest =
      xPos - leftData > rightData - xPos ? data[idx] : data[idx - 1];
  } else {
    var closest = data[idx];
  }

  tooltipNet
    .html(
      "A study size of " +
        closest[0] +
        " has a population net value of " +
        closest[1].toFixed(2) +
        " " +
        getMetric() +
        " at subpopulation prevalence " +
        sliderPrev.value().toFixed(2)
    )

    .style("left", d3.event.pageX + 20 + "px")
    .style("top", d3.event.pageY - 20 + "px")
    .style("display", "inline")
    .style("font-size", 11.5);
}

function makeTipsNet(data) {
  mouseGNet
    .append("path") // create vertical line to follow mouse
    .attr("class", "mouse-line")
    .style("stroke", "#A9A9A9")
    .style("stroke-width", 2)
    .style("opacity", "0");

  var lines = document.getElementsByClassName("line");

  var mousePerLine = mouseGNet
    .selectAll(".mouse-per-line")
    .data([Object.entries(data["net_evsi"][getMetric()][sliderPrev.value()])])
    .enter()
    .append("g")
    .attr("class", "mouse-per-line net");

  mousePerLine
    .append("circle")
    .attr("r", 4)
    .style("stroke", function(d) {
      return "#A9A9A9";
    })
    .style("fill", "none")
    .style("stroke-width", 2)
    .style("opacity", "0");

  mouseGNet
    .append("svg:rect") // append a rect to catch mouse movements on canvas
    .attr("width", width)
    .attr("height", height)
    .attr("fill", "none")
    .attr("pointer-events", "all")
    .on("mouseout", function() {
      // on mouse out hide line, circles and text
      d3.select(".mouse-line").style("opacity", "0");
      d3.selectAll(".mouse-per-line circle").style("opacity", "0");
      d3.selectAll(".mouse-per-line text").style("opacity", "0");
      d3.selectAll(".tooltip").style("display", "none");
    })
    .on("mouseover", function() {
      // on mouse in show line, circles and text
      d3.select(".mouse-line").style("opacity", "0");
      d3.selectAll(".mouse-per-line,.net circle").style("opacity", "1");
      d3.selectAll(".tooltip net").style("display", "inline");
    })
    .on("mousemove", function() {
      // update tooltip content, line, circles and text when mouse moves
      var mouse = d3.mouse(this);
      d3.selectAll(".mouse-per-line.net").attr("transform", function(d, i) {
        // use 'invert' to get distance from mouse position relative to svg
        var xPos = xNet.invert(mouse[0]);
        var bisect = d3.bisector(function(d) {
          return Number(d[0]);
        }).left; // retrieve index in data
        var idx = bisect(d, xPos);

        if (idx > 1) {
          var leftData = Number(d[idx - 1][0]);
          var rightData = Number(d[idx][0]);
          var closest =
            xPos - leftData > rightData - xPos ? d[idx] : d[idx - 1];
        } else {
          var closest = d[idx];
        }

        d3.select(".mouse-line").attr("d", function() {
          var data = "M" + xNet(Number(closest[0])) + "," + height;
          data += " " + xNet(Number(closest[0])) + "," + 0;
          return data;
        });
        return (
          "translate(" +
          xNet(Number(closest[0])) +
          "," +
          yNet(Number(closest[1])) +
          ")"
        );
      });

      updateTooltipContentNet(mouse, Object.entries(data["net_evsi"][getMetric()][sliderPrev.value()]));
    });
}

function updateTooltipContentSample(mouse, data) {
  // use 'invert' to get distance from mouse position relative to svg
  var xPos = xSample.invert(mouse[0]);
  var bisect = d3.bisector(function(d) {
    return Number(d[0]);
  }).left; // retrieve index in data
  var idx = bisect(data, xPos);

  if (idx > 1) {
    var leftData = Number(data[idx - 1][0]);
    var rightData = Number(data[idx][0]);
    var closest =
      xPos - leftData > rightData - xPos ? data[idx] : data[idx - 1];
  } else {
    var closest = data[idx];
  }

  tooltipSample
    .html(
      "A subpopulation prevalence of " +
        closest[0] +
        " corresponds to an optimal study size of " +
        closest[1]
    )

    .style("left", d3.event.pageX + 20 + "px")
    .style("top", d3.event.pageY - 20 + "px")
    .style("display", "inline")
    .style("font-size", 11.5);
}

function makeTipsSample(data) {
  mouseGSample
    .append("path") // create vertical line to follow mouse
    .attr("class", "mouse-line")
    .style("stroke", "#A9A9A9")
    .style("stroke-width", 2)
    .style("opacity", "0");

  var lines = document.getElementsByClassName("line");

  var mousePerLine = mouseGSample
    .selectAll(".mouse-per-line")
    .data([Object.entries(data["optimal_study"][getMetric()])])
    .enter()
    .append("g")
    .attr("class", "mouse-per-line sample");

  mousePerLine
    .append("circle")
    .attr("class", "sample")
    .attr("r", 4)
    .style("stroke", function(d) {
      return "#A9A9A9";
    })
    .style("fill", "none")
    .style("stroke-width", 2)
    .style("opacity", "0");

  mouseGSample
    .append("svg:rect") // append a rect to catch mouse movements on canvas
    .attr("width", width)
    .attr("height", height)
    .attr("fill", "none")
    .attr("pointer-events", "all")
    .on("mouseout", function() {
      // on mouse out hide line, circles and text
      d3.select(".mouse-line").style("opacity", "0");
      d3.selectAll(".mouse-per-line circle").style("opacity", "0");
      d3.selectAll(".mouse-per-line text").style("opacity", "0");
      d3.selectAll(".tooltip").style("display", "none");
    })
    .on("mouseover", function() {
      // on mouse in show line, circles and text
      d3.select(".mouse-line").style("opacity", "0");
      d3.selectAll(".mouse-per-line,.sample circle").style("opacity", "1");
      d3.selectAll(".tooltip sample").style("display", "inline");
    })
    .on("mousemove", function() {
      // update tooltip content, line, circles and text when mouse moves
      var mouse = d3.mouse(this);
      d3.selectAll(".mouse-per-line.sample").attr("transform", function(d, i) {
        // use 'invert' to get distance from mouse position relative to svg
        var xPos = xSample.invert(mouse[0]);
        var bisect = d3.bisector(function(d) {
          return Number(d[0]);
        }).left; // retrieve index in data
        var idx = bisect(d, xPos);

        if (idx > 1) {
          var leftData = Number(d[idx - 1][0]);
          var rightData = Number(d[idx][0]);
          var closest =
            xPos - leftData > rightData - xPos ? d[idx] : d[idx - 1];
        } else {
          var closest = d[idx];
        }

        d3.select(".mouse-line").attr("d", function() {
          var data = "M" + xSample(Number(closest[0])) + "," + height;
          data += " " + xSample(Number(closest[0])) + "," + 0;
          return data;
        });
        return (
          "translate(" +
          xSample(Number(closest[0])) +
          "," +
          ySample(Number(closest[1])) +
          ")"
        );
      });

      updateTooltipContentSample(mouse, Object.entries(data["optimal_study"][getMetric()]));
    });
}
