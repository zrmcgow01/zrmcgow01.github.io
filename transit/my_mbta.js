var infoWindow = new google.maps.InfoWindow();
var R = 3958.76 //miles, for haversine formula

//called within HTML text.  This function creates an XMLHttpRequest object for the JSON data and parses it
//All of the location/station name data for each line is stored in a string called 'str' that I manually
//created.  If the mbta data page is successfully loaded, and geolocation is supported by the browser, initialize()
//is called to handle the rest of the functionality of this program.  Otherwise, an error message is displayed.
function parse_json(){
	str = '[{"line":"blue","stations":[{"station_name":"Wonderland", "latitude":"42.41342", "longitude":"-70.991648"}, {"station_name":"Revere Beach", "latitude":"42.40784254", "longitude":"-70.99253321"}, {"station_name":"Beachmont", "latitude":"42.39754234", "longitude":"-70.99231944"}, {"station_name":"Suffolk Downs", "latitude":"42.39050067", "longitude":"-70.99712259"}, {"station_name":"Orient Heights", "latitude":"42.386867", "longitude":"-71.004736"}, {"station_name":"Wood Island", "latitude":"42.3796403", "longitude":"-71.02286539"}, {"station_name":"Airport", "latitude":"42.374262", "longitude":"-71.030395"}, {"station_name":"Maverick", "latitude":"42.36911856", "longitude":"-71.03952958"}, {"station_name":"Aquarium", "latitude":"42.359784", "longitude":"-71.051652"},  {"station_name":"State Street", "latitude":"42.358978", "longitude":"-71.057598"}, {"station_name":"Government Center", "latitude":"42.359705", "longitude":"-71.059215"}, {"station_name":"Bowdoin", "latitude":"42.361365", "longitude":"-71.062037"}]}, {"line":"red","stations":[{"station_name":"Alewife", "latitude":"42.395428", "longitude":"-71.142483"}, {"station_name":"Davis", "latitude":"42.39674", "longitude":"-71.121815"}, {"station_name":"Porter Square", "latitude":"42.3884", "longitude":"-71.119149"}, {"station_name":"Harvard Square", "latitude":"42.373362", "longitude":"-71.118956"}, {"station_name":"Central Square", "latitude":"42.365486", "longitude":"-71.103802"}, {"station_name":"Kendall/MIT", "latitude":"42.36249079", "longitude":"-71.08617653"}, {"station_name":"Charles/MGH", "latitude":"42.361166", "longitude":"-71.070628"}, {"station_name":"Park Street", "latitude":"42.35639457", "longitude":"-71.0624242"}, {"station_name":"Downtown Crossing", "latitude":"42.355518", "longitude":"-71.060225"}, {"station_name":"South Station", "latitude":"42.352271", "longitude":"-71.055242"}, {"station_name":"Broadway", "latitude":"42.342622", "longitude":"-71.056967"}, {"station_name":"Andrews", "latitude":"42.330154", "longitude":"-71.057655"}, {"station_name":"JFK/UMass", "latitude":"42.320685", "longitude":"-71.052391"}, {"station_name":"North Quincy", "latitude":"42.275275", "longitude":"-71.029583"}, {"station_name":"Wollaston", "latitude":"42.2665139", "longitude":"-71.0203369"}, {"station_name":"Quincy Center", "latitude":"42.251809", "longitude":"-71.005409"},     {"station_name":"Quincy Adams", "latitude":"42.233391", "longitude":"-71.007153"}, {"station_name":"Braintree", "latitude":"42.2078543", "longitude":"-71.0011385"}, {"station_name":"Savin Hill", "latitude":"42.31129", "longitude":"-71.053331"}, {"station_name":"Fields Corner", "latitude":"42.300093", "longitude":"-71.061667"}, {"station_name":"Shawmut", "latitude":"42.29312583", "longitude":"-71.06573796"}, {"station_name":"Ashmont", "latitude":"42.284652", "longitude":"-71.064489"}]}, {"line":"orange", "stations":[{"station_name":"Forest Hills", "latitude":"42.300523", "longitude":"-71.113686"}, {"station_name":"Green Street", "latitude":"42.310525", "longitude":"-71.107414"}, {"station_name":"Stony Brook", "latitude":"42.317062", "longitude":"-71.104248"}, {"station_name":"Jackson Square", "latitude":"42.323132", "longitude":"-71.099592"}, {"station_name":"Roxbury Crossing", "latitude":"42.331397", "longitude":"-71.095451"}, {"station_name":"Ruggles", "latitude":"42.336377", "longitude":"-71.088961"}, {"station_name":"Mass Ave", "latitude":"42.341512", "longitude":"-71.083423"}, {"station_name":"Back Bay", "latitude":"42.34735", "longitude":"-71.075727"}, {"station_name":"Tufts Medical", "latitude":"42.349662", "longitude":"-71.063917"}, {"station_name":"Chinatown", "latitude":"42.352547", "longitude":"-71.062752"}, {"station_name":"Downtown Crossing", "latitude":"42.355518", "longitude":"-71.060225"}, {"station_name":"State Street", "latitude":"42.358978", "longitude":"-71.057598"}, {"station_name":"Haymarket", "latitude":"42.363021", "longitude":"-71.05829"}, {"station_name":"North Station", "latitude":"42.365577", "longitude":"-71.06129"}, {"station_name":"Community College", "latitude":"42.373622", "longitude":"-71.069533"}, {"station_name":"Sullivan", "latitude":"42.383975", "longitude":"-71.076994"}, {"station_name":"Wellington", "latitude":"42.40237", "longitude":"-71.077082"},    {"station_name":"Malden Center", "latitude":"42.426632", "longitude":"-71.07411"}, {"station_name":"Oak Grove", "latitude":"42.43668", "longitude":"-71.071097"}]}]';
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

//This function handles all fo the functionality of the program besides creating the station markers.
//It creates the marker on user's current location, displays the map and marker, sets events to raise
//info windows when a station icon is clicked, calculates and displays the distance from user's location
//to nearest T-station, and draws a line between each connected station.
function initialize(position) {

	var lat1 = position.coords.latitude;
	var lon1 = position.coords.longitude;

	var myLoc = new google.maps.LatLng(lat1, lon1);
	var mapOptions = {
		center: myLoc,
		zoom:13
	};
	//create user location marker
	var map = new google.maps.Map(document.getElementById("map-canvas"), mapOptions);
	var myMarker = new google.maps.Marker({
		position: myLoc,
		title: "You are here!"
	});
	//set marker on map
	myMarker.setMap(map);
	//if user marker info window is destroyed, it can be recreated by clicking the user icon
	google.maps.event.addListener(myMarker, 'click', function(){
		infoWindow.setContent("<h1>You are here!</h1><p>The closest station to you is: <strong>"+closestStation+"</strong></p><p>Distance to station: <strong>"+shortest+"</strong> miles</p>");
		infoWindow.open(map, myMarker);
	});
	//main loop to process only the correct color line
	for(var i = 0; i < 3; i++){
		if(data[i]["line"]==line_color){
			var j = 0;
			//while loop to make marker for each station
			while(data[i]["stations"][j] != null){
				//calculate distance using Haversine formula
				var lat1Rad = toRad(lat1);
				var lat2 = data[i]["stations"][j]["latitude"];
				var lat2Rad = toRad(lat2);
				var lat_diff = (data[i]["stations"][j]["latitude"] - lat1);
				var lon_diff = (data[i]["stations"][j]["longitude"] - lon1);
				var dLat = toRad(lat_diff);
				var dLon = toRad(lon_diff);
				var a = Math.sin(dLat/2)*Math.sin(dLat/2)+Math.sin(dLon/2)*Math.sin(dLon/2)*Math.cos(lat1Rad)*Math.cos(lat2Rad);
				var c = 2*Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
				var distance = R*c;
				//keep track of closest station name and distance
				if(j==0){
					var shortest = distance;
					var closestStation = data[i]["stations"][0]["station_name"];
				}
				else if(distance < shortest){
					shortest = distance;
					var closestStation = data[i]["stations"][j]["station_name"];
				}
					station_info = "<strong>" + data[i]["stations"][j]["station_name"] + "</strong>";

					var g = 0;
					//create the table for the info window for each station
					for(var w in scheduleData["schedule"]){
						for(var p in scheduleData["schedule"][w]["Predictions"]){
							if(scheduleData["schedule"][w]["Predictions"][p]["Stop"] == data[i]["stations"][j]["station_name"]){
								if(g == 0){
	     							station_info += '<table id="schedule"><tr><th>Line</th><th>Trip #</th><th>Direction</th><th>Time Remaining</th></tr>';
	     							g++;
	     						}
	     						//time will be in the format 'hh:mm:ss', except for negative numbers
	     						if(scheduleData["schedule"][w]["Predictions"][p]["Seconds"] >= 0){
	     							var minutes = Math.floor(scheduleData["schedule"][w]["Predictions"][p]["Seconds"]/60);
	     								if(minutes < 10){
	     									minutes = "0" + minutes;
	     								}
	     							var seconds = scheduleData["schedule"][w]["Predictions"][p]["Seconds"]%60;
	      								if(seconds < 10){
	     									seconds = "0" + seconds;
	     								}    									

	     							var updatedTime = "00:" + minutes + ":" + seconds;
	     						}
	     						else{
	     							var updatedTime = scheduleData["schedule"][w]["Predictions"][p]["Seconds"];
	     						}
	     						//populate a single row of the table
								station_info += '<tr><td>' + scheduleData["line"] + '</td><td>' + scheduleData["schedule"][w]["TripID"] + '</td><td>' + scheduleData["schedule"][w]["Destination"] + '</td><td>' + updatedTime + '</td></tr>';
							}
						}
					}
					//if no trains are coming, do not create table, but instead output message
					if(g==0){
						station_info = "No incoming train data available at this time.";
					}
					else{
						station_info += '</table>';
					}
				//create marker for each station in specified line
				stationLoc = new google.maps.LatLng(data[i]["stations"][j]["latitude"],data[i]["stations"][j]["longitude"]);
				stationMarkers.push(createMarker(stationLoc, data[i]["stations"][j]["station_name"], map, station_info));
				//color polylines connecting stations for blue and orange lines
				if((line_color == 'blue' || line_color == 'orange') && j!=0){
					var stationPath = [
						prevLoc,
						stationLoc
					];

					if(line_color=='blue'){
						drawPath = new google.maps.Polyline({
							path: stationPath,
							goedesic: true,
							strokeColor: '#0000FF', //blue
							strokeOpacity: 1.0,
							strokeWeight: 2
						});
					}

					if(line_color=='orange'){
						drawPath = new google.maps.Polyline({
							path: stationPath,
							goedesic: true,
							strokeColor: '#FFA500', //orange
							strokeOpacity: 1.0,
							strokeWeight: 2
						});
					}
					drawPath.setMap(map);
				}
				//hold on to location of JFK/UMass to draw line to both stations at the split
				if(data[i]["stations"][j]["station_name"]=='JFK/UMass'){
					jfkumassloc = stationLoc;
				}
				//separate case required for red line polylines because of split
				if(line_color == 'red' && j!=0){
					if(data[i]["stations"][j]["station_name"]=='Savin Hill'){
						var stationPath = [
							jfkumassloc,
							stationLoc
						];
					}
					else{
						var stationPath = [
							prevLoc,
							stationLoc
						];
					}
					drawPath = new google.maps.Polyline({
						path: stationPath,
						goedesic: true,
						strokeColor: '#FF0000', //red
						strokeOpacity: 1.0,
						strokeWeight: 2
					});		
					drawPath.setMap(map);								
				}
				prevLoc = stationLoc;
				j++;
			}
			infoWindow.setContent("<h1>You are here!</h1><p>The closest station to you is: <strong>"+closestStation+"</strong></p><p>Distance to station: <strong>"+shortest+"</strong> miles</p>");
			infoWindow.open(map, myMarker); //this displays the message on your location always
		}
	}
}

//creates and places a marker on the map for aeach T station
//uses T logo to represent each station
function createMarker(pos, title, map, content){
	custom_icon = "t_logo.jpg";
	var marker = new google.maps.Marker({
		position: pos,
		title: title,
		icon: custom_icon
	});
	google.maps.event.addListener(marker, 'click', function(){
		infoWindow.setContent(content);
		infoWindow.open(map, marker);
	});
	marker.setMap(map);
	return marker;		
}

//helper function for calculating haversine formula
function toRad(x){
	return (x * Math.PI / 180);
}

