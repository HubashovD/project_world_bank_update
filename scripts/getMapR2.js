async function returnTopo() {
    const response = await fetch("https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson")
    const data = await response.json()
    return data

}

returnTopo().then(topo => {
    var map_margin = { top: 10, right: 10, bottom: 10, left: 20 },
        map_width = d3.select("#map_block").node().getBoundingClientRect().width - map_margin.left - map_margin.right,
        //height = d3.select("#ierarchy").node().getBoundingClientRect().height - margin.top - margin.bottom;
        map_height = 400
        // The svg
    var map_svg = d3.select("#map_block")
        .append("svg")
        .attr("width", map_width + map_margin.left + map_margin.right)
        .attr("height", map_height + map_margin.top + map_margin.bottom)

    // Map and projection
    var map_path = d3.geoPath();

    var map_projection = d3.geoMercator()
        .scale(110)
        .center([0, 40])
        .translate([map_width / 2, map_height / 2]);

    // Data and color scale
    var map_data = d3.map();
    var map_colorScale = d3.scaleThreshold()
        .domain([100000, 1000000, 10000000, 30000000, 100000000, 500000000])
        .range(d3.schemeBlues[7]);

    map_g = map_svg.append("g")


    console.log(topo.features)



    map_g
        .selectAll("path")
        .data(topo.features)
        .enter()
        .append("path")
        // draw each country
        .attr("d", d3.geoPath()
            .projection(map_projection)
        )
        // set the color of each country
        .attr("fill", function(d) {
            d.total = 0
            return map_colorScale(d.total);
        })
        .style("stroke", "#ccc")
        .attr("id", function(d) { return d.id + "Map" })
        .attr("class", function(d) { return d.properties.name + " countryL" })
        .style("opacity", .8)


    var zoom = d3.zoom()
        .scaleExtent([1, 8])
        .on('zoom', function() {
            map_g.selectAll('path')
                .attr('transform', d3.event.transform);
        });

    map_svg.call(zoom);

    // map_svg
    //     .append("text")
    //     .attr('x', 0)
    //     .attr('y', map_height)
    //     .text('You can zoom and pan map')
    //     .style('font', '14px "serifRegular"')
    //     .style('color', '#444444')

});





function getMap(text) {

    countryL = document.getElementsByClassName("countryL")

    // console.log(countryL)

    for (let elem of countryL) {
        elem.style.fill = "#eff3ff"
    }

    values_list = []
    text.forEach(elem => {
        values_list.push(elem.value)
    })

    cscale = text.length
        // console.log(cscale)

    // console.log(text)
    map_svg = d3.select("#map_block")
    var map_colorScale = d3.scaleThreshold()
        .domain(values_list)
        .range(d3.schemeGnBu[9]);

    // var callTooltip = function(volData) {
    //     // console.log(volData)
    //     mapTooltip = document.getElementById('mapTooltip')

    //     try {
    //         while (mapTooltip.firstChild) {
    //             mapTooltip.removeChild(mapTooltip.lastChild);
    //         }
    //     } catch {}


    //     opt = document.createElement('p');
    //     opt.innerHTML = volData[0].name + ": " + volData[0].value
    //     opt.style.cssText = "position: absolute;"

    //     mapTooltip.appendChild(opt)
    // }


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
            // console.log(volData[0].coords[0])

        // var tooltip = d3.select("#map_block")
        //     .append("div")
        //     .data(volData)
        //     .style("opacity", 1)
        //     .attr("id", "mapTooltip")
        //     .attr("class", "tooltip")
        //     .style("x", function(d) { return d.coords[0].top + "px" })
        //     .style("y", function(d) { return d.coords[0].left + "px" })
        //     .style("background-color", "white")
        //     .style("border", "solid")
        //     .style("border-width", "1px")
        //     .style("border-radius", "5px")
        //     .style("padding", "10px")
        //     .style("font", "14px 'sansBold'")
        //     .style("color", "#444444")
        //     .text(function(d) {
        //         return volData[0].name + ": " + volData[0].value
        //     })
    }


    text.forEach(element => {
        try {
            // countries = document.getElementsByClassName(element.country)
            // console.log(element.country.replace(/\s/g, '') + "Map")
            item = document.getElementById(element.country.replace(/\s/g, '') + "Map")
                // console.log(item)
            item.style.fill = map_colorScale(element.value)
            item.style.cursor = 'pointer'
                // item.style.cssText = 'cursor: pointer; fill: ' + map_colorScale(element.value) + ';'
            item.__data__.properties.value = element.value

            // function getCoords(elem) { // кроме IE8-
            //     var box = elem.getBoundingClientRect();
            //     // console.log(box)

            //     return {
            //         top: box.y + scrollY,
            //         left: box.x + scrollX
            //     };

            // }
            // coords = getCoords(item)

            item.onmouseover = function(event) {
                console.log(this.__data__)
                    // var box = this.getBoundingClientRect()
                    // var coordinates = d3.mouse(this);
                    // console.log(box)
                coords = []
                coords.push({
                    top: event.pageX,
                    left: event.pageY
                })
                console.log(this.__data__.properties.name + " : " + this.__data__.properties.value)
                volData = []
                volData.push({
                        name: this.__data__.properties.name,
                        value: this.__data__.properties.value,
                        coords: coords,
                    })
                    // console.log(volData)
                callTooltip(volData)

            }

            item.onmouseleave = function(event) {
                mapTooltip = document.getElementById("mapTooltip")
                    // mapTooltip.remove()
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