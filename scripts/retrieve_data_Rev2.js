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

        var countries_2 = 'AFG;BHR;DZA;COM;DJI;EGY;ERI;ETH;IRN;IRQ;ISR;JOR;KWT;LBN;LBY;MRT;MAR;OMN;PAK;QAT;SAU;SOM;SSD;SDN;SYR;TUN;TUR;ARE;YEM;ARB;BMN;WLD;ARB;LIC;LMC;MIC;UMC;HIC;OED;EAS;EUU;CHN;USA'


        var url2 = "https://api.worldbank.org/v2/country/" + countries_2 + "/indicator/" + value + "?source=2&format=json&per_page=3000&date=1900:2022"
        console.log(url2)
        d3.json(url2, function(data) {

            console.log(data[1])


            countries = []
            cleanData = []
            data[1].forEach(function(entry) {
                if (entry.value != null) {
                    cleanData.push(entry)
                    if (countries.includes(entry.country.value)) {} else {
                        countries.push(entry.country.value)
                    }
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
                opt.innerHTML = element
                opt.value = element
                opt.classList.add('custom-checkbox')
                opt.type = "checkbox"
                opt.name = "ck"
                opt.id = element
                lab.for = element
                lab.innerHTML = element
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

            cleanData.forEach((d) => {
                // console.log(d.year)
                if (unique_years.includes(d.date)) {

                } else { unique_years.push(d.date) }
            })

            // console.log(unique_years.sort())

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



            function filteredData(data) {
                // console.log(data)

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
                        // val = []
                        // d.values.forEach(function(e) {
                        //     val.push(e.value)
                        //         // console.log(e.value)

                        // })
                        // console.log(val)
                        // return linepath(val);
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
                            var yearPlaceholder = document.getElementById('yearPlaceholder')
                            try {
                                while (yearPlaceholder.firstChild) {
                                    yearPlaceholder.removeChild(yearPlaceholder.lastChild);
                                }
                            } catch {}
                            series =
                                year = document.createElement('h3');
                            year.innerHTML = "Year: " + d
                            yearPlaceholder.appendChild(year)

                            var selected = d3.selectAll(".cl" + d)
                            selected._groups.forEach(nodeList => {
                                    nodeList.forEach(d => {
                                        // for (var i = 0; i < selected.length; i++) {
                                        // console.log(d)
                                        if (d.nodeName == "circle") {
                                            // console.log(d)
                                            barData.push({
                                                country: d.__data__.country,
                                                value: d.__data__.value,
                                                year: d.__data__.year
                                            })

                                            if (d.__data__.value < 1.0) {
                                                var val = +d.__data__.value
                                            } else {
                                                var val = f(+d.__data__.value)
                                            }

                                            text.push({
                                                country: d.__data__.country,
                                                value: val,
                                                year: d.__data__.year
                                            })
                                        } else {}
                                    })
                                })
                                // bar_update(barData)
                                // console.log(barData)
                                // getMap(barData)

                            // text = JSON.stringify(text)
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





                // console.log(vLines)

                var vLines = line_svg.selectAll("rect")
                vLines
                    .on("mouseover", mouseover)
                    .on("mousemove", mousemove)
                    .on("mouseleave", mouseleave)



                var barData = data.filter(function(d) {
                    return d.year == d3.max(data, function(d) {
                        return d.year
                    })
                })

                // bar_update(barData)
                // getMap(barData)

                var yearPlaceholder = document.getElementById('yearPlaceholder')
                try {
                    while (yearPlaceholder.firstChild) {
                        yearPlaceholder.removeChild(yearPlaceholder.lastChild);
                    }
                } catch {}

                year = document.createElement('h3');
                year.innerHTML = "Year: " + d3.max(data, function(d) {
                    return d.year
                })
                yearPlaceholder.appendChild(year)


                // function exportToCsv(filename, rows) {
                //     var processRow = function(row) {
                //         var finalVal = '';
                //         for (var j = 0; j < row.length; j++) {
                //             var innerValue = row[j] === null ? '' : row[j].toString();
                //             if (row[j] instanceof Date) {
                //                 innerValue = row[j].toLocaleString();
                //             };
                //             var result = innerValue.replace(/"/g, '""');
                //             if (result.search(/("|,|\n)/g) >= 0)
                //                 result = '"' + result + '"';
                //             if (j > 0)
                //                 finalVal += ',';
                //             finalVal += result;
                //         }
                //         return finalVal + '\n';
                //     };

                //     var csvFile = '';
                //     for (var i = 0; i < rows.length; i++) {
                //         csvFile += processRow(rows[i]);
                //     }

                //     var blob = new Blob([csvFile], { type: 'text/csv;charset=utf-8;' });
                //     if (navigator.msSaveBlob) { // IE 10+
                //         navigator.msSaveBlob(blob, filename);
                //     } else {
                //         var link = document.createElement("a");
                //         if (link.download !== undefined) { // feature detection
                //             // Browsers that support HTML5 download attribute
                //             var url = URL.createObjectURL(blob);
                //             link.setAttribute("href", url);
                //             link.setAttribute("download", filename);
                //             link.style.visibility = 'hidden';
                //             document.body.appendChild(link);
                //             link.click();
                //             document.body.removeChild(link);
                //         }
                //     }
                // }

                // dataForDownload = []
                // head = []
                // data[0]

                // for (const [key, value] of Object.entries(dataFiltered[0])) {
                //     if (key == 'dimensions') {
                //         for (const [key, value] of Object.entries(data[0].dimensions)) {
                //             head.push(key)
                //         }
                //     } else { head.push(key) }
                // }

                // dataForDownload.push(head)

                // data.forEach(elem => {
                //     row = []
                //         // console.log(elem)
                //     for (const [key, value] of Object.entries(elem)) {
                //         if (key == 'dimensions') {
                //             for (const [key, value] of Object.entries(elem.dimensions)) {
                //                 row.push(value)
                //             }
                //         } else { row.push(value) }

                //     }
                //     dataForDownload.push(row)
                // })



                // // exportToCsv(dataFiltered[0].seriesDescription, dataForDownload)


                // var downloadButtonDiv = document.getElementById("downloadButtonDiv");

                // try {
                //     while (downloadButtonDiv.firstChild) {
                //         downloadButtonDiv.removeChild(downloadButtonDiv.lastChild);
                //     }
                // } catch {}

                // downloadButton = document.createElement('input');
                // downloadButton.type = "button"
                // downloadButton.value = "Download data"
                // downloadButton.id = "downloadButton"
                // downloadButtonDiv.appendChild(downloadButton)


                // var listener = function() {
                //     console.log(dataForDownload)
                //     exportToCsv(data[0].seriesDescription.slice(0, 150), dataForDownload)
                // }

                // downloadButton.addEventListener('click', listener)



            }
            filteredData(cleanData)

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