//http://bl.ocks.org/michellechandra/0b2ce4923dc9b5809922
function updateStatic() {
    d3.json('StHimark.geojson', geojson => {
        d3.selectAll('svg').transition().style("opacity", -5).duration(500).remove();


        let width = 400, height = 400;
        let projection = d3.geoEquirectangular().scale(1).translate([0, 0]);

        let geoGenerator = d3.geoPath()
            .projection(projection);

        //Scaling and translating.
        var b = geoGenerator.bounds(geojson),
            s = .95 / Math.max((b[1][0] - b[0][0]) / width, (b[1][1] - b[0][1]) / height),
            t = [(width - s * (b[1][0] + b[0][0])) / 2, (height - s * (b[1][1] + b[0][1])) / 2];

        projection.scale(s).translate(t);

        function update(geojson) {
            var u = d3.select('#content g.map')
                .selectAll('path')
                .data(geojson.features);

            u.enter()
                .append('path')
                .attr('d', geoGenerator);
        };

        var color = d3.scaleQuantize()
            .domain([14, 18])
            .range(["#5E4FA2", "#3288BD", "#66C2A5", "#ABDDA4", "#E6F598",
                "#FFFFBF", "#FEE08B", "#FDAE61", "#F46D43", "#D53E4F", "#9E0142"]);
        var colorMobile = d3.scaleQuantize()
            .domain([9, 42])
            .range(["#5E4FA2", "#3288BD", "#66C2A5", "#ABDDA4", "#E6F598",
                "#FFFFBF", "#FEE08B", "#FDAE61", "#F46D43", "#D53E4F", "#9E0142"]);

// Append Div for tooltip to SVG
        var div = d3.select("body")
            .append("div")
            .attr("class", "tooltip")
            .style("opacity", 0);
      //  var legendText = ["worse","better"];

        var svg = d3.select("body")
            .append("svg")
            .attr("width", width)
            .attr("height", height);


            d3.csv('StaticSensorReadings.csv', function (staticSensorReadings) {
                //color.domain([0, 1, 2, 3,4,5,6,7,8,9]); // setting the range of the input data


                var sensorReading = staticSensorReadings.map(function (d) {
                    let newItem = {};
                    newItem.Timestamp = d.Timestamp;
                    newItem.Value = +d.Value;
                    newItem.id = d.id;
                    return newItem;
                })


                d3.json('StHimark.geojson', function (json) {


                    d3.csv('StaticSensorLocations.csv', function (staticSensorLocations) {
                        staticSensorLocations = staticSensorLocations.map(item => {
                            item.Lat = +item.Lat;
                            item.Long = +item.Long;
                            return item;
                        });
                        let ssLocationToIdObj = {}; //save this
                        staticSensorLocations.forEach(ssloc => {
                            let loc = getLocation(geojson, [ssloc.Long, ssloc.Lat]);
                            ssLocationToIdObj[loc] = ssloc.id;
                        });
                        let nestedBySensorId = d3.nest().key(d => d.id).entries(sensorReading);
                        let ssIdToAvgReadingValue = {}; //save this
                        nestedBySensorId.forEach(ssrow => {
                            ssIdToAvgReadingValue[ssrow.key] = d3.mean(ssrow.values.map(d => d.Value));
                        });
                        //define color here by the range of values from ssIdToAvgReadingValue
                        svg.selectAll("path")
                            .data(json.features)
                            .enter()
                            .append("path")
                            .attr("d", geoGenerator)
                            .style("stroke", "#fff")
                            .style("stroke-width", "1")
                            .on("mouseover", function (d) {

                                var value = ssIdToAvgReadingValue[ssLocationToIdObj[d.properties.Nbrhood]];
                                div.transition()
                                    .duration(200)
                                    .style("opacity", .9);
                                div.text("Average cpm:" + value)
                                    .style("left", (d3.event.pageX) + "px")
                                    .style("top", (d3.event.pageY - 28) + "px");
                            })

                            // fade out tooltip on mouse out
                            .on("mouseout", function (d) {
                                div.transition()
                                    .duration(500)
                                    .style("opacity", 0);
                            })

                            .style("fill", function (d) {

                                // Get data value
                                //console.log(ssIdToAvgReadingValue[ssLocationToIdObj[d.properties.Nbrhood]]); //save these two objects being used here (json faster)
                                // let ssIdabc = {'Broadview': "11",
                                //     Cheddarford: "14",
                                //     Downtown: "4",
                                //     'Old Town': "9",
                                // 'Palace Hills': "1",
                                // 'Safe Town': "13",
                                // 'Southwest': "6"};
                                //
                                var value = ssIdToAvgReadingValue[ssLocationToIdObj[d.properties.Nbrhood]];
                                if (value) {
                                    //If value exists…
                                    return color(value);
                                } else {
                                    //If value is undefined…
                                    return "rgb(213,222,217)";
                                }
                            });





                        svg.selectAll("circle")
                            .data(staticSensorLocations)
                            .enter()
                            .append("circle")
                            .attr("cx", function (d) {
                                return projection([d.Long, d.Lat])[0];
                            })
                            .attr("cy", function (d) {
                                return projection([d.Long, d.Lat])[1];
                            })
                            .attr("r", function (d) {
                                return Math.sqrt(d.id) * 4;
                            })
                            .style("fill", "rgb(217,91,67)")
                            .style("opacity", 0.85)

                            // Modification of custom tooltip code provided by Malcolm Maclean, "D3 Tips and Tricks"
                            // http://www.d3noob.org/2013/01/adding-tooltips-to-d3js-graph.html
                            //.data(ssIdToAvgReadingValue)
                            .on("mouseover", function (d) {
                                div.transition()
                                    .duration(200)
                                    .style("opacity", .9);
                                div.text("Sensor ID:" + d.id)
                                    .style("left", (d3.event.pageX) + "px")
                                    .style("top", (d3.event.pageY - 28) + "px");
                            })

                            // fade out tooltip on mouse out
                            .on("mouseout", function (d) {
                                div.transition()
                                    .duration(500)
                                    .style("opacity", 0);
                            })
                            .on("click", function (d) {
                                //here is where you will add the new data
                                alert("display data for the selected one.");

                            });
                    });
                    /*
    // Modified Legend Code from Mike Bostock: http://bl.ocks.org/mbostock/3888852
                    var legend = d3.select("body").append("svg")
                        .attr("class", "legend")
                        .attr("width", 140)
                        .attr("height", 200)
                        .selectAll("g")
                        .data(color.domain().slice().reverse())
                        .enter()
                        .append("g")
                        .attr("transform", function (d, i) {
                            return "translate(0," + i * 20 + ")";
                        });

                                    legend.append("rect")
                                        .attr("width", 18)
                                        .attr("height", 18)
                                        .style("fill", color);

                                    legend.append("text")
                                        .data(legendText)
                                        .attr("x", 24)
                                        .attr("y", 9)
                                        .attr("dy", ".35em")
                                        .text(function (d) {
                                            return d;
                                        });

                     */
                });
            });

    });
};
function updateMobile() {
    d3.json('StHimark.geojson', geojson => {
        d3.selectAll('svg').transition().style("opacity", -5).duration(500).remove();
        let width = 400, height = 400;
        let projection = d3.geoEquirectangular().scale(1).translate([0, 0]);

        let geoGenerator = d3.geoPath()
            .projection(projection);

        //Scaling and translating.
        var b = geoGenerator.bounds(geojson),
            s = .95 / Math.max((b[1][0] - b[0][0]) / width, (b[1][1] - b[0][1]) / height),
            t = [(width - s * (b[1][0] + b[0][0])) / 2, (height - s * (b[1][1] + b[0][1])) / 2];

        projection.scale(s).translate(t);

        function update(geojson) {
            var u = d3.select('#content g.map')
                .selectAll('path')
                .data(geojson.features);

            u.enter()
                .append('path')
                .attr('d', geoGenerator);
        };

        var color = d3.scaleQuantize()
            .domain([14, 18])
            .range(["#5E4FA2", "#3288BD", "#66C2A5", "#ABDDA4", "#E6F598",
                "#FFFFBF", "#FEE08B", "#FDAE61", "#F46D43", "#D53E4F", "#9E0142"]);



// Append Div for tooltip to SVG
        var div = d3.select("body")
            .append("div")
            .attr("class", "tooltip")
            .style("opacity", 0);
        //  var legendText = ["worse","better"];

        var svg = d3.select("body")
            .append("svg")
            .attr("width", width)
            .attr("height", height);


        d3.csv('MobileSensorReadings.csv', function (mobileSensorReadings) {
            //color.domain([0, 1, 2, 3,4,5,6,7,8,9]); // setting the range of the input data


            var sensorReading = mobileSensorReadings.map(function (d) {
                let newItem = {};
                newItem.Timestamp = d.Timestamp;
                newItem.Value = +d.Value;
                newItem.id = d.id;
                return newItem;
            })


            d3.json('StHimark.geojson', function (json) {


                d3.csv('MobileSensorReadings.csv', function (mobileSensorLocations) {
                    mobileSensorLocations = mobileSensorLocations.map(item => {
                        item.Lat = +item.Lat;
                        item.Long = +item.Long;
                        return item;
                    });


                    let ssLocationToIdObj = {Broadview: "25",
                        Chapparal: "47",
                        Cheddarford: "34",
                        Downtown: "19",
                        "East Parton": "42",
                    Easton: "40",
                    Northwest: "44",
                    "Oak Willow": "20",
                    "Old Town": "6",
                   "Palace Hills": "2",
                    "Pepper Mill": "30",
                    "Safe Town": "15",
                    "Scenic Vista": "27",
                    Southton: "35",
                    Southwest: "16",
                   "Terrapin Springs": "28",
                    "West Parton": "4",
                    Weston: "37",
                    "Wilson Forest": "26",
                    undefined: "48"}; //save this
                    /*
                    mobileSensorLocations.forEach(ssloc => {
                        let loc = getLocation(geojson, [ssloc.Long, ssloc.Lat]);
                        ssLocationToIdObj[loc] = ssloc.id;
                    });
                    */


                     //let nestedBySensorId = d3.nest().key(d => d.id).entries(sensorReading);

                    let ssIdToAvgReadingValue = {1: 29.924239558272554,
                        2: 25.356962053803713,
                        3: 21.52506118831099,
                        4: 15.10784512603569,
                        5: 10.929501068185509,
                        6: 17.238086569411394,
                        7: 11.698426199408253,
                        8: 10.427055139839728,
                        9: 10.524334945586457,
                        10: 10.710949570117535,
                        11: 10.71762436293243,
                        12: 17.52410889352782,
                        13: 16.11794324565305,
                        14: 15.823735169708112,
                        15: 15.679029673376926,
                        16: 11.83147269722546,
                        17: 32.472727272727276,
                        18: 42.59649227482739,
                        19: 22.995554769443572,
                        20: 41.52751053225871,
                        21: 33.65067445994345,
                        22: 20.299442029309958,
                        23: 13.037012444185105,
                        24: 24.198812445430907,
                        25: 27.327527345901565,
                        26: 32.13738062144106,
                        27: 23.36187224867494,
                        28: 17.018652586083217,
                        29: 14.058926830696798,
                        30: 15.864011116280322,
                        31: 15.861068824691747,
                        32: 29.852273599887912,
                        33: 30.206146157131325,
                        34: 30.301527627534412,
                        35: 30.859180229852484,
                        36: 41.277610158302004,
                        37: 18.382539410034976,
                        38: 41.62106994143837,
                        39: 41.39736629695557,
                        40: 31.437250594090482,
                        41: 32.19687934358606,
                        42: 34.34424985046407,
                        43: 34.51812144204815,
                        44: 40.075984135880155,
                        45: 39.37976817185132,
                        46: 39.82594193628893,
                        47: 39.91286138966299,
                        48: 41.7298377329391,
                        49: 41.58977480025368,
                        50: 36.05605014216043}; //save this
                    /*
                    nestedBySensorId.forEach(ssrow => {
                        ssIdToAvgReadingValue[ssrow.key] = d3.mean(ssrow.values.map(d => d.Value));
                    });

*/
                    //define color here by the range of values from ssIdToAvgReadingValue
                    var colorMobile = d3.scaleQuantize()
                        .domain([9, 42])
                        .range(["#5E4FA2", "#3288BD", "#66C2A5", "#ABDDA4", "#E6F598",
                            "#FFFFBF", "#FEE08B", "#FDAE61", "#F46D43", "#D53E4F", "#9E0142"]);
                    svg.selectAll("path")
                        .data(json.features)
                        .enter()
                        .append("path")
                        .attr("d", geoGenerator)
                        .style("stroke", "#fff")
                        .style("stroke-width", "1")
                        .on("mouseover", function (d) {
                            let ssLocationToIdObj = {Broadview: "25",
                                Chapparal: "47",
                                Cheddarford: "34",
                                Downtown: "19",
                                "East Parton": "42",
                                Easton: "40",
                                Northwest: "44",
                                "Oak Willow": "20",
                                "Old Town": "6",
                                "Palace Hills": "2",
                                "Pepper Mill": "30",
                                "Safe Town": "15",
                                "Scenic Vista": "27",
                                Southton: "35",
                                Southwest: "16",
                                "Terrapin Springs": "28",
                                "West Parton": "4",
                                Weston: "37",
                                "Wilson Forest": "26",
                                undefined: "48"};
                            let ssIdToAvgReadingValue = {1: 29.924239558272554,
                                2: 25.356962053803713,
                                3: 21.52506118831099,
                                4: 15.10784512603569,
                                5: 10.929501068185509,
                                6: 17.238086569411394,
                                7: 11.698426199408253,
                                8: 10.427055139839728,
                                9: 10.524334945586457,
                                10: 10.710949570117535,
                                11: 10.71762436293243,
                                12: 17.52410889352782,
                                13: 16.11794324565305,
                                14: 15.823735169708112,
                                15: 15.679029673376926,
                                16: 11.83147269722546,
                                17: 32.472727272727276,
                                18: 42.59649227482739,
                                19: 22.995554769443572,
                                20: 41.52751053225871,
                                21: 33.65067445994345,
                                22: 20.299442029309958,
                                23: 13.037012444185105,
                                24: 24.198812445430907,
                                25: 27.327527345901565,
                                26: 32.13738062144106,
                                27: 23.36187224867494,
                                28: 17.018652586083217,
                                29: 14.058926830696798,
                                30: 15.864011116280322,
                                31: 15.861068824691747,
                                32: 29.852273599887912,
                                33: 30.206146157131325,
                                34: 30.301527627534412,
                                35: 30.859180229852484,
                                36: 41.277610158302004,
                                37: 18.382539410034976,
                                38: 41.62106994143837,
                                39: 41.39736629695557,
                                40: 31.437250594090482,
                                41: 32.19687934358606,
                                42: 34.34424985046407,
                                43: 34.51812144204815,
                                44: 40.075984135880155,
                                45: 39.37976817185132,
                                46: 39.82594193628893,
                                47: 39.91286138966299,
                                48: 41.7298377329391,
                                49: 41.58977480025368,
                                50: 36.05605014216043};
                            var value = ssIdToAvgReadingValue[ssLocationToIdObj[d.properties.Nbrhood]];


                            div.transition()
                                .duration(200)
                                .style("opacity", .9);
                            div.text("Average cpm:" + value)
                                .style("left", (d3.event.pageX) + "px")
                                .style("top", (d3.event.pageY - 28) + "px");
                        })

                        // fade out tooltip on mouse out
                        .on("mouseout", function (d) {
                            div.transition()
                                .duration(500)
                                .style("opacity", 0);
                        })

                        .style("fill", function (d) {


                            var value = ssIdToAvgReadingValue[ssLocationToIdObj[d.properties.Nbrhood]];
                            //console.log(processedMobile);
                            //var value = processedMobile;
                            if (value) {
                                //If value exists…
                                return colorMobile(value);
                            } else {
                                //If value is undefined…
                                return "rgb(213,222,217)";
                            }
                        });



/*
                    svg.selectAll("circle")
                        .data(mobileSensorLocations)
                        .enter()
                        .append("circle")
                        .attr("cx", function (d) {
                            return projection([d.Long, d.Lat])[0];
                        })
                        .attr("cy", function (d) {
                            return projection([d.Long, d.Lat])[1];
                        })
                        .attr("r", function (d) {
                            return Math.sqrt(d.id) * 4;
                        })
                        .style("fill", "rgb(217,91,67)")
                        .style("opacity", 0.85)

                        // Modification of custom tooltip code provided by Malcolm Maclean, "D3 Tips and Tricks"
                        // http://www.d3noob.org/2013/01/adding-tooltips-to-d3js-graph.html
                        //.data(ssIdToAvgReadingValue)
                        .on("mouseover", function (d) {
                            div.transition()
                                .duration(200)
                                .style("opacity", .9);
                            div.text("Sensor ID:" + d.id)
                                .style("left", (d3.event.pageX) + "px")
                                .style("top", (d3.event.pageY - 28) + "px");
                        })

                        // fade out tooltip on mouse out
                        .on("mouseout", function (d) {
                            div.transition()
                                .duration(500)
                                .style("opacity", 0);
                        })
                        .on("click", function (d) {
                            //here is where you will add the new data
                            alert("display data for the selected one.");

                        });

 */
                });
                /*
// Modified Legend Code from Mike Bostock: http://bl.ocks.org/mbostock/3888852
                var legend = d3.select("body").append("svg")
                    .attr("class", "legend")
                    .attr("width", 140)
                    .attr("height", 200)
                    .selectAll("g")
                    .data(color.domain().slice().reverse())
                    .enter()
                    .append("g")
                    .attr("transform", function (d, i) {
                        return "translate(0," + i * 20 + ")";
                    });

                                legend.append("rect")
                                    .attr("width", 18)
                                    .attr("height", 18)
                                    .style("fill", color);

                                legend.append("text")
                                    .data(legendText)
                                    .attr("x", 24)
                                    .attr("y", 9)
                                    .attr("dy", ".35em")
                                    .text(function (d) {
                                        return d;
                                    });

                 */
            });
        });

    });
};



updateStatic('StaticSensorReadings.csv');
//updateMobile();
function getLocation(geojson, lonlat) {
    let lon = lonlat[0];
    let lat = lonlat[1];
    for (let i = 0; i < geojson.features.length; i++) {
        if (d3.geoContains(geojson.features[i], [lon, lat])) {
            return geojson.features[i].properties.Nbrhood;
        }
    }
}

function getLongLatFromStaticSensorId(staticSensorData, id) {
    let ss = staticSensorData.find(s => s.id === id);
    return [ss.Long, ss.Lat];
}
