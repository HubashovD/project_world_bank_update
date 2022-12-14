// initialize the bargraph


var bar_margin = { top: 10, right: 50, bottom: 20, left: 100 },
    bar_width = d3.select("#barBlock").node().getBoundingClientRect().width - bar_margin.left - bar_margin.right,
    bar_height = d3.select("#barBlock").node().getBoundingClientRect().height - bar_margin.top - bar_margin.bottom;

var bar_svg = d3.select("#barBlock")
    .append("svg")
    .attr("width", bar_width + bar_margin.left + bar_margin.right)
    .attr("height", bar_height + bar_margin.top + bar_margin.bottom)
    .append("g")
    .attr("transform",
        "translate(" + bar_margin.left + "," + bar_margin.top + ")");

var bar_y = d3.scaleBand()
    .range([0, bar_height])
    .padding(0.2);

var bar_xAxis = bar_svg.append("g")
    .attr("transform", "translate(0," + bar_height + ")")

// Initialize the Y axis
var bar_x = d3.scaleLinear()
    .range([0, bar_width])


var bar_yAxis = bar_svg.append("g")
    .attr("class", "myYaxis")

bar_yAxis.call(d3.axisLeft(bar_y))


// scatter initialize

// set the dimensions and margins of the graph
var scatter_margin = { top: 10, right: 30, bottom: 50, left: 60 },
    scatter_width = d3.select("#scatterBlock").node().getBoundingClientRect().width - scatter_margin.left - scatter_margin.right,
    scatter_height = d3.select("#scatterBlock").node().getBoundingClientRect().height - scatter_margin.top - scatter_margin.bottom;

// append the svg object to the body of the page
var scatter_svg = d3.select("#scatterBlock")
    .append("svg")
    .attr("width", scatter_width + scatter_margin.left + scatter_margin.right)
    .attr("height", scatter_height + scatter_margin.top + scatter_margin.bottom)
    .append("g")
    .attr("transform",
        "translate(" + scatter_margin.left + "," + scatter_margin.top + ")");


function retrieve_data(value) {

    function download_data(value) {
        var list = document.getElementById('lineBlockWrapper')
        try {
            while (list.firstChild) {
                list.removeChild(list.lastChild);
            }
        } catch {}

        il = document.createElement('div');
        il.id = 'lineBlock'
        list.appendChild(il)


        var year = new Date().getFullYear()

        var countries = ['AFG', 'BHR', 'DZA', 'COM', 'DJI', 'EGY', 'ERI', 'ETH', 'IRN', 'IRQ', 'ISR', 'JOR', 'KWT', 'LBN', 'LBY', 'MRT', 'MAR', 'OMN', 'PAK', 'QAT',
            "SAU", "SOM", "SSD", "SDN", "SYR", "TUN", "TUR", "ARE", "YEM", "ARB", "BMN", "WLD", "ARB", "LIC", "LMC", "MIC", "UMC", "HIC", "OED", "EAS", "EUU", "CHN", 'USA'
        ]

        var menaCountriesCodes = ['AFG', 'BHR', 'DZA', 'COM', 'DJI', 'EGY', 'ERI', 'ETH', 'IRN', 'IRQ', 'ISR', 'JOR', 'KWT', 'LBN', 'LBY', 'MRT', 'MAR', 'OMN', 'PAK', 'QAT',
            "SAU", "SOM", "SSD", "SDN", "SYR", "TUN", "TUR", "ARE", "YEM", "ARB"
        ]

        var menaCountriesNames = []

        var countries_2 = 'AFG;BHR;DZA;COM;DJI;EGY;ERI;ETH;IRN;IRQ;ISR;JOR;KWT;LBN;LBY;MRT;MAR;OMN;PAK;QAT;SAU;SOM;SSD;SDN;SYR;TUN;TUR;ARE;YEM;ARB;BMN;WLD;ARB;LIC;LMC;MIC;UMC;HIC;OED;EAS;EUU;CHN;USA'

        var url = "https://api.worldbank.org/v2/country/" + countries_2 + "/indicator/" + value + "?source=2&format=json&per_page=1&date=1900:" + year

        d3.json(url, function(data) {

            var url2 = "https://api.worldbank.org/v2/country/" + countries_2 + "/indicator/" + value + "?source=2&format=json&per_page=" + data[0].total + "&date=1900:" + year
                // console.log(url2)
            d3.json(url2, function(data) {


                countries = []
                cleanData = []
                filterCountries = []
                data[1].forEach(function(entry) {
                    if (entry.value != null) {
                        cleanData.push(entry)

                        if (filterCountries.includes(entry.country.value)) {} else {
                            filterCountries.push(entry.country.value)
                            if (entry.country.value == 'High income') {
                                countries.push({
                                    name: entry.country.value,
                                    id: "HIC"
                                })
                            } else if (entry.country.value == 'Low income') {
                                countries.push({
                                    name: entry.country.value,
                                    id: "LIC"
                                })
                            } else if (entry.country.value == 'Lower middle income') {
                                countries.push({
                                    name: entry.country.value,
                                    id: "LMC"
                                })
                            } else if (entry.country.value == 'Upper middle income') {
                                countries.push({
                                    name: entry.country.value,
                                    id: "UMC"
                                })
                            } else {
                                countries.push({
                                    name: entry.country.value,
                                    id: entry.countryiso3code
                                })
                            }
                        }

                        if (menaCountriesCodes.includes(entry.countryiso3code)) {
                            if (menaCountriesNames.includes(entry.country.value)) {} else { menaCountriesNames.push(entry.country.value) }
                        } else {}
                    } else {}

                })

                var list = document.getElementById('countriesSelector')
                try {
                    while (list.firstChild) {
                        list.removeChild(list.lastChild);
                    }
                } catch {}

                countries.forEach(element => {
                    dv = document.createElement('div');
                    opt = document.createElement('input');
                    lab = document.createElement('label');
                    opt.innerHTML = element.name
                    opt.value = element.id
                    opt.classList.add('custom-checkbox')
                    if (menaCountriesNames.includes(element.name)) {
                        opt.classList.add('menaCountry')
                        opt.checked = true
                    } else {}
                    opt.type = "checkbox"
                    opt.name = "ck"
                    element.name = element.name.replace(',', '')
                    element.name = element.name.replace('.', '')
                    element.name = element.name.replace(/\s/g, '')
                    opt.id = element.id
                    lab.for = element.name
                    lab.innerHTML = element.name
                    list.appendChild(dv)
                    dv.appendChild(lab)
                    dv.appendChild(opt)
                });




                var line_margin = { top: 30, right: 30, bottom: 40, left: 30 },
                    line_width = d3.select("#lineBlock").node().getBoundingClientRect().width - line_margin.left - line_margin.right,
                    line_height = d3.select("#lineBlock").node().getBoundingClientRect().height - line_margin.top - line_margin.bottom;

                var line_svg = d3.select("#lineBlock")
                    .append("svg")
                    .attr("width", line_width + line_margin.left + line_margin.right)
                    .attr("height", line_height + line_margin.top + line_margin.bottom)
                    .append("g")
                    .attr("transform",
                        "translate(" + line_margin.left + "," + line_margin.top + ")");


                year_now = new Date().getFullYear()
                year_now = +year_now

                var unique_years = []

                var yearsList = []

                cleanData.forEach((d) => {

                    if (unique_years.includes(d.date)) {

                    } else { unique_years.push(d.date) }
                })

                var list = document.getElementById('yearSelectorBlock')
                try {
                    while (list.firstChild) {
                        list.removeChild(list.lastChild);
                    }
                } catch {}
                il = document.createElement('div');
                il.id = 'yearsSelector'
                list.appendChild(il)

                unique_years.sort((a, b) => b - a).forEach((d) => {
                    if (yearsList.includes(d)) {

                    } else {
                        singleYear = []
                        singleYear.push(d)
                        singleYear.push(d)
                        yearsList.push(singleYear)
                    }
                })

                yearsSelector = new CustomSelect('#yearsSelector', {
                    name: yearsList[0][1],
                    targetValue: yearsList[0][0],
                    options: yearsList,
                })

                var line_x = d3.scaleBand()
                    .domain(d3.extent(unique_years, function(d) {
                        date = d3.timeParse("%Y")(d)
                        return date.getFullYear();
                    }))
                    .range([0, line_width])

                line_svg.append("g")
                    .attr("class", "myXaxis")
                    .attr("transform", "translate(0," + line_height + ")")
                    .call(d3.axisBottom(line_x).ticks(window.innerWidth / 150))



                var line_y = d3.scaleLinear()
                    .domain([0, d3.max([0, 100], function(d) { return +d; })])
                    .range([line_height, 0]);

                line_y_axis = line_svg.append("g")
                    .attr("class", "myYaxis")
                    .call(d3.axisLeft(line_y));

                var f = d3.format(".2s")


                explainer = line_svg.append('text')

                explainer
                    .text('Hover mouse on the line to the diving in the data ')
                    .attr("x", 0)
                    .attr("y", -15)
                    .style('font', '14px')
                    .style('color', '#444444')
                    .style("font-family", "'Montserrat', sans-serif")





                function filterData(data) {
                    // console.log('filterData(data)')

                    countries_selected = []
                    countries.forEach(function(d) {
                        var cbb = document.querySelector('#' + d.id);
                        if (cbb.checked == true) {
                            countries_selected.push(cbb.value)
                        } else {
                            countries_selected.filter((n) => { return n != cbb.value.toString() })
                        }
                    })


                    var filteredData = data.filter(function(elem) {
                        if (countries_selected.includes(elem.countryiso3code)) {
                            return elem
                        } else {}
                    })

                    data = filteredData

                    var color = d3.scaleOrdinal()
                        .domain(data)
                        .range(['#e41a1c',
                            "#BE6E61",
                            '#377eb8',
                            "#BEB461",
                            "#6179BE",
                            '#4daf4a',
                            '#984ea3',
                            "#B861BE",
                            '#ff7f00',
                            '#ffff33',
                            '#a65628',
                            '#f781bf',
                            '#999999',
                            "#a6cee3",
                            "#1f78b4",
                            "#b2df8a",
                            "#33a02c",
                            "#7361BE",
                            "#fb9a99",
                            '#2CA568',
                            '#30A868',
                            '#34AA67',
                            '#38AD67',
                            "#e31a1c",
                            "#fdbf6f",
                            "#ff7f00",
                            "#cab2d6",
                            "#6a3d9a",
                            "#BE619A",
                            "#ffff99",
                            "#b15928",
                            '#094F68'
                        ])

                    var circles = line_svg.selectAll("circle")

                    circles
                        .remove()


                    var linepath = d3.line()
                        .x(function(d) {
                            return line_x(d.date);
                        })
                        .y(function(d) { return line_y(d.value); });


                    var sumstat = d3.nest() // nest function allows to group the calculation per level of a factor
                        .key(function(d) {
                            return d.country.value;
                        })
                        .entries(data);


                    var arr = []
                    data.forEach(function(d) {
                        arr.push(+d.value)
                    })


                    function domainRes(arr) {
                        if (d3.min(arr) > 0) {
                            return [0, d3.max(arr)]
                        } else {
                            return [d3.min(arr), d3.max(arr)]
                        }
                    }

                    domainResult = domainRes(arr)


                    var line_y = d3.scaleLinear()
                        .domain(domainResult)
                        .range([line_height, 0]);

                    var line_x = d3.scaleBand()
                        .domain(unique_years.sort(d3.ascending))
                        .range([0, line_width]);

                    var LineyAxis = d3.axisLeft(line_y)


                    line_y_axis = line_svg.selectAll(".myYaxis")
                        .transition()
                        .duration(500)
                        .call(LineyAxis)

                    line_y_axis
                        .selectAll("text")
                        .style('font', '10px')
                        .style('color', '#444444')
                        .style("font-family", "'Montserrat', sans-serif")
                        .text(function(d) {
                            if (d < 1.0) {
                                return d
                            } else {
                                return f(+d)
                            }

                        })

                    LineyAxis.tickFormat(function(d) {
                        return f(d)
                    });

                    lineXaxis = line_svg.selectAll(".myXaxis")
                        .transition()
                        .duration(500)
                        .call(d3.axisBottom(line_x));


                    lineXaxis
                        .selectAll("text")
                        .style("text-anchor", "end")
                        .attr("dx", "-.8em")
                        .attr("dy", ".15em")
                        .attr("transform", "rotate(-80)")
                        .style('font', '14px')
                        .style('color', '#444444')
                        .style("font-family", "'Montserrat', sans-serif")




                    line_svg.selectAll(".group")
                        .remove();



                    var line_group = line_svg.selectAll(".group")
                        .data(sumstat)
                        .enter()
                        .append("g")
                        .attr("class", "group");


                    line_group.append("path")
                        .attr("class", function(d) {
                            keyForClass = d.key.replace(/\s/g, "")
                            keyForClass = keyForClass.replace(",", "")
                            keyForClass = keyForClass.replace(".", "")
                            keyForClass = keyForClass.replace("(", "")
                            keyForClass = keyForClass.replace(")", "")
                            return keyForClass + "Hover hoveredGroup line"
                        })
                        .transition()
                        .duration(500)
                        .attr("d", function(d) {
                            // console.log(d)
                            return linepath(d.values);
                        })
                        .attr("fill", "none")
                        .style("stroke", function(d) {
                            return color(d.key);
                        })
                        .style("stroke-width", "2px")


                    var tooltip = d3.select("#lineBlock")
                        .append("div")
                        .data(data)
                        .style("opacity", 0)
                        .attr("class", "tooltip")
                        .style("background-color", "white")
                        .style("border", "solid")
                        .style("border-width", "1px")
                        .style("border-radius", "5px")
                        .style("padding", "10px")
                        .style("color", "#444444")
                        .style('font', '14px')
                        .style("font-family", "'Montserrat', sans-serif")



                    var circles = line_svg.append('g')
                        .selectAll("dot")
                        .data(data)
                        .enter()
                        .append("circle")
                        .attr("class", function(d) {
                            // console.log(d)
                            keyForClass = d.country.value.replace(/\s/g, "")
                            keyForClass = keyForClass.replace(",", "")
                            keyForClass = keyForClass.replace(".", "")
                            keyForClass = keyForClass.replace("(", "")
                            keyForClass = keyForClass.replace(")", "")
                            return "cl" + d.date + " circle " + keyForClass + "Hover"
                        })
                        .attr("cx", function(d) { return line_x(d.date); })
                        .attr("cy", function(d) { return line_y(d.value); })
                        .attr("r", 2)
                        .style("fill", function(d) {
                            return color(d.country.value);
                        })
                        .style('r', "5px")
                        .style("opacity", 1)
                        .on("mouseover", mouseover)
                        .on("mousemove", mousemove)
                        .on("mouseleave", mouseleave)

                    var vLines = line_svg.selectAll("rect")
                        .data(unique_years)


                    vLines
                        .enter()
                        .append("rect")
                        .merge(vLines)
                        .transition(1) // and apply changes to all of them
                        .duration(1)
                        .attr("class", function(d) {
                            return "cl" + d
                        })
                        .attr('x', function(d) {
                            return line_x(d) - (line_width / unique_years.length) / 2
                        })
                        .attr('y', 0)
                        .attr('width', function() {
                            return line_width / unique_years.length
                        })
                        .attr('height', line_height)
                        .style("stroke", "red")
                        .style("opacity", 0)
                        .style("fill", "Gray")
                        .style('fill-opacity', 0)

                    vLines
                        .exit()
                        .remove()


                    var mouseover = function(d) {
                        vLines
                            .style("opacity", 0)

                        text = []
                    }

                    var mousemove = function(d) {

                        vLines
                            .style("opacity", 0)

                        text = []
                        barData = []


                        tooltip
                            .style("opacity", 1)
                            .style("left", (d3.mouse(this)[0] + 50) + "px") // It is important to put the +90: other wise the tooltip is exactly where the point is an it creates a weird effect
                            .style("top", (d3.mouse(this)[1]) + "px")
                            .html(function() {
                                var selected = d3.selectAll(".cl" + d)
                                selected._groups.forEach(nodeList => {
                                    nodeList.forEach(d => {
                                        if (d.nodeName == "circle") {
                                            barData.push({
                                                country: d.__data__.country.value,
                                                value: d.__data__.value,
                                                year: d.__data__.date
                                            })

                                            if (d.__data__.value < 1.0 && d.__data__.value > 0) {
                                                var val = +d.__data__.value
                                            } else {
                                                var val = f(+d.__data__.value)
                                            }

                                            text.push({
                                                country: d.__data__.country.value,
                                                value: val,
                                                year: d.__data__.date
                                            })
                                        } else {}
                                    })
                                })
                                string = ""
                                text.forEach(elem => {
                                    string = string + elem.country + " " + elem.value + "<br>"
                                })
                                return "<b>Year: " + d + "</b><br>" + string
                            })
                    }

                    var mouseleave = function(d) {

                        tooltip
                            .transition()
                            .duration(200)
                            .style("opacity", 0)
                    }
                    var vLines = line_svg.selectAll("rect")
                    vLines
                        .on("mouseover", mouseover)
                        .on("mousemove", mousemove)
                        .on("mouseleave", mouseleave)





                    function exportToCsv(filename, rows) {
                        var processRow = function(row) {
                            var finalVal = '';
                            for (var j = 0; j < row.length; j++) {
                                var innerValue = row[j] === null ? '' : row[j].toString();
                                if (row[j] instanceof Date) {
                                    innerValue = row[j].toLocaleString();
                                };
                                var result = innerValue.replace(/"/g, '""');
                                if (result.search(/("|,|\n)/g) >= 0)
                                    result = '"' + result + '"';
                                if (j > 0)
                                    finalVal += ',';
                                finalVal += result;
                            }
                            return finalVal + '\n';
                        };

                        var csvFile = '';
                        for (var i = 0; i < rows.length; i++) {
                            csvFile += processRow(rows[i]);
                        }

                        var blob = new Blob([csvFile], { type: 'text/csv;charset=utf-8;' });
                        if (navigator.msSaveBlob) { // IE 10+
                            navigator.msSaveBlob(blob, filename);
                        } else {
                            var link = document.createElement("a");
                            if (link.download !== undefined) { // feature detection
                                // Browsers that support HTML5 download attribute
                                var url = URL.createObjectURL(blob);
                                link.setAttribute("href", url);
                                link.setAttribute("download", filename);
                                link.style.visibility = 'hidden';
                                document.body.appendChild(link);
                                link.click();
                                document.body.removeChild(link);
                            }
                        }
                    }





                    dataForDownload = []
                    head = []
                        // console.log(data)

                    try {
                        for (const [key, value] of Object.entries(data[0])) {
                            if (key == 'indicator') {
                                for (const [k, v] of Object.entries(value)) {
                                    if (k == 'id') {
                                        head.push("indicator_code")
                                    } else if (k == 'value') {
                                        head.push("indicator_name")
                                    } else {}

                                }
                            } else if (key == 'country') {
                                for (const [k, v] of Object.entries(value)) {
                                    if (k == 'id') {
                                        head.push("country_code")
                                    } else if (k == 'value') {
                                        head.push("country_name")
                                    } else {}
                                }
                            } else {
                                head.push(key)
                            }
                        }

                        dataForDownload.push(head)
                        data.forEach((elem) => {
                            row = []
                            for (const [key, value] of Object.entries(elem)) {
                                if (key == 'indicator') {
                                    row.push(value.id)
                                    row.push(value.value)
                                } else if (key == 'country') {
                                    row.push(value.id)
                                    row.push(value.value)
                                } else {
                                    row.push(value)
                                }
                            }
                            dataForDownload.push(row)
                        })

                    } catch {}


                    var downloadButtonDiv = document.getElementById("downloadButtonDiv");

                    try {
                        while (downloadButtonDiv.firstChild) {
                            downloadButtonDiv.removeChild(downloadButtonDiv.lastChild);
                        }
                    } catch {}

                    downloadButton = document.createElement('input');
                    downloadButton.type = "button"
                    downloadButton.value = "Download data"
                    downloadButton.id = "downloadButton"
                    downloadButtonDiv.appendChild(downloadButton)


                    parentIndicator = document.querySelector('#indicatorsSelector')
                    const btn9 = parentIndicator.querySelector('.select__toggle');
                    // console.log(`?????????????????? ????????????????: ${btn9.innerHTML}`);
                    csvName = btn9.innerHTML


                    var listener = function() {
                        exportToCsv(csvName.slice(0, 150), dataForDownload)
                    }

                    downloadButton.addEventListener('click', listener)





                    legend_block = document.getElementById('legend_block')

                    try {
                        while (legend_block.firstChild) {
                            legend_block.removeChild(legend_block.lastChild);
                        }
                    } catch {}

                    sumstat.forEach(country => {
                        legendElement = document.createElement('div');
                        colorSquare = document.createElement('div');
                        legendText = document.createElement('p');
                        legendText.innerHTML = country.key
                        keyForClass = country.key.replace(/\s/g, "")
                        keyForClass = keyForClass.replace(",", "")
                        keyForClass = keyForClass.replace(".", "")
                        keyForClass = keyForClass.replace("(", "")
                        keyForClass = keyForClass.replace(")", "")
                            // legendElement.classList.add(keyForClass + "Hover");
                            // legendElement.classList.add("hoveredGroup")
                        colorSquare.classList.add(keyForClass + "Hover");
                        colorSquare.classList.add("hoveredGroup")
                        legendText.classList.add(keyForClass + "Hover");
                        legendText.classList.add("hoveredGroup")
                        colorSquare.style.cssText = "height: 10px; width: 10px; background-color:" + color(country.key)
                        legendElement.style.cssText = "display: grid; grid-template-columns: 1fr 95%; align-items: center; height: 12px;"
                        legend_block.appendChild(legendElement)
                        legendElement.appendChild(colorSquare)
                        legendElement.appendChild(legendText)

                    })

                    // console.log(sumstat)

                    // sumstat.forEach(country => {
                    //     keyForClass = country.key.replace(/\s/g, "")
                    //     keyForClass = keyForClass.replace(",", "")
                    //     keyForClass = keyForClass.replace(".", "")
                    //     keyForClass = keyForClass.replace("(", "")
                    //     keyForClass = keyForClass.replace(")", "")
                    //     console.log(keyForClass)
                    //     elems = document.getElementsByClassName(keyForClass + "Hover")
                    //     console.log(elems[1])
                    //     elems[2].addEventListener('mouseover', (event) => {
                    //         console.log(event.target.classList[0])
                    //         hoveredGroup = document.getElementsByClassName("hoveredGroup")
                    //         for (var y = 0; y < hoveredGroup.length; y++) {
                    //             hoveredGroup[y].style.opacity = "0.1"
                    //         }
                    //         targetGroup = document.getElementsByClassName(event.target.classList[0])
                    //         console.log(targetGroup)
                    //         for (var f = 0; f < hoveredGroup.length; f++) {
                    //             console.log(targetGroup)
                    //             targetGroup[f].style.opacity = "1"
                    //         }
                    //     })

                    //     elems[1].addEventListener('mouseleave', (event) => {
                    //         hoveredGroup = document.getElementsByClassName("hoveredGroup")
                    //         for (var x = 0; x < hoveredGroup.length; x++) {
                    //             hoveredGroup[x].style.opacity = "1"
                    //         }
                    //     })

                    // })



                }
                filterData(cleanData)
                var f = d3.format(".2s")

                function drawMap(data) {



                    var parent = document.querySelector('#yearsSelector')
                        // console.log(parent)
                    const btn = parent.querySelector('.select__toggle')
                    year = btn.value
                        // console.log(`?????????????????? ????????????????: ${btn.value}`)

                    var yearPlaceholder = document.getElementById('yearPlaceholder')
                    try {
                        while (yearPlaceholder.firstChild) {
                            yearPlaceholder.removeChild(yearPlaceholder.lastChild);
                        }
                    } catch {}

                    yearText = document.createElement('h3');
                    yearText.innerHTML = year
                    yearPlaceholder.appendChild(yearText)


                    // console.log(year)

                    countries_selected = []
                    countries.forEach(function(d) {
                        var cbb = document.querySelector('#' + d.id);
                        if (cbb.checked == true) {
                            countries_selected.push(cbb.value)
                                // console.log(countries_selected)
                        } else {
                            countries_selected.filter((n) => { return n != cbb.value.toString() })
                        }
                    })

                    // console.log(countries_selected)


                    var filteredData = data.filter(function(elem) {
                        // console.log(elem)
                        if (countries_selected.includes(elem.countryiso3code)) {
                            return elem
                        } else {}
                    })

                    filteredData = filteredData.filter(function(elem) {
                        if (elem.date === year) {
                            return elem
                        }
                    })

                    // console.log(filteredData)

                    countryL = document.getElementsByClassName("countryL")


                    for (let elem of countryL) {
                        elem.style.fill = "#eff3ff"
                    }

                    values_list = []
                    filteredData.forEach(elem => {
                        values_list.push(elem.value)
                    })

                    cscale = values_list.length

                    map_svg = d3.select("#map_block")
                    var map_colorScale = d3.scaleThreshold()
                        .domain(values_list)
                        .range(d3.schemeGnBu[9]);


                    filteredData.forEach((elem) => {
                        try {
                            item = document.getElementById(elem.countryiso3code + "Map")
                                // console.log(item)
                            item.style.fill = map_colorScale(elem.value)
                            item.style.cursor = 'pointer'
                            item.__data__.properties.value = elem.value
                        } catch {}
                    })

                    var callTooltip = function(volData) {
                        // console.log(volData)
                        mapTooltip = document.getElementById('mapTooltip')

                        try {
                            while (mapTooltip.firstChild) {
                                mapTooltip.removeChild(mapTooltip.lastChild);
                            }
                        } catch {}

                        explain = document.querySelector('#indicatorsSelector').querySelector('.select__toggle').innerHTML

                        // explain = 'indicator'

                        opt = document.createElement('p');
                        opt.innerHTML = explain + "<br>" + volData[0].name + ": " + f(volData[0].value)
                        opt.style.cssText = "position: relative;"

                        mapTooltip.appendChild(opt)
                    }


                    filteredData.forEach(elem => {
                        try {
                            item = document.getElementById(elem.countryiso3code + "Map")
                                // console.log(item)
                            item.onmouseover = function(event) {
                                // console.log(this.__data__)
                                // console.log(this.__data__.properties.name + " : " + this.__data__.properties.value)
                                volData = []
                                volData.push({
                                    name: this.__data__.properties.name,
                                    value: this.__data__.properties.value,
                                })
                                callTooltip(volData)

                            }

                            item.onmouseleave = function(event) {
                                mapTooltip = document.getElementById("mapTooltip")
                                try {
                                    while (mapTooltip.firstChild) {
                                        mapTooltip.removeChild(mapTooltip.lastChild);
                                    }
                                } catch {}

                                opt = document.createElement('p');
                                opt.innerHTML = "You can zoom and pan map, hover mouse on map to recieve more data"
                                mapTooltip.appendChild(opt)
                            }
                        } catch {}
                    })





                }
                drawMap(cleanData)

                function drawBar(data) {
                    var f = d3.format(".2s")

                    var parent = document.querySelector('#yearsSelector')
                    const btn = parent.querySelector('.select__toggle')
                    year = btn.value

                    countries_selected = []
                    countries.forEach(function(d) {
                        var cbb = document.querySelector('#' + d.id);
                        if (cbb.checked == true) {
                            countries_selected.push(cbb.value)

                        } else {
                            countries_selected.filter((n) => { return n != cbb.value.toString() })
                        }
                    })



                    var filteredData = data.filter(function(elem) {
                        if (countries_selected.includes(elem.countryiso3code)) {
                            return elem
                        } else {}
                    })

                    filteredData = filteredData.filter(function(elem) {
                        if (elem.date === year) {
                            return elem
                        }
                    })

                    data = filteredData

                    // console.log(data)

                    data.sort(function(b, a) {
                        return a.value - b.value;
                    });

                    var arr = []
                    data.forEach(function(d) {
                        arr.push(+d.value)
                    })

                    function domainRes(arr) {
                        if (d3.min(arr) > 0) {
                            // console.log(d3.min(arr))
                            return [0, d3.max(arr)]
                        } else {
                            return [d3.min(arr), d3.max(arr)]
                        }
                    }

                    domainResult = domainRes(arr)
                        // console.log(domainResult)


                    // console.log(data)

                    // Update the X axis
                    bar_y
                        .domain(data.map(function(d) {
                            return d.country.value;
                        }))

                    bar_yAxis.call(d3.axisLeft(bar_y))

                    bar_yAxis
                        .style('font', '10px')
                        .style("font-family", "'Montserrat', sans-serif")


                    // Update the Y axis
                    bar_x.domain(domainResult)

                    bar_xAxis.transition().duration(1).call(d3.axisBottom(bar_x));

                    bar_xAxis.attr('class', 'bottomAxis')

                    bar_xAxis
                        .selectAll("text")
                        .style('font', '10px')
                        .style("font-family", "'Montserrat', sans-serif")
                        .style('fill', 'white')
                        .text(function(d) {
                            // console.log
                            // console.log(f(d))
                            return f(d)
                        })

                    bar_xAxis
                        .selectAll("path")
                        .style('opacity', '0')

                    bar_xAxis
                        .selectAll("g")
                        .style('opacity', '0')


                    // console.log(bar_xAxis)


                    // Create the u variable
                    var bar_u = bar_svg.selectAll("rect")
                        .data(data)

                    bar_u
                        .enter()
                        .append("rect") // Add a new rect for each new elements
                        .merge(bar_u) // get the already existing elements as well
                        .transition() // and apply changes to all of them
                        .duration(1)
                        // .attr("x", 0)
                        .attr("x", function(d) {
                            // console.log(bar_x(Math.min(0, d.value)))
                            return bar_x(Math.min(0, d.value));
                        })
                        .attr("y", function(d) { return bar_y(d.country.value); })
                        .attr("height", bar_y.bandwidth())
                        // .attr("width", function(d) { return bar_x(d.value); })
                        .attr("width", function(d) { return Math.abs(bar_x(d.value) - bar_x(0)); })
                        .attr("fill", "#a7cc33")



                    // If less group in the new dataset, I delete the ones not in use anymore

                    bar_u

                        .exit()

                    .remove()



                    var labels = bar_svg.selectAll(".label")
                        .data(data)

                    // console.log(labels)

                    labels
                        .enter()
                        .append("text")
                        .attr("class", "label")
                        .merge(labels)
                        .attr("y", function(d) { return bar_y(d.country.value); })
                        .transition() // and apply changes to all of them
                        .duration(10)
                        .attr("x", (function(d) { return bar_x(d.value); }))
                        .attr("y", function(d) { return bar_y(d.country.value); }) //+ (bar_y.bandwidth() / 2)
                        .attr("dy", ".75em")
                        .style('font', '10px')
                        .style("font-family", "'Montserrat', sans-serif")
                        .text(function(d) {
                            // console.log(d)
                            if (d.value > 1.0) {
                                return f(d.value)
                            } else if (d.value < 0) {
                                return f(d.value)
                            } else if (d.value < 1.0 && d.value > 0) {
                                return d.value.toFixed(2)
                            }
                        });

                    labels
                        .exit()
                        .remove()



                }
                drawBar(cleanData)


                document.querySelector('#yearsSelector').addEventListener('select.change', (e) => {
                    const btn = e.target.querySelector('.select__toggle');
                    // console.log(`?????????????????? ????????????????: ${btn.value}`);
                    filterData(cleanData)
                    drawMap(cleanData)
                    drawBar(cleanData)
                });

                var deSelectAllButton = document.querySelector('#deSelectAllButton')
                deSelectAllButton.addEventListener('click', (event) => {
                    filterData(cleanData)
                    drawMap(cleanData)
                    drawBar(cleanData)
                })

                var selectAllButton = document.querySelector('#selectAllButton')
                selectAllButton.addEventListener('click', (event) => {
                    filterData(cleanData)
                    drawMap(cleanData)
                    drawBar(cleanData)
                })

                var menaSelectButton = document.querySelector('#menaSelectButton')
                menaSelectButton.addEventListener('click', (event) => {
                    filterData(cleanData)
                    drawMap(cleanData)
                    drawBar(cleanData)
                })

                // console.log(countries)

                countries.forEach((country) => {
                    document.querySelector('#' + country.id).addEventListener('change', (event) => {
                        filterData(cleanData)
                        drawMap(cleanData)
                        drawBar(cleanData)
                    })

                })

            })

        })






    }
    download_data(value)



    document.querySelector('#indicatorsSelector').addEventListener('select.change', (e) => {
        const btn = e.target.querySelector('.select__toggle');
        // console.log(`?????????????????? ????????????????: ${btn.value}`);
        download_data(btn.value)
    });
}

function drawScatter(secondC = undefined, firstC = undefined) {

    var f = d3.format(".2s")

    console.log('drawScatter()')


    if (firstC == undefined) {
        console.log(secondC)
        firstC = "GC.DOD.TOTL.GD.ZS" /// set dynamycaly apdaited indicator 
    }

    if (secondC == undefined) {
        console.log(secondC)
        secondC = "NE.EXP.GNFS.ZS" /// set dynamycaly apdaited indicator
    }

    year = "2016"

    function updateScatter() {

        var list = document.getElementById('scatterBlockWrapper')
        try {
            while (list.firstChild) {
                list.removeChild(list.lastChild);
            }
        } catch {}

        il = document.createElement('div');
        il.id = 'scatterBlock'
        list.appendChild(il)


        // set the dimensions and margins of the graph
        var scatter_margin = { top: 10, right: 30, bottom: 50, left: 60 },
            scatter_width = d3.select("#scatterBlock").node().getBoundingClientRect().width - scatter_margin.left - scatter_margin.right,
            scatter_height = d3.select("#scatterBlock").node().getBoundingClientRect().height - scatter_margin.top - scatter_margin.bottom;

        // append the svg object to the body of the page
        var scatter_svg = d3.select("#scatterBlock")
            .append("svg")
            .attr("width", scatter_width + scatter_margin.left + scatter_margin.right)
            .attr("height", scatter_height + scatter_margin.top + scatter_margin.bottom)
            .append("g")
            .attr("transform",
                "translate(" + scatter_margin.left + "," + scatter_margin.top + ")");

        try {
            parentIndicator = document.querySelector('#indicatorsSelector')
            firstC = parentIndicator.querySelector('.select__toggle').value

            console.log("firstC: " + firstC)
        } catch { firstC = "GC.DOD.TOTL.GD.ZS" }

        try {
            parentIndicator = document.querySelector('#addIndicatorsSelector')
            secondC = parentIndicator.querySelector('.select__toggle').value
            console.log("secondC : " + secondC)
        } catch { secondC = "NE.EXP.GNFS.ZS" }

        var urlYear = new Date().getFullYear()

        var countries_2 = 'AFG;BHR;DZA;COM;DJI;EGY;ERI;ETH;IRN;IRQ;ISR;JOR;KWT;LBN;LBY;MRT;MAR;OMN;PAK;QAT;SAU;SOM;SSD;SDN;SYR;TUN;TUR;ARE;YEM;ARB;BMN;WLD;ARB;LIC;LMC;MIC;UMC;HIC;OED;EAS;EUU;CHN;USA'

        var url2 = "https://api.worldbank.org/v2/country/" + countries_2 + "/indicator/" + firstC + ";" + secondC + "?source=2&format=json&per_page=1&date=1900:" + urlYear
        console.log(url2)

        totalRecors = []
        d3.json(url2, function(testData) {


            var url = "https://api.worldbank.org/v2/country/" + countries_2 + "/indicator/" + firstC + ";" + secondC + "?source=2&format=json&per_page=" + testData[0].total + "&date=1900:" + urlYear

            d3.json(url, function(data) {
                console.log(url)
                console.log(data)

                try {
                    var parent = document.querySelector('#yearsSelector')
                    console.log(parent)
                    const btn = parent.querySelector('.select__toggle')
                    year = btn.value
                } catch {}
                console.log(year)


                var filteredData = data[1].filter(function(elem) {
                    if (elem.date === year) {
                        return elem
                    }
                })

                // firstC = "NE.EXP.GNFS.ZS" /// set dynamycaly apdaited indicator

                xScale = []

                // secondC = "NY.GDP.PCAP.CD" /// set dynamycaly apdaited indicator


                // console.log(filteredData)
                // filteredData.forEach((elem) => {
                //     console.log(elem.country.value + " " + elem.indicator.value + " " + elem.value)
                // })

                yScale = []

                dataPackage = []

                firstIndicatorName = []
                secondIndicatorName = []

                filteredData.forEach(function(elem) {
                    if (elem.indicator.id === firstC) {
                        if (elem.value != null) {
                            row = []
                            row[firstC] = elem.value
                            row['firstIndicatorName'] = elem.indicator.value
                            row['countryId'] = elem.country.id
                            row['CountryName'] = elem.country.value

                            dataPackage.push(row)
                            xScale.push(elem.value)
                            if (firstIndicatorName.includes(elem.indicator.value)) {} else { firstIndicatorName.push(elem.indicator.value) }
                        }
                    }
                })

                console.log(dataPackage)

                filteredData.forEach(function(elem) {
                    if (elem.indicator.id === secondC) {
                        dataPackage.forEach(function(elemF) {
                            if (elemF.countryId == elem.country.id) {
                                if (elem.value != null) {
                                    elemF[secondC] = elem.value
                                    elemF['secondIndicatorName'] = elem.indicator.value
                                    yScale.push(elem.value)
                                    if (secondIndicatorName.includes(elem.indicator.value)) {} else { secondIndicatorName.push(elem.indicator.value) }
                                }
                            }
                        })
                    }
                })


                // Add X axis label:
                scatter_svg.append("text")
                    .attr("text-anchor", "end")
                    .attr("x", scatter_width / 2 + scatter_margin.left)
                    .attr("y", scatter_height + scatter_margin.top + 30)
                    .text(firstIndicatorName[0])
                    .style('font', '9px')
                    .style("font-family", "'Montserrat', sans-serif")

                // Y axis label:
                scatter_svg.append("text")
                    .attr("text-anchor", "end")
                    .attr("transform", "rotate(-90)")
                    .attr("y", -scatter_margin.left + 20)
                    .attr("x", 0)
                    .text(secondIndicatorName[0])
                    .style('font', '9px')
                    .style("font-family", "'Montserrat', sans-serif")



                dataPackage = dataPackage.filter(function(d) {
                    console.log(d)
                    if (d[firstC] != null && d[secondC] != null) {
                        console.log(d[firstC])
                        return d
                    }
                })


                console.log(dataPackage)

                if (dataPackage.length == 0) {
                    console.log("dataPackage == 0")
                    explainer = scatter_svg.append('text')

                    explainer
                        .text('No data matching selected parametes')
                        .attr("x", scatter_width / 3)
                        .attr("y", scatter_height / 2)
                        .style('font', '18px')
                        .style("font-family", "'Montserrat', sans-serif")
                        // .style('font', '18px "serifRegular"')
                        .style('color', '#444444')
                }


                //Read the data
                // Add X axis

                // SET MAX DOMAIN!!!!!!!!
                //  x is FIRST!!!!


                if (d3.min(xScale) < 0) {
                    xDomain = [d3.min(xScale) - d3.max(xScale) / 10, d3.max(xScale) + d3.max(xScale) / 10]
                } else {
                    xDomain = [0, d3.max(xScale) + d3.max(xScale) / 20]
                }

                var x = d3.scaleLinear()
                    .domain(xDomain)
                    .range([0, scatter_width]);

                console.log(x.domain)

                scatter_X_Axis = scatter_svg.append("g")
                    .attr("transform", "translate(0," + scatter_height + ")")
                    .call(d3.axisBottom(x));

                scatter_X_Axis
                    .selectAll("text")
                    .style('font', '10px')
                    .style("font-family", "'Montserrat', sans-serif")
                    // .style('font', '10px "serifRegular"')
                    .style('fill', '#444444')
                    .text(function(d) {
                        // console.log(f(d))
                        return f(d)
                    })

                // Add Y axis
                // SET MAX DOMAIN!!!!!!!!
                // y is SECOND!!!!


                if (d3.min(yScale) < 0) {
                    yDomain = [d3.min(yScale) - d3.max(yScale) / 10, d3.max(yScale) + d3.max(yScale) / 10]
                } else {
                    yDomain = [0, d3.max(yScale) + d3.max(yScale) / 20]
                }

                var y = d3.scaleLinear()
                    .domain(yDomain)
                    .range([scatter_height, 0]);

                scatter_Y_Axis = scatter_svg.append("g")
                    .call(d3.axisLeft(y));

                scatter_Y_Axis
                    .selectAll("text")
                    // .style('font', '10px "serifRegular"')
                    .style('font', '10px')
                    .style("font-family", "'Montserrat', sans-serif")
                    .style('fill', '#444444')
                    .text(function(d) {
                        // console.log(f(d))
                        return f(d)
                    })

                // Add a tooltip div. Here I define the general feature of the tooltip: stuff that do not depend on the data point.
                // Its opacity is set to 0: we don't see it by default.
                var tooltip = d3.select("#scatterBlock")
                    .append("div")
                    .style("opacity", 0)
                    .attr("class", "tooltip")
                    .style("background-color", "white")
                    .style("border", "solid")
                    .style("border-width", "1px")
                    .style("border-radius", "5px")
                    .style("padding", "10px")



                // A function that change this tooltip when the user hover a point.
                // Its opacity is set to 1: we can now see it. Plus it set the text and position of tooltip depending on the datapoint (d)
                var mouseover = function(d) {
                    tooltip
                        .style("opacity", 1)
                }

                var mousemove = function(d) {
                    tooltip
                        .html("<b>" + d['CountryName'] + ", " + year + "</b>" + "<br>" + d["secondIndicatorName"] + ": " + f(d[secondC]) + "<br>" + d["firstIndicatorName"] + ": " + f(d[firstC]))
                        .style("left", (d3.mouse(this)[0] + 90) + "px") // It is important to put the +90: other wise the tooltip is exactly where the point is an it creates a weird effect
                        .style("top", (d3.mouse(this)[1]) + "px")
                }

                // A function that change this tooltip when the leaves a point: just need to set opacity to 0 again
                var mouseleave = function(d) {
                    tooltip
                        .transition()
                        .duration(200)
                        .style("opacity", 0)
                }

                // Add dots
                scatter_svg.append('g')
                    .selectAll("dot")
                    .data(dataPackage.filter(function(d, i) { return i < 50 })) // the .filter part is just to keep a few dots on the chart, not all of them
                    .enter()
                    .append("circle")
                    .attr("cx", function(d) { return x(d[firstC]); })
                    .attr("cy", function(d) { return y(d[secondC]); })
                    .attr("r", 7)
                    .style("fill", "#a7cc33")
                    .style("opacity", 0.8)
                    .style("stroke", "none")
                    .on("mouseover", mouseover)
                    .on("mousemove", mousemove)
                    .on("mouseleave", mouseleave)




            })

        })

    }
    updateScatter()

    // var listener = function(event) {
    //     const btn = e.target.querySelector('.select__toggle');
    //     console.log(`?????????????????? ????????????????: ${btn.value}`);
    //     updateScatter()

    // }

    // console.log('add event listener draw scatter')

    // var targetElem = document.querySelector('#addIndicatorsSelector')
    // targetElem.removeEventListener('select1.change', listener, false)
    // targetElem.addEventListener('select1.change', listener)
    //     //     console.log(e)
    //     //     console.log('Change add indicator')
    //     //     updateScatter()
    //     // });
    // var targetElem = document.querySelector('#indicatorsSelector')
    // targetElem.removeEventListener('select1.change', listener, false)
    // targetElem.addEventListener('select1.change', listener)

    // var targetElem = document.querySelector('#yearsSelector')
    // targetElem.removeEventListener('select1.change', listener, false)
    // targetElem.addEventListener('select1.change', listener)

    document.querySelector('#addIndicatorsSelector').addEventListener('select.change', (e) => {
        console.log(e)
        console.log('Change add indicator')
        updateScatter()
    });

    document.querySelector('#indicatorsSelector').addEventListener('select1.change', (e) => {
        const btn = e.target.querySelector('.select__toggle');
        console.log(`?????????????????? ????????????????: ${btn.value}`);
        updateScatter()
    });

    document.querySelector('#yearsSelector').addEventListener('select1.change', (e) => {
        const btn = e.target.querySelector('.select__toggle');
        console.log(`?????????????????? ????????????????: ${btn.value}`);
        updateScatter()
    });
}
// drawScatter(firstC = undefined, secondC = undefined)

function addIndicatorsSelector(categoryList) {
    // console.log(categoryList)
    // console.log("Hello!")

    function update(option) {
        // console.log(option)

        var list = document.getElementById('addIndicatorsSelectorBlock')
        try {
            while (list.firstChild) {
                list.removeChild(list.lastChild);
            }
        } catch {}
        il = document.createElement('div');
        il.id = 'addIndicatorsSelector'
        list.appendChild(il)

        d3.csv('data/indicators.csv', function(indicators) {
            // console.log(indicators)
            indicatorsList = []
            result = indicators.filter((element) => {
                    return element.Category == option
                })
                // console.log(result)
            result.forEach(function(d) {
                    singleIndicator = []
                    singleIndicator.push(d.id)
                    singleIndicator.push(d.Indicator)
                    indicatorsList.push(singleIndicator)
                })
                // console.log(indicatorsList)
            addIndicatorsSelector = new CustomSelect('#addIndicatorsSelector', {
                name: indicatorsList[1][1],
                targetValue: indicatorsList[1][0],
                options: indicatorsList,
            })
            drawScatter(firstC = undefined, secondC = indicatorsList[1][0])
        })
    }
    update(categoryList)


    document.querySelector('#addCategorySelector').addEventListener('select.change', (e) => {
        const btn = e.target.querySelector('.select__toggle');
        update(btn.value)
    });
}

function indicatorsSelector(categoryList) {
    // console.log(categoryList)
    // console.log("Hello!")

    function update(option) {
        // console.log(option)

        var list = document.getElementById('indicatorsSelectorBlock')
        try {
            while (list.firstChild) {
                list.removeChild(list.lastChild);
            }
        } catch {}
        il = document.createElement('div');
        il.id = 'indicatorsSelector'
        list.appendChild(il)

        d3.csv('data/indicators.csv', function(indicators) {
            // console.log(indicators)
            indicatorsList = []
            result = indicators.filter((element) => {
                    return element.Category == option
                })
                // console.log(result)
            result.forEach(function(d) {
                    singleIndicator = []
                    singleIndicator.push(d.id)
                    singleIndicator.push(d.Indicator)
                    indicatorsList.push(singleIndicator)
                })
                // console.log(indicatorsList)
            indicatorsSelector = new CustomSelect('#indicatorsSelector', {
                name: indicatorsList[0][1],
                targetValue: indicatorsList[0][0],
                options: indicatorsList,
            })
            retrieve_data(indicatorsList[0][0])
            drawScatter(firstC = indicatorsList[0][0], secondC = undefined)
        })
    }
    update(categoryList)

    document.querySelector('#categorySelector').addEventListener('select.change', (e) => {
        const btn = e.target.querySelector('.select__toggle');
        update(btn.value)
    });
}

function addCategorySelector() {
    var categoryList = [
        ['Economy & Growth', 'Economy & Growth'],
        ['Poverty', 'Poverty'],
        ['Social Protection & Labor', 'Social Protection & Labor'],
        ['Environment', 'Environment']
    ]

    addCategorySelector = new CustomSelect('#addCategorySelector', {
        name: categoryList[0][1],
        targetValue: categoryList[0][0],
        options: categoryList,
    })

    addIndicatorsSelector(categoryList[0][0])
}
addCategorySelector()

function categorySelector() {
    var categoryList = [
        ['Economy & Growth', 'Economy & Growth'],
        ['Poverty', 'Poverty'],
        ['Social Protection & Labor', 'Social Protection & Labor'],
        ['Environment', 'Environment']
    ]

    categorySelector = new CustomSelect('#categorySelector', {
        name: categoryList[0][1],
        targetValue: categoryList[0][0],
        options: categoryList,
    })

    indicatorsSelector(categoryList[0][0])
}
categorySelector()