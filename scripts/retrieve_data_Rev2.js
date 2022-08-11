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


        var today = new Date()
        var year = today.getYear();

        var countries = ['AFG', 'BHR', 'DZA', 'COM', 'DJI', 'EGY', 'ERI', 'ETH', 'IRN', 'IRQ', 'ISR', 'JOR', 'KWT', 'LBN', 'LBY', 'MRT', 'MAR', 'OMN', 'PAK', 'QAT',
            "SAU", "SOM", "SSD", "SDN", "SYR", "TUN", "TUR", "ARE", "YEM", "ARB", "BMN", "WLD", "ARB", "LIC", "LMC", "MIC", "UMC", "HIC", "OED", "EAS", "EUU", "CHN", 'USA'
        ]

        var menaCountriesCodes = ['AFG', 'BHR', 'DZA', 'COM', 'DJI', 'EGY', 'ERI', 'ETH', 'IRN', 'IRQ', 'ISR', 'JOR', 'KWT', 'LBN', 'LBY', 'MRT', 'MAR', 'OMN', 'PAK', 'QAT',
            "SAU", "SOM", "SSD", "SDN", "SYR", "TUN", "TUR", "ARE", "YEM", "ARB"
        ]

        var menaCountriesNames = []

        var countries_2 = 'AFG;BHR;DZA;COM;DJI;EGY;ERI;ETH;IRN;IRQ;ISR;JOR;KWT;LBN;LBY;MRT;MAR;OMN;PAK;QAT;SAU;SOM;SSD;SDN;SYR;TUN;TUR;ARE;YEM;ARB;BMN;WLD;ARB;LIC;LMC;MIC;UMC;HIC;OED;EAS;EUU;CHN;USA'


        var url2 = "https://api.worldbank.org/v2/country/" + countries_2 + "/indicator/" + value + "?source=2&format=json&per_page=3000&date=1900:2022"
        console.log(url2)
        d3.json(url2, function(data) {

            console.log(data[1])


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

            console.log(yearsList)
            console.log(menaCountriesNames)

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
                if (menaCountriesNames.includes(element)) {
                    opt.classList.add('menaCountry')
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





            // console.log(cleanData)

            var line_margin = { top: 30, right: 30, bottom: 40, left: 30 },
                line_width = d3.select("#lineBlock").node().getBoundingClientRect().width - line_margin.left - line_margin.right,
                line_height = d3.select("#lineBlock").node().getBoundingClientRect().height - line_margin.top - line_margin.bottom;

            // console.log(line_height)

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
                // console.log(d.year

                if (unique_years.includes(d.date)) {

                } else { unique_years.push(d.date) }
            })


            unique_years.sort().forEach((d) => {
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
                .attr("y", -20)
                .style('font', '14px "serifRegular"')
                .style('color', '#444444')





            function filterData(data) {
                console.log('filterData(data)')
                    // console.log(countries)

                countries_selected = []
                countries.forEach(function(d) {
                    // console.log(d)
                    var cbb = document.querySelector('#' + d.id);
                    if (cbb.checked == true) {
                        countries_selected.push(cbb.value)
                        console.log(countries_selected)
                    } else {
                        countries_selected.filter((n) => { return n != cbb.value.toString() })
                    }
                })
                console.log(countries_selected)


                var filteredData = data.filter(function(elem) {
                    // console.log(elem)
                    if (countries_selected.includes(elem.countryiso3code)) {
                        console.log(elem)
                        return elem
                    } else {}
                })

                data = filteredData

                console.log(filteredData)

                var color = d3.scaleOrdinal()
                    .domain(data)
                    .range(['#e41a1c', "#BE6E61", '#377eb8', "#BEB461", "#6179BE", '#4daf4a', '#984ea3', "#B861BE", '#ff7f00', '#ffff33', '#a65628', '#f781bf', '#999999', "#a6cee3",
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
                        // console.log(d)
                        return d.country.value;
                    })
                    .entries(data);

                // console.log(sumstat)

                var arr = []
                data.forEach(function(d) {
                    arr.push(+d.value)
                })

                // console.log(arr)

                function domainRes(arr) {
                    if (d3.min(arr) > 0) {
                        return [0, d3.max(arr)]
                    } else {
                        return [d3.min(arr), d3.max(arr)]
                    }
                }

                domainResult = domainRes(arr)

                // console.log(domainResult)

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
                    .style('font', '10px "serifRegular"')
                    .style('color', '#444444')
                    .text(function(d) {
                        if (d < 1.0) {
                            return d
                        } else {
                            return f(+d)
                        }

                    })

                LineyAxis.tickFormat(function(d) {
                    // console.log(d)
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
                    .style('font', '10px "serifRegular"')
                    .style('color', '#444444')


                line_svg.selectAll(".group")
                    .remove();



                var line_group = line_svg.selectAll(".group")
                    .data(sumstat)
                    .enter()
                    .append("g")
                    .attr("class", "group");


                line_group.append("path")
                    .attr("class", "line")
                    .transition()
                    .duration(500)
                    .attr("d", function(d) {
                        return linepath(d.values);
                    })
                    .attr("fill", "none")
                    .style("stroke", function(d) {
                        // console.log(d)
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
                    .style("font", "14px 'sansBold'")
                    .style("color", "#444444")


                var circles = line_svg.append('g')
                    .selectAll("dot")
                    .data(data)
                    .enter()
                    .append("circle")
                    .attr("class", function(d) { return "cl" + d.date + " circle" })
                    .attr("cx", function(d) { return line_x(d.date); })
                    .attr("cy", function(d) { return line_y(d.value); })
                    .attr("r", 2)
                    .style("fill", function(d) {
                        // console.log(d)
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
                                    // console.log(d)
                                    // for (var i = 0; i < selected.length; i++) {
                                    // console.log(d)
                                    if (d.nodeName == "circle") {
                                        // console.log(d.__data__)
                                        // console.log(d)
                                        barData.push({
                                            country: d.__data__.country.value,
                                            value: d.__data__.value,
                                            year: d.__data__.date
                                        })

                                        if (d.__data__.value < 1.0) {
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
                                // console.log(elem)
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
                console.log(data)

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
                            // console.log(key)
                            // console.log(value)
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


                // try {
                //     for (const [key, value] of Object.entries(data[0])) {
                //         head.push(key)
                //     }

                //     dataForDownload.push(head)

                //     data.forEach(elem => {

                //         for (const [key, value] of Object.entries(elem)) {
                //             row.push(value)
                //         }
                //         dataForDownload.push(row)
                //     })

                // } catch {}

                // exportToCsv(dataFiltered[0].seriesDescription, dataForDownload)


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
                const btn1 = parentIndicator.querySelector('.select__toggle');
                console.log(`Выбранное значение: ${btn1.name}`);
                csvName = btn1.name


                var listener = function() {
                    console.log(dataForDownload)
                    exportToCsv(csvName.slice(0, 150), dataForDownload)
                }

                downloadButton.addEventListener('click', listener)



            }
            filterData(cleanData)

            function drawMap(data) {


                var parent = document.querySelector('#yearsSelector')
                console.log(parent)
                const btn = parent.querySelector('.select__toggle')
                year = btn.value
                console.log(`Выбранное значение: ${btn.value}`)

                var yearPlaceholder = document.getElementById('yearPlaceholder')
                try {
                    while (yearPlaceholder.firstChild) {
                        yearPlaceholder.removeChild(yearPlaceholder.lastChild);
                    }
                } catch {}

                yearText = document.createElement('h3');
                yearText.innerHTML = year
                yearPlaceholder.appendChild(yearText)


                console.log(year)

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

                console.log(countries_selected)


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

                console.log(filteredData)

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
                    console.log(volData)
                    mapTooltip = document.getElementById('mapTooltip')

                    try {
                        while (mapTooltip.firstChild) {
                            mapTooltip.removeChild(mapTooltip.lastChild);
                        }
                    } catch {}


                    opt = document.createElement('p');
                    opt.innerHTML = volData[0].name + ": " + volData[0].value
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


            var bar_margin = { top: 10, right: 50, bottom: 10, left: 100 },
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

            function drawBar(data) {


                var parent = document.querySelector('#yearsSelector')
                console.log(parent)
                const btn = parent.querySelector('.select__toggle')
                year = btn.value

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

                console.log(countries_selected)


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

                data = filteredData

                console.log(data)

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


                // Update the Y axis
                bar_x.domain(domainResult)
                bar_xAxis.transition().duration(1).call(d3.axisBottom(bar_x));

                bar_xAxis.attr('class', 'bottomAxis')

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
                var f = d3.format(".2s")
                labels
                    .enter()
                    .append("text")
                    .attr("class", "label")
                    .merge(labels)
                    .attr("y", function(d) { return bar_y(d.country.value); })
                    .transition() // and apply changes to all of them
                    .duration(10)
                    .attr("x", (function(d) { return bar_x(d.value); }))
                    .attr("y", function(d) { return bar_y(d.country.value) + (bar_y.bandwidth() / 2) + 3; })
                    .attr("dy", ".75em")
                    .text(function(d) {
                        // console.log(d)
                        if (d.value < 1.0) {
                            return d.value
                        } else {
                            return f(d.value)
                        }
                    });

                labels
                    .exit()
                    .remove()



            }
            drawBar(cleanData)

            function drawScatter(data) {}

            document.querySelector('#yearsSelector').addEventListener('select.change', (e) => {
                const btn = e.target.querySelector('.select__toggle');
                console.log(`Выбранное значение: ${btn.value}`);
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


        })






    }
    download_data(value)



    document.querySelector('#indicatorsSelector').addEventListener('select.change', (e) => {
        const btn = e.target.querySelector('.select__toggle');
        console.log(`Выбранное значение: ${btn.value}`);
        download_data(btn.value)
    });
}




function indicatorsSelector(categoryList) {
    // console.log(categoryList)
    // console.log("Hello!")

    function update(option) {
        console.log(option)

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
        })
    }
    update(categoryList)

    document.querySelector('#categorySelector').addEventListener('select.change', (e) => {
        const btn = e.target.querySelector('.select__toggle');
        update(btn.value)
    });
}


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