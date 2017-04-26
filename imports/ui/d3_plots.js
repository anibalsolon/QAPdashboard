import * as d3 from "./d3.js";

d3barplot = function(window, data, formatCount) {
  var bar_selector = window.d3vis.svg.selectAll("rect")
    .data(data)
  var text_selector = window.d3vis.svg.selectAll(".bar_text")
    .data(data)

  bar_selector
    .enter().append("rect")
    .attr("class", "bar")
  bar_selector
    //.transition()
    //.duration(100)
    .attr("x", function(d) {
      return window.d3vis.x(d._id);
    })
    //.attr("width", window.d3vis.x(data[0].dx) - 1)
    .attr("width", window.d3vis.width / 20 / 2 + "px") //(window.d3vis.x.range()[1] - window.d3vis.x.range()[0])/bins - 10)
    .attr("y", function(d) {
      return window.d3vis.y(d.count);
    })
    .attr("height", function(d) {
      return window.d3vis.height - window.d3vis.y(d.count);
    })
    .attr("fill", "steelblue")
    .attr("shape-rendering", "crispEdges")

  bar_selector.enter().append("text")
    .attr("dy", "1em")
    .attr("y", function(d) {
      return window.d3vis.y(d.count) - 15;
    })
    .attr("x", function(d) {
      var width = window.d3vis.width / 20 / 2
      return window.d3vis.x(d._id) + width / 2;
    })
    .attr("fill", "black")
    .attr("text-anchor", "middle")
    .text(function(d) {
      return formatCount(d.count);
    });

  text_selector.enter().append("text")
    .attr("dy", "1em")
    .attr("y", window.d3vis.height + 4)
    .attr("x", function(d) {
      var width = window.d3vis.width / 20 / 2
      return window.d3vis.x(d._id) + width / 2;
    })
    .attr("text-anchor", "middle")
    .attr("fill", "black")
    .attr("font-size", "10px")
    .text(function(d) {
      return formatCount(d._id);
    });

  var brush = d3.brushX(window.d3vis.x)
    .extent([_.min(data), _.max(data)])
    //.on("brush", brushed)
    //.on("brushend", brushend)

  var gBrush = window.d3vis.svg.append("g")
    .attr("class", "brush")
    .call(brush);

  gBrush.selectAll("rect")
    .attr("height", window.d3vis.height)
    .on("click", function(d) {
      d3.event.stopPropagation();
      console.log("clicked brush rect", d)
    })

  function brushed() {
    var extent0 = brush.extent()
    //extent1;

    //console.log(d3.event.mode)

    // if dragging, preserve the width of the extent
    if(d3.event.mode === "move") {
      //console.log("moving")
    }

    // otherwise, if resizing, round both dates
    else {
      extent1 = extent0 //.map(d3.time.day.round);
      //console.log("extending")
      // if empty when rounded, use floor & ceil instead
      /*if (extent1[0] >= extent1[1]) {
        extent1[0] = d3.time.day.floor(extent0[0]);
        extent1[1] = d3.time.day.ceil(extent0[1]);
      }*/
    }

    //d3.select(this).call(brush.extent(extent1));
  }

  function brushend() {
    var extent0 = brush.extent()

    if(extent0[1] - extent0[0]) {

      d3.selectAll(".brush").call(brush.clear());
      // var newkey = "metrics." + metric

      // var gSelector = Session.get("globalSelector")
      // if(Object.keys(gSelector).indexOf(entry_type) < 0) {
      //   gSelector[entry_type] = {}
      // }
      // gSelector[entry_type][newkey] = {
      //   $gte: extent0[0],
      //   $lte: extent0[1]
      // }
      // Session.set("globalSelector", gSelector)
      
      // var fs_and_subs = {}
      // fs_and_subs[entry_type] = gSelector[entry_type]

      // var subselect = Session.get("subjectSelector")

      // if (subselect["subject_id"]["$in"].length){
      //     fs_and_subs["subject_id"] = subselect["subject_id"]
      // }

      // var filter = get_filter(entry_type)
      // filter[newkey] = {
      //   $gte: extent0[0],
      //   $lte: extent0[1]
      // }

      // Meteor.call("get_subject_ids_from_filter", filter, function(error, result) {
      //   //console.log("result from get subject ids from filter is", result)
      //   var ss = Session.get("subjectSelector")
      //   ss["subject_id"]["$in"] = result
      //   Session.set("subjectSelector", ss)
      // })

    }

    console.log("ended brushing", extent0)
  }

};

do_d3_histogram = function(values, minval, maxval, dom_id) {

  // Defer to make sure we manipulate DOM
  _.defer(function() {
    //console.log("HELLO, ATTEMPTING TO DO TABLE!!", fs_tables)
    // Use this as a global variable
    window.d3vis = {}
    Deps.autorun(function() {
      d3.select(dom_id).selectAll("rect").data([]).exit().remove()
      d3.select(dom_id).selectAll("text").data([]).exit().remove()
      // On first run, set up the visualiation
      if(Deps.currentComputation.firstRun) {
        console.log(dom_id);
        window.d3vis.margin = { top: 15, right: 25, bottom: 15, left: 25 },
        window.d3vis.width = 900 - window.d3vis.margin.left - window.d3vis.margin.right,
        window.d3vis.height = 125 - window.d3vis.margin.top - window.d3vis.margin.bottom;

        window.d3vis.x = d3.scaleLinear()
          .range([0, window.d3vis.width]);

        window.d3vis.y = d3.scaleLinear()
          .range([window.d3vis.height, 0]);

        window.d3vis.color = d3.schemeCategory10;

        window.d3vis.svg = d3.select(dom_id)
          .attr("width", window.d3vis.width + window.d3vis.margin.left + window.d3vis.margin.right)
          .attr("height", window.d3vis.height + window.d3vis.margin.top + window.d3vis.margin.bottom)
          .append("g")
          .attr("class", "wrapper")
          .attr("transform", "translate(" + window.d3vis.margin.left + "," + window.d3vis.margin.top + ")");

        window.d3vis.xAxis = d3.axisBottom(window.d3vis.x);
          // .scale(window.d3vis.x)
          // .orient("bottom")
        //                      .tickFormat(d3.format(",.0f"))

        window.d3vis.svg.append("g")
          .attr("class", "x axis")
          .attr("transform", "translate(0," + window.d3vis.height + ")")
        //     .call(window.d3vis.xAxis);
      }

      window.d3vis.x.domain([minval, maxval]);

      window.d3vis.y.domain([0, d3.max(values, function(d) { return d.count; })]);

      var formatCount = d3.format(",.0f");
      d3barplot(window, values, formatCount)

    });
  })
};