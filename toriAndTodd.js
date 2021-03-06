var margin = {top: 20, right: 90, bottom: 30, left: 50},
    width = 1800 - margin.left - margin.right,
    height = 800 - margin.top - margin.bottom;

var parseDate = d3.timeParse("%m/%d/%Y %H:%M"),
    formatDate = d3.timeParse("%b %d %H:%M");

var x = d3.scaleTime().range([0, width]),
    y = d3.scaleLinear().range([height, 0]),
    z = d3.scaleLinear().domain([1, length])
        .interpolate(d3.interpolateHcl)
        .range([d3.rgb("#1a75ff"), d3.rgb('#33cc33')]);

// The size of the cpm readings in the CSV data file.
var xStep = 5e5,
    yStep = 10;

// Static svg
var svg = d3.select("#static").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

d3.csv("StaticSensorReadings.csv", function(error, cpm) {
    if (error) throw error;

    // Coerce the CSV data to the appropriate types.
    cpm.forEach(function(d) {
        d.date = parseDate(d.date);
        d.id = +d.id;
        d.cpm = +d.cpm;
    });

    var tooltip = d3.select("#static").append("div").attr("class", "toolTip");


    // Compute the scale domains.
    x.domain(d3.extent(cpm, function(d) { return d.date; }));
    y.domain(d3.extent(cpm, function(d) { return d.cpm; }));
    z.domain([0, d3.max(cpm, function(d) { return d.id; })]);

    // Extend the x- and y-domain to fit the last cpm.
    x.domain([x.domain()[0], +x.domain()[1] + xStep]);
    y.domain([y.domain()[0], y.domain()[1] + yStep]);

    // Display the tiles for each non-zero cpm.
    svg.selectAll(".tile")
        .data(cpm)
        .enter().append("rect")
        .attr("class", "tile")
        .attr("x", function(d) { return x(d.date); })
        .attr("y", function(d) { return y(d.cpm + yStep); })
        .attr("width", x(xStep) - x(0))
        .attr("height",  y(0) - y(yStep))
        .style("fill", function(d) { return z(d.id); })
        .on("mousemove", function(d){
            tooltip
                .style("left", d3.event.pageX - 50 + "px")
                .style("top", d3.event.pageY + 20 + "px")
                .style("display", "inline-block")
                .html("Sensor-ID = " + (d.id) + "<br>" + (d.cpm) + " CPM" + "<br>" + "Timestamp: " + (d.date));
        })
        .on("mouseout", function(d){ tooltip.style("display", "none");});

    // Add a legend for the color values.
    var legend = svg.selectAll(".legend")
        .data(z.ticks(9).slice(1).reverse())
        .enter().append("g")
        .attr("class", "legend")
        .attr("transform", function(d, i) { return "translate(" + (width + 20) + "," + (20 + i * 20) + ")"; });

    legend.append("rect")
        .attr("width", 20)
        .attr("height", 20)
        .style("fill", z);

    legend.append("text")
        .attr("x", 26)
        .attr("y", 10)
        .attr("dy", ".35em")
        .text(function(d) { return d;})
    //  .text(String);

    svg.append("text")
        .attr("class", "label")
        .attr("x", width + 20)
        .attr("y", 10)
        .attr("dy", ".35em")
        .text("IDs");

    // Add an x-axis with label.
    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom().scale(x).tickFormat(d3.timeFormat("%m-%d %H:%M")));
        

    svg.append("text")
        .attr("class", "label")
        .attr("x", width)
        .attr("y", -3)
        .attr("font-size", "20px")
        .attr("text-anchor", "end")
        .text("Static Sensors Graph");

 

    // Add a y-axis with label.
    svg.append("g")
        .attr("class", "y axis")
        .call(d3.axisLeft().scale(y));
        

    svg.append("text")
        .attr("class", "label")
        .attr("y", 6)
        .attr("dy", ".71em")
        .attr("text-anchor", "end")
        .attr("transform", "rotate(-90)")
        .text("CPM");
});


// Mobile svg
var svg1 = d3.select("#mobile").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

d3.csv("MobileSensorReadings.csv", function(error, cpm) {
    if (error) throw error;

    // Coerce the CSV data to the appropriate types.
    cpm.forEach(function(d) {
        d.date = parseDate(d.date);
        d.id = +d.id;
        d.long = +d.Long;
        d.lat = +d.Lat;
        d.cpm = +d.cpm;
        d.user = +d.user;
    });

    var tooltip = d3.select("#mobile").append("div").attr("class", "toolTip");

    // Compute the scale domains.
    x.domain(d3.extent(cpm, function(d) { return d.date; }));
    y.domain(d3.extent(cpm, function(d) { return d.cpm; }));
    z.domain([0, d3.max(cpm, function(d) { return d.id; })]);

    // Extend the x- and y-domain to fit the last cpm.
    x.domain([x.domain()[0], +x.domain()[1] + xStep]);
    y.domain([y.domain()[0], y.domain()[1] + yStep]);

    // Display the tiles for each non-zero cpm.
    svg1.selectAll(".tile")
        .data(cpm)
        .enter().append("rect")
        .attr("class", "tile")
        .attr("x", function(d) { return x(d.date); })
        .attr("y", function(d) { return y(d.cpm + yStep); })
        .attr("width", x(xStep) - x(0))
        .attr("height",  y(0) - y(yStep))
        .style("fill", function(d) { return z(d.id); })
        .on("mousemove", function(d){
            tooltip
                .style("left", d3.event.pageX - 50 + "px")
                .style("top", d3.event.pageY + 20 + "px")
                .style("display", "inline-block")
                .html("Sensor-ID = " + (d.id) + "<br>" + (d.cpm) + " CPM" + "<br>" + "Timestamp: " + (d.date) + "<br>" + "Longitude: " + (d.long) + " Latitude: " + (d.lat));
        })
        .on("mouseout", function(d){ tooltip.style("display", "none");});

    // Add a legend for the color values.
    var legend = svg1.selectAll(".legend")
        .data(z.ticks(30).slice(1).reverse())
        .enter().append("g")
        .attr("class", "legend")
        .attr("transform", function(d, i) { return "translate(" + (width + 20) + "," + (20 + i * 20) + ")"; });

    legend.append("rect")
        .attr("width", 20)
        .attr("height", 20)
        .style("fill", z);

    legend.append("text")
        .attr("x", 26)
        .attr("y", 10)
        .attr("dy", ".35em")
        .text(function(d) { return d;})
    //  .text(String);

    svg1.append("text")
        .attr("class", "label")
        .attr("x", width + 20)
        .attr("y", 10)
        .attr("dy", ".35em")
        .text("IDs");

    // Add an x-axis with label.
    svg1.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom().scale(x).tickFormat(d3.timeFormat("%m-%d %H:%M")));

    svg1.append("text")
        .attr("class", "label")
        .attr("x", width)
        .attr("y", -3)
        .attr("font-size", "20px")
        .attr("text-anchor", "end")
        .text("Mobile Sensors Graph");

    // Add a y-axis with label.
    svg1.append("g")
        .attr("class", "y axis")
        .call(d3.axisLeft().scale(y));
        
    
    svg1.append("text")
        .attr("class", "label")
        .attr("y", 6)
        .attr("dy", ".71em")
        .attr("text-anchor", "end")
        .attr("transform", "rotate(-90)")
        .text("CPM");
});

createUncertainLine()
function createUncertainLine()
{
    // Color list created using: https://gka.github.io/palettes/#colors=#1147FF,#86D8FF,#FFEF67,#FF7D11,#F30000|steps=7|bez=0|coL=0
    var colors =['#1147ff','#4663ff','#5e7fff','#6f9aff','#7bb5ff','#84d1ff','#a3dbeb','#bfdfcf','#d6e3b4','#e8e897','#f8ed78','#ffe55f','#ffd050','#ffbb41','#ffa531','#ff8f20','#ff7910','#fd6b0b','#fb5a07','#f84803','#f63101','#f30000']

    var names = [' CitizenScientist', ' HSS', ' MutantX', ' MySensor', ' PeterLovesCrystals54',
        ' Bob', ' TestUnit', ' RadCurieous', ' TaxiDriver', ' AS-3', ' RichardFox', ' XrayLady', ' GermanWrinkler43', ' HiMarkHS', ' ASWillhiem', ' UncleG', ' AS-2',
        'ProfessorSievert', ' Ckimball', ' AS-1', ' NeutronsAreFreeOfCharge', ' AlwaysGlowing']


    var locations = ["Palace Hills","Old Town","Safe Town","Southwest","Downtown","Broadview","Cheddarford","Northwest","Wilson Forest","Scenic Vista",
        "Chapparal","Terrapin Springs","Pepper Mill","Easton","Weston","Southton","Oak Willow",
        "East Parton","West Parton"]


    var legend = d3.select("#legendSpace").append("svg")
        .attr("class", "legend")
        .attr("width", 100)
        .attr("height", 100)
        .selectAll("g")
        .data(['steelblue', 'red'])
        .enter()
        .append("g")
        .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

    legend.append("rect")
        .attr("width", 18)
        .attr("height", 18)
        .style("fill", function(d){return d;});

    legend.append("text")
        .data(['static', 'mobile'])
        .attr("x", 24)
        .attr("y", 9)
        .attr("dy", ".35em")
        .text(function(d){return d;});
    var legend3 = d3.select("#legendSpace3").append("svg")
        .attr("class", "legend")
        .attr("width", 200)
        .attr("height", 400)
        .selectAll("g")
        .data(colors)
        .enter()
        .append("g")
        .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

    legend3.append("rect")
        .attr("width", 18)
        .attr("height", 18)
        .style("fill", function(d){return d;});

    legend3.append("text")
        .data(names)
        .attr("x", 24)
        .attr("y", 9)
        .attr("dy", ".35em")
        .text(function(d){return d;});


    var legend2 = d3.select("#legendSpace2").append("svg")
        .attr("class", "legend")
        .attr("width", 200)
        .attr("height", 100)
        .selectAll("g")
        .data(['6,6', '2,2'])
        .enter()
        .append("g")
        .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

    legend2.append("line")
        .attr("x1", 40)
        .attr("x2", 1)
        .attr("y1", 10)
        .attr("y2", 10)
        .style("stroke-dasharray",function(d){return d;})
        .style("stroke", "black");

    legend2.append("text")
        .data(['higher uncertainty', 'lower uncertainty'])
        .attr("x", 45)
        .attr("y", 9)
        .attr("dy", ".35em")
        .text(function(d){return d;});


    locations.forEach(function(d,i)
    {
        var locationButton = document.getElementById("locationButtons");
        var newButton  = document.createElement("BUTTON");
        newButton.id=d
        if(i == 7)
        {
            locationButtons.appendChild(document.createElement("p"));
        }
        newButton.innerHTML = d;
        newButton.addEventListener("click", function(e) {
            recreateGraph(this.id)
        })
        locationButtons.appendChild(newButton);


    });


    names.forEach( function(d, i){
        var container = document.getElementById('usernames');
        var newCheckBox = document.createElement("INPUT");
        newCheckBox.type = 'checkbox';
        newCheckBox.id = d + 'box';
        newCheckBox.value = d;
        newCheckBox.innerHTML = d
        newCheckBox.addEventListener("click", function(e) {
            updateGraph(this.value)
        })



        var label = document.createElement('label')
        label.htmlFor = d + 'box';
        label.appendChild(document.createTextNode(d));

        container.appendChild(newCheckBox);
        container.appendChild(label);



    });


    document.getElementById('nbrhood').value = "Palace Hills"
    document.getElementById('nbrhood').innerHTML = "<h1>" + document.getElementById('nbrhood').value

    var margin = {top: 20, right: 20, bottom: 30, left: 40},
        width = 960 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;


    var parseDate = d3.timeParse("%Y-%m-%d %H:%M:%S"),
        formatDate = d3.timeParse("%d %H:%M");

    /*
     * value accessor - returns the value to encode for a given data object.
     * scale - maps value to a visual display encoding, such as a pixel position.
     * map function - maps from data value to display value
     * axis - sets up axis
     */
    var x =  d3.scaleTime()
        .range([0, width]);
    var y = d3.scaleLinear().range([height, 0]);

    var line = d3.line()
        .x(function(d) { return x(d.date); })
        .y(function(d) { return y(d.Value); });

    var valueline = d3.line()
        .x(function(d) { return xMap(d)})
        .y(function(d) { return yMap(d); });
// setup x
    var xValue = function(d) { return d.date;}, // data -> value
        xScale = d3.scaleTime().range([0, width]), // value -> display
        xMap = function(d) { return xScale(xValue(d));}, // data -> display
        xAxis = d3.axisBottom()
            .scale(xScale)
            .tickFormat(d3.timeFormat("%m-%d %H:%M"));

// setup y
    var yValue = function(d) { return d.Value;}, // data -> value
        yScale = d3.scaleLinear().range([height, 0]), // value -> display
        yMap = function(d) { return yScale(yValue(d));}, // data -> display
        yAxis = d3.axisLeft().scale(yScale);


// add the graph canvas to the body of the webpage
    var svg3 = d3.select("#chart").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// add the tooltip area to the webpage
    var tooltip = d3.select("#chart").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);

    recreateGraph(locations[0])

    function updateGraph(user)
    {
        var checked = document.getElementById(user+"box").checked;
        nbrhood = document.getElementById("nbrhood").value;
        if (checked != true) {
            removeLine(user);
        }
        else{
            recreateGraph(nbrhood)
        }
    }

    function removeLine(user)
    {
        d3.selectAll("circle").filter(function(d, i) {

            return d.User == user;
        }).remove();
    }

    function recreateGraph(filename)
    {
        nbrhood = document.getElementById("nbrhood").value;
        document.getElementById('nbrhood').innerHTML = "<h1>" + filename
        document.getElementById('nbrhood').value = filename

        // if (nbrhood== filename)
        // {
        //     d3.csv(('usr/' +filename+'Mobile.csv'), function(mobileData){
        //     mobileData.forEach(function(d){
        //         d.date=parseDate(d.Timestamp)
        //         d.Value = +d.Value

        // });
        // }
        d3.select("#xaxis").remove();
        d3.select("#yaxis").remove();
        d3.select("#avgMobile").remove();
        d3.select("#avgStatic").remove();

        names.forEach(
            function(d){
                var checked = document.getElementById(d+"box").checked;

                if(checked)
                    removeLine(d)
                // document.getElementById(d+"box").checked = false;
            })

        mobileAvg =0
        mobileCount = 0
        staticAvg = 0
        staticCount = 0

        d3.csv(('mobileLocations/' +filename+'Mobile.csv'), function(mobileData){
            mobileData.forEach(function(d,i){
                d.date=parseDate(d.Timestamp)
                d.Value = +d.Value
                mobileAvg += d.Value
                d.SD = +d.SD
                d.avg = mobileAvg/i

            });
            d3.csv(('staticLocations/' + filename+'Static.csv'), function(staticData){
                staticData.forEach(function(d,i){
                    d.date=parseDate(d.Timestamp)
                    d.Value = +d.Value
                    staticAvg += d.Value
                    d.avg = staticAvg/i
                });
                // don't want dots overlapping axis, so add in buffer to data domain
                if(mobileData.length == 0 && staticData.length > 0)
                {
                    xScale.domain(d3.extent(staticData, function(d) { return parseDate(d.Timestamp); }));
                    yScale.domain([d3.min(staticData, yValue)-10,d3.max(staticData, yValue)+10]);
                }
                else if(staticData.length == 0 && mobileData.length > 0)
                {
                    xScale.domain(d3.extent(mobileData, function(d) { return parseDate(d.Timestamp); }));
                    yScale.domain([d3.min(mobileData, yValue)-10,d3.max(mobileData, yValue)+10]);
                }
                else{
                    xScale.domain(d3.extent(staticData, function(d) { return parseDate(d.Timestamp); }));
                    yScale.domain([Math.min(d3.min(staticData, yValue), d3.min(mobileData, yValue))-10,
                        Math.max(d3.max(mobileData, yValue), d3.max(staticData, yValue))+10]);
                }
                d3.csv();

                // x-axis
                svg3.append("g")
                    .attr("class", "line")
                    .attr("id", "xaxis")
                    .attr("transform", "translate(0," + height + ")")
                    .call(xAxis)
                    .append("text")
                    .attr("class", "label")
                    .attr("x", width)
                    .attr("y", -6)
                    .style("text-anchor", "end")
                    .text("day hour:min");

                // y-axis
                svg3.append("g")
                    .attr("class", "line")
                    .attr("id", "yaxis")
                    .call(yAxis)
                    .append("text")
                    .attr("class", "label")
                    .attr("transform", "rotate(-90)")
                    .attr("y", 6)
                    .attr("dy", ".71em")
                    .style("text-anchor", "end")
                    .text("CMP Value");




                if(mobileData.length != 0)
                {  svg3.append("path")
                    .attr("class", "line")
                    .style("stroke-dasharray", function()
                    {
                        val = d3.sum(mobileData, function(d){return parseFloat(d.SD);})/mobileData.length

                        return(val+", 5")
                    })
                    .attr("id", "avgMobile")
                    .attr("d", valueline(mobileData))
                    .style("stroke", "red")
                    .style("stroke-width", "2px")
                    .style("fill", "none")}

                if(staticData.length != 0)
                {svg3.append("path")
                    .attr("class", "line")
                    .attr("id", "avgStatic")
                    .style("stroke-dasharray", function()
                    {
                        val = d3.sum(staticData, function(d){return parseFloat(d.SD);})/staticData.length

                        return(val+", 5")
                    })
                    .attr("d", valueline(staticData))
                    .style("stroke", "steelblue")
                    .style("stroke-width", "2px")
                    .style("fill", "none")}
                names.forEach(
                    function(dName)
                    {

                        nbrhood = document.getElementById("nbrhood").value;
                        var checked = document.getElementById(dName+"box").checked;
                        if (checked == true)
                        {
                            filename = 'usrs/' + dName.replace(" ", "")+"Agg.csv"
                            d3.csv(filename,
                                function(usrData1){
                                    usrData = usrData1.filter(function(d){
                                        return (d.Location == nbrhood);})

                                    usrData.forEach(

                                        function(d,i)
                                        {
                                            timeData = mobileData.filter(function(a) { return a.Timestamp == d.Timestamp})
                                            d.date=parseDate(d.Timestamp)
                                            d.Value = +d.Value

                                            d.uc = (Math.abs(timeData[0].Value - d.Value))/timeData[0].SD
                                        });


                                    svg3.selectAll(".dot")
                                        .data(usrData)
                                        .enter().append("circle")
                                        .attr("class", "dot")
                                        .attr("id", dName.replace(" ", ""))
                                        .attr("r", 3)
                                        .style("opacity", function(d,i)
                                        {
                                            if (d.uc > 1)
                                            {
                                                console.log(d.Timestamp)
                                                console.log(d.uc)
                                            }
                                            if (d.uc != 0)
                                                return(.9/(d.uc*2))
                                            return(.9)
                                        })
                                        .attr("cx", xMap)
                                        .attr("cy", yMap)
                                        .style("fill", function(d)
                                        {
                                            return colors[names.indexOf(dName)]
                                        })
                                        .on("mouseover", function(d) {
                                            tooltip.transition()
                                                .duration(200)
                                                .style("opacity", .9);
                                            tooltip.html(d.User + "<br/>" +formatDate(xValue(d)) + "<br/>" + yValue(d))
                                                .style("left", (d3.event.pageX + 5) + "px")
                                                .style("top", (d3.event.pageY - 28) + "px");
                                        })
                                        .on("mouseout", function(d) {
                                            tooltip.transition()
                                                .duration(500)
                                                .style("opacity", 0);
                                        });

                                    //     d3.selectAll('circle')
                                    // .attr('stdDeviation',"0");
                                    //     svg3.append("path")
                                    // .attr("class", "line")
                                    // .attr("id", dName.replace(" ", ""))
                                    // .attr("d", valueline(usrData))
                                    // .style("stroke", "black")
                                    // .style("stroke-width", "2px")
                                    // .style("fill", "none")

                                })
                        }

                    });


            });
        });
    }}

