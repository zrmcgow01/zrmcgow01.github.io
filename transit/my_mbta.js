function parse_json(){

	str = '[{"line":"blue","stations":[{"station_name":"Airport", "latitude":"42.374262", "longitude":"-71.030395"}, {"station_name":"Aquarium", "latitude":"42.359784", "longitude":"-71.051652"}, {"station_name":"Beachmont", "latitude":"42.39754234", "longitude":"-70.99231944"}, {"station_name":"Bowdoin", "latitude":"42.361365", "longitude":"-71.062037"}, {"station_name":"Government Center", "latitude":"42.359705", "longitude":"-71.059215"}, {"station_name":"Maverick", "latitude":"42.36911856", "longitude":"-71.03952958"}, {"station_name":"Orient Heights", "latitude":"42.386867", "longitude":"-71.004736"}, {"station_name":"Revere Beach", "latitude":"42.40784254", "longitude":"-70.99253321"}, {"station_name":"State Street", "latitude":"42.358978", "longitude":"-71.057598"}, {"station_name":"Suffolk Downs", "latitude":"42.39050067", "longitude":"-70.99712259"}, {"station_name":"Wonderland", "latitude":"42.41342", "longitude":"-70.991648"}, {"station_name":"Wood Island", "latitude":"42.3796403", "longitude":"-71.02286539"}]}, {"line":"red","stations":[{"station_name":"Alewife", "latitude":"42.395428", "longitude":"-71.142483"}, {"station_name":"Andrew", "latitude":"42.330154", "longitude":"-71.057655"}, {"station_name":"Ashmont", "latitude":"42.284652", "longitude":"-71.064489"}, {"station_name":"Braintree", "latitude":"42.2078543", "longitude":"-71.0011385"}, {"station_name":"Broadway", "latitude":"42.342622", "longitude":"-71.056967"}, {"station_name":"Central Square", "latitude":"42.365486", "longitude":"-71.103802"}, {"station_name":"Charles/MGH", "latitude":"42.361166", "longitude":"-71.070628"}, {"station_name":"Davis", "latitude":"42.39674", "longitude":"-71.121815"}, {"station_name":"Downtown Crossing", "latitude":"42.355518", "longitude":"-71.060225"}, {"station_name":"Fields Corner", "latitude":"42.300093", "longitude":"-71.061667"}, {"station_name":"Harvard Square", "latitude":"42.373362", "longitude":"-71.118956"}, {"station_name":"JFK/UMass", "latitude":"42.320685", "longitude":"-71.052391"}, {"station_name":"Kendall/MIT", "latitude":"42.36249079", "longitude":"-71.08617653"}, {"station_name":"North Quincy", "latitude":"42.275275", "longitude":"-71.029583"}, {"station_name":"Park Street", "latitude":"42.35639457", "longitude":"-71.0624242"}, {"station_name":"Porter Square", "latitude":"42.3884", "longitude":"-71.119149"}, {"station_name":"Quincy Adams", "latitude":"42.233391", "longitude":"-71.007153"}, {"station_name":"Quincy Center", "latitude":"42.251809", "longitude":"-71.005409"}, {"station_name":"Savin Hill", "latitude":"42.31129", "longitude":"-71.053331"}, {"station_name":"Shawmut", "latitude":"42.29312583", "longitude":"-71.06573796"}, {"station_name":"South Station", "latitude":"42.352271", "longitude":"-71.055242"}, {"station_name":"Wollaston", "latitude":"42.2665139", "longitude":"-71.0203369"}]}, {"line":"orange", "stations":[{"station_name":"Back Bay", "latitude":"42.34735", "longitude":"-71.075727"}, {"station_name":"Chinatown", "latitude":"42.352547", "longitude":"-71.062752"}, {"station_name":"Community College", "latitude":"42.373622", "longitude":"-71.069533"}, {"station_name":"Downtown Crossing", "latitude":"42.355518", "longitude":"-71.060225"}, {"station_name":"Forest Hills", "latitude":"42.300523", "longitude":"-71.113686"}, {"station_name":"Green Street", "latitude":"42.310525", "longitude":"-71.107414"}, {"station_name":"Haymarket", "latitude":"42.363021", "longitude":"-71.05829"}, {"station_name":"Jackson Square", "latitude":"42.323132", "longitude":"-71.099592"}, {"station_name":"Malden Center", "latitude":"42.426632", "longitude":"-71.07411"}, {"station_name":"Mass Ave", "latitude":"42.341512", "longitude":"-71.083423"}, {"station_name":"North Station", "latitude":"42.365577", "longitude":"-71.06129"}, {"station_name":"Oak Grove", "latitude":"42.43668", "longitude":"-71.071097"}, {"station_name":"Roxbury Crossing", "latitude":"42.331397", "longitude":"-71.095451"}, {"station_name":"Ruggles", "latitude":"42.336377", "longitude":"-71.088961"}, {"station_name":"State Street", "latitude":"42.358978", "longitude":"-71.057598"}, {"station_name":"Stony Brook", "latitude":"42.317062", "longitude":"-71.104248"}, {"station_name":"Sullivan", "latitude":"42.383975", "longitude":"-71.076994"}, {"station_name":"Tufts Medical", "latitude":"42.349662", "longitude":"-71.063917"}, {"station_name":"Wellington", "latitude":"42.40237", "longitude":"-71.077082"}]}]';
	data = JSON.parse(str);
	var xhr = new XMLHttpRequest();
	xhr.open("get", "http://mbtamap.herokuapp.com/mapper/rodeo.json", true);
	xhr.onreadystatechange = function() {
		if(xhr.readyState==4 && xhr.status==200){
			scheduleData = JSON.parse(xhr.responseText);
			line_color = scheduleData["line"];
			if(navigator.geolocation){
				navigator.geolocation.getCurrentPosition(initialize);
			}
			else{
				alert("Geolocation is not supported by this browser.");
			}
		}
		else if(xhr.readyState == 4 && xhr.status==500){
			scheduleDom = document.getElementById("map-canvas");
			scheduleDom.innerHTML = '<p>There was an error loading the schedule data.  Please try again.</p>';

		}
	}
	xhr.send(null);
	
}
var stationMarkers = [];
function initialize(position) {
	console.log("back to original");
	var lat = position.coords.latitude;
	var lon = position.coords.longitude;

	var myLoc = new google.maps.LatLng(lat, lon);
	var mapOptions = {
		center: myLoc,
		zoom:13
	};
	var map = new google.maps.Map(document.getElementById("map-canvas"), mapOptions);
	var myMarker = new google.maps.Marker({
		position: myLoc,
		title: "You are here!"
	});
	myMarker.setMap(map);
	infoWindow = new google.maps.InfoWindow();
	google.maps.event.addListener(myMarker, 'click', function(){
				infoWindow.setContent(myMarker.title);
				infoWindow.open(map, myMarker);
	});
	for(var i = 0; i < 3; i++){
		if(data[i]["line"]==line_color){
			var index = i;
			var j = 0;
			while(data[i]["stations"][j] != null){
				//console.log("latitude" + data[i]["stations"][j]["latitude"]);
				//console.log("longitude" + data[i]["stations"][j]["longitude"]);

				j++;
			}
			for(var m in stationMarkers) {
				stationLoc = new google.maps.LatLng(data[i]["stations"][m]["latitude"],data[i]["stations"][j]["longitude"]);
				stationMarkers.push(new google.maps.Marker({
					position: stationLoc,
					title: data[i]["stations"][m]["station_name"]
				}));
				stationMarkers[m].setMap(map);
				console.log(stationMarkers[m]);
				infoWindow = new google.maps.InfoWindow();
				google.maps.event.addListener(stationMarkers[m], 'click', function(){
						console.log("in eventListener: "+stationMarkers[m]);
						infoWindow.setContent(data[index]["stations"][m]["station_name"]);
						infoWindow.open(map, stationMarkers[m]);
				});
			}

		}
	}
}

