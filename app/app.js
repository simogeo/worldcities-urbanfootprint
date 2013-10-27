var log = false;
var pop_init = 36933000; // max population
var canvas_height = 220;
var canvas_width = 220;
var t = 1000;
var animation_t = 50; // animation timer when loading 50 or 100 is ok
var total = 100; // population
var data_url = "data/world_data_2011.json";

var serie_area;
var serie_pop;
var serie_spi;

// Geographical zones colors
colors = new Array();
colors["africa"] = '#604515';
colors["australia"] = '#00B0B2';
colors["asia"] = '#F7F126';
colors["europa"] = '#798AA8';
colors["middle east"] = '#E29836';
colors["latin america"] = '#79B25E';
colors["north america"] = '#E54340';


       
// Polygon definition
 // Specify the path points
 // 88.571431,131.42857 -11.203937,108.75758 -20.474834,6.8598505 73.570804,-33.445428 140.9651,43.542274
polygoninfo = [ {x:138.571431, y:181.42857},
				{x:38.796063, y:158.75758},
				{x:29.525166, y:56.8598505},
				{x:123.570804, y:16.554572},
				{x:190.9651, y:93.542274},
				{x:138.571431, y:181.42857}];
				


// Translate function
var _t = function (str) {
    return str;
};

var debug = function (msg) {
    if (log == true) console.log(msg);
}

var getSvgColor = function (svg) {
    var c = document.getElementById(svg);
    var context = canvas.getContext("2d");

    return context.fillStyle;
}

function setRange() {
	
	$('.feature > .infobox').each(function( index ) {
		
		var id = $(this).attr('id').replace("tooltip-",""); 
		
		var range_area = getRange(id, serie_area);
		var range_pop = getRange(id, serie_pop);
		var range_spi = getRange(id, serie_spi);
		
		$(this).find('span.range-area').html(range_area);
		$(this).find('span.range-population').html(range_pop);
		$(this).find('span.range-spi').html(range_spi);
	});
}
// Return json object position from serie
function getRange(id, serie) {

	 for (var i = 0; i < serie.length; i++) {
		 if(serie[i].Rank == id) return i+1;
	 }
}

// document ready
$(function () {

    // numeral.language('fr');
    
    // Colorize legend with user defined color ranges
    $('ul#gz-legend li').each(function() {
		var val = $(this).find('span.legend-block').attr('data-fetch');
		$(this).find('span.legend-block').css('background-color', colors[val]);
	});


    var updateCounter = function (reverse) {

        var isotopeInstance = $cont.data('isotope');
        filteredElements = isotopeInstance.$filteredAtoms;

        var total_filtered = filteredElements.length;

        $('div.counter-container > span.counter-total').html(parseInt(total_filtered));

        for (var i = 0; i <= total_filtered; i++) {
            if (reverse == true) {
                $(filteredElements[i]).find('div.counter-container > span.counter').html(' ' + parseInt(total_filtered - (i)));
            } else {
                $(filteredElements[i]).find('div.counter-container > span.counter').html(' ' + parseInt(i + 1));
            }
        }


    };

    var info = function (obj) {

        var tooltip = '<div class="infobox" id="tooltip-' + obj.Rank + '">';
        tooltip += '<p>' + _t('City') + ' : <span class="data-city">' + $.trim(obj.City) + '</span></p>';
        tooltip += '<p>' + _t('Country') + ' : <span class="data-country">' + $.trim(obj.Country) + '</span></p>';
        tooltip += '<p>' + _t('Population') + ' : <span class="data-population" data-population="' + obj.Population + '">' + numeral(obj.Population).format('0,0') + '</span> (<span class="range-population"></span>)'  + '</p>';
        if (obj.Area != 0) {
            tooltip += '<p>' + _t('Area (km²)') + ' : <span class="data-area"  data-area="' + obj.Area + '">' + numeral(obj.Area).format('0,0') + '</span> (<span class="range-area"></span>)'  + '</p>';
            tooltip += '<p>' + _t('Surface / inhabitant (m²)') + ' : <span class="data-surface-inhabitant" data-surface-inhabitant="' + obj.Spi + '">' + numeral(obj.Spi).format('0,0.00') + '</span> (<span class="range-spi"></span>)'  + '</p>';

        } else {
            tooltip += '<p>' + _t('Area (km²)') + ' : <span class="data-area no-data" data-area="0">' + _t('nd') + '</span></p>';
            tooltip += '<p>' + _t('Surface / inhabitant (m²)') + ' : <span class="data-surface-inhabitant" data-surface-inhabitant="0">' + _t('nd') + '</span></p>';

        }


        tooltip += '</div>';

        return tooltip;
    }


    // use of $.ajax instead of $.getJSON
    // to set async: false
    $.ajax({
        url: data_url,
        dataType: 'json',
        async: false,
        success: function (data) {

            // we loop on features
            $.each(data, function (i, el) {

                if (el.Area == null) {
                    el.Area = 0
                    el.Spi  = 0;
                } else {
					// we add Surface per inhabitant value to the json object
                    el.Spi  = el.Area / el.Population * 1000000;
                }
                
                /**
				console.log('--------------');
				console.log(el);
				* */
				
                /**
                a_pop[el.Rank] = el.Population;
                a_area[el.Rank] = tmp_area;
                a_spi[el.Rank] = tmp_spi;
                * * */
										
                var generatedDiv = $(document.createElement('div'));

                // generatedDiv.html(feature);
                generatedDiv.attr('id', "feature-" + el.Rank);
                generatedDiv.attr('class', "feature");
                generatedDiv.addClass(el.Geographical_zone.toLowerCase().replace(/ /g, "-"));
                generatedDiv.append(info(el));
                //generatedDiv.append('<canvas id="circle-' + el.Rank + '" width="' + canvas_height + '" height="' + canvas_height + '"></canvas>');
                generatedDiv.append('<div class="counter-container"><span class="legend">' + _t('Population') + '</span> (' + _t('Range') + ') : <span class="counter">' + (i + 1) + '</span>/<span class="counter-total">' + total + '</span></div>');
                generatedDiv.append('<p class="highlight">' + numeral(el.Population).format('0,0') + ' inhabitants</p>');
                generatedDiv.append('<h2>' + el.City + '</h2>');
				
				var isChrome = /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);
				if(isChrome){
					extra_height = 50;
				} else {
					extra_height = 30;
				}
				
                generatedDiv.css({
                    "width": canvas_width + "px",
                    "height": canvas_height + extra_height + "px"
                });

                // binding info box
                generatedDiv.hover(function () {
                    $(this).find('.infobox').fadeIn();
                }, function () {
                    $(this).find('.infobox').fadeOut();
                });

                generatedDiv.hide();
                $('#main #visualization-container').append(generatedDiv);



				// D3 shapes - Make an SVG Container
				var svgContainer = d3.select("#feature-" + el.Rank).insert("svg", ":first-child")
				                                    .attr("width", canvas_width)
				                                    .attr("height", canvas_height)
				                                    .attr("id", 'shape-' + el.Rank);

				                                    
				var circle = svgContainer.append("circle")
										.attr("cx", parseInt(canvas_width / 2))
										.attr("cy", parseInt(canvas_height / 2))
										.attr("r", el.Population / 36933000 * 0.85 * 100)
										.attr("fill", colors[el.Geographical_zone.toLowerCase()])
										.attr("stroke", "#ffffff")
										.attr("stroke-width", 1);


                // animate the page when loading
                t += animation_t;
                generatedDiv.delay(t).fadeIn('fast');

            }); // closing each instruction
            
            serie  = data;
            

        }  // closing success function
        
        
    }); // closing ajax call
    
    serie_area = $objeq(serie, 'ORDER BY Area desc');
    serie_pop = $objeq(serie, 'ORDER BY Population desc');
    serie_spi = $objeq(serie, 'ORDER BY Spi desc');
    
    // getting max values
    max_pop = serie_pop[0].Population;
    max_area = serie_area[0].Area;
    max_spi = serie_spi[0].Spi;
    debug('Max pop : ' + max_pop + ' / Max area : ' + max_area + ' / Max surface /inhabitant : ' + max_spi);
        

    debug("sorted by area : ");
    debug(serie_area);
    debug("sorted by population : ");
    debug(serie_pop);
    debug("sorted by SPI : ");
    debug(serie_spi);
    
    setRange();


    $('div.counter-container').css('width', parseInt(canvas_width - 32) + 'px'); // 32 is the width of the corner


    // init jquery.isotope
    var $cont = $('#visualization-container');

    $cont.isotope({
        // options
        animationEngine: "jquery",
        itemSelector: '.feature',
        layoutMode: 'fitRows',
        sortAscending: true,
        getSortData: {
            population: function ($elem) {
                return parseInt($elem.find('.data-population').attr('data-population'));
            },
            area: function ($elem) {
                return parseFloat($elem.find('.data-area').attr('data-area'));
            },
            surfaceinhabitant: function ($elem) {
                return parseInt($elem.find('.data-surface-inhabitant').attr('data-surface-inhabitant'));
            },
            city: function ($elem) {
                return $elem.find('.data-city').text();
            },
            country: function ($elem) {
                return $elem.find('.data-country').text();
            }
        }
    });

    // Filters on geographical zone
    $('#filters button').click(function () {
        $cont.isotope({
            filter: '.' + $(this).attr('data-filter')
        });

        $('h2#title > span.gz').html($(this).html()).hide().fadeIn();

    }); // closing #filters click


    $('#sorting button').click(function () {
        $cont.isotope({
            sortBy: $(this).attr('data-filter'),
            sortAscending: eval($(this).attr('data-sort'))
        });


        var sorting = $(this).attr('data-filter');

        if ($(this).attr('data-sort') == "true") {
            $(this).attr('data-sort', 'false');
            $('#displaying button, #sorting button').removeClass('sort-desc').removeClass('sort-asc');
            $(this).removeClass('sort-desc').addClass('sort-asc');

        } else {
            $(this).attr('data-sort', 'true');
            $('#displaying button, #sorting button').removeClass('sort-desc').removeClass('sort-asc');

            $(this).removeClass('sort-asc').addClass('sort-desc');
        }

        $(".feature").each(function (index) {
            var highlight = $(this).find('.data-country').text();
            $(this).find("p.highlight").html(highlight);
        });

    }); // closing #sorting click

    $('#displaying button').click(function () {

        $cont.isotope({
            sortBy: $(this).attr('data-filter'),
            sortAscending: eval($(this).attr('data-sort'))
        });

        updateCounter(eval($(this).attr('data-sort')));

        if ($(this).attr('data-sort') == "true") {
            $(this).attr('data-sort', 'false');
            $('#displaying button, #sorting button').removeClass('sort-desc').removeClass('sort-asc');
            $(this).removeClass('sort-desc').addClass('sort-asc');

        } else {
            $(this).attr('data-sort', 'true');
            $('#displaying button, #sorting button').removeClass('sort-desc').removeClass('sort-asc');

            $(this).removeClass('sort-asc').addClass('sort-desc');
        }

        var sorting = $(this).attr('data-filter');

        var cnt = 0;

        // A) population
        if (sorting == 'population') {


            $('h2#title > span.filter').html($(this).html()).hide().fadeIn();
            $('div.counter-container > span.legend').html($(this).html());

            $(".feature").each(function (index) {

                var highlight = $(this).find('.data-population').text();
                var highlight_int = $(this).find('.data-population').attr('data-population');


                $(this).find("p.highlight").html(numeral(highlight_int).format('0,0') + ' inhabitants');

                var $svg = $(this).find('svg');

                // we get the current color of the shape
                var current_color = $svg.children().attr("fill");
                
                // we remove the current shape
                $svg.children().remove();
            
                

				                                    
				// D3 shapes - Creating rectangle			                                    
				var shape = d3.select('#'+ $svg.attr("id")).append("circle")
										.attr("cx", parseInt(canvas_width / 2))
										.attr("cy", parseInt(canvas_height / 2))
										.attr("r", highlight_int / max_pop * 0.85 * 100)
										.attr("fill", current_color)
										.attr("stroke", "#ffffff")
										.attr("stroke-width", 1);
										
										
				/**
                // we redraw the circle
                $canvas.clearCanvas().drawArc({
                    strokeStyle: "#fff",
                    strokeWidth: 1,
                    fillStyle: current_color,
                    x: canvas_height / 2,
                    y: canvas_width / 2,
                    radius: highlight_int / max_pop * 0.85 * 100
                });
                * */

            });
        }

        // B) Area
        if (sorting == 'area') {

            $('h2#title > span.filter').html($(this).html()).hide().fadeIn();
            $('div.counter-container > span.legend').html($(this).html());

            $(".feature").each(function (index) {

                var highlight = $(this).find('.data-area').text();
                var highlight_int = $(this).find('.data-area').attr('data-area');

                $(this).find("p.highlight").html(highlight + ' km²');

                var $svg = $(this).find('svg');

                // we get the current color of the shape
                var current_color = $svg.children().attr("fill");
                
                // we remove the current shape
                $svg.children().remove();
                
                // D3 shapes - Creating rectangle			                                    
				var shape = d3.select('#'+ $svg.attr("id")).append("rect")
										.attr("x", function() {return (canvas_width - parseInt(highlight_int / max_area * 100)) /2;})
										.attr("y", function() {return (canvas_height - parseInt(highlight_int / max_area * 100)) /2;})
										.attr("width", parseInt(highlight_int / max_area * 100))
										.attr("height", parseInt(highlight_int / max_area * 100))
										.attr("fill", current_color)
										.attr("stroke", "#ffffff")
										.attr("stroke-width", 1);

            });
        }

        // C) surfaceinhabitant
        if (sorting == 'surfaceinhabitant') {

            $('h2#title > span.filter').html($(this).html()).hide().fadeIn();
            $('div.counter-container > span.legend').html($(this).html());

            $(".feature").each(function (index) {

                var highlight = $(this).find('.data-surface-inhabitant').text();
                var highlight_int = $(this).find('.data-surface-inhabitant').attr('data-surface-inhabitant');

                $(this).find("p.highlight").html(highlight + ' m² / inhabitant');

                var $svg = $(this).find('svg');

				console.log($svg);
				console.log($svg.attr('id'));
                // we get the current color of the shape
                var current_color = $svg.children().attr("fill");
                
                // we remove the current shape
                $svg.children().remove();
                
				// technique from http://knowledgestockpile.blogspot.fr/2012/01/drawing-svg-path-using-d3js.html
				var d3line2 = d3.svg.line()
								.x(function(d){return d.x;})
								.y(function(d){return d.y;})
								.interpolate("linear"); 
				
				// we compute scaling factor
				sx = highlight_int / max_spi ;
								
                // D3 shapes - Creating pentagon			                                    
				var shape = d3.select('#'+ $svg.attr("id"))
										.append("path")
										.attr("d", d3line2(polygoninfo))
										.attr("fill", current_color)
										.attr("stroke", "#ffffff")
										.attr("stroke-width", 1)
										.attr("transform", "rotate(23, " + parseInt(canvas_width / 2) + ", " + parseInt(canvas_height / 2) + ") translate(" + ( - parseInt(canvas_width / 2) * (sx-1)) + ", " + ( - parseInt(canvas_width / 2) * (sx-1)) + ") scale(" + sx + ")")
										//.attr("transform", "matrix(" + sx + ", 0, 0, sy, cx-sx*cx, cy-sy*cy"); // taken from http://stackoverflow.com/questions/6711610/how-to-set-transform-origin-in-svg

            });
        }

    }); // closing #displaying click


});
