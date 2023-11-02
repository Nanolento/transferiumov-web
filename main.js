var siteDomain = "http://localhost:8080/";
var apiDomain = "http://localhost:8000/";


const agencyNiceNames = {
    "IFF:EB": "Eurobahn",
    "IFF:VALLEI": "Valleilijn",
    "HTM": "HTM",
    "BRENG": "Breng",
    "KEOLIS": "Keolis",
    "TEXELHOPPER": "Texelhopper",
    "ALLGO": "allGo (Keolis)",
    "IFF:NSI": "NS International",
    "FF": "Westerschelde Ferry",
    "BRAVO:ARR": "Bravo (Arriva)",
    "SYNTUS:UT": "Syntus Utrecht",
    "BLUEAMIGO": "Blue Amigo",
    "TRANSDEV": "Transdev",
    "HERMES": "Hermes",
    "IFF:ES": "EU Sleeper",
    "IFF:RET": "RET",
    "TWENTS": "Twents (Keolis)",
    "IFF:ARRIVA": "Arriva",
    "BRAVO:CXX": "Bravo (Hermes)",
    "IFF:DB": "Deutsche Bahn",
    "OVREGIOY": "OV Regio IJsselmond",
    "CXX": "Connexxion",
    "UOV": "U-OV",
    "QBUZZ": "Qbuzz",
    "IFF:BN": "Blauwnet",
    "ARR": "Arriva",
    "IFF:VIAS": "VIAS",
    "EBS": "EBS",
    "IFF:RNET": "R-net",
    "IFF:NS": "NS",
    "IFF:NMBS": "NMBS",
    "OVERAL": "Overal (Connexxion)",
    "GVB": "GVB",
    "DELIJN": "De Lijn",
    "NIAG": "NIAG",
    "RET": "RET",
    "IFF:BRENG": "Breng"
};


function jsonToStopList(j) {
    $("#searchResults").html(j.length.toString() + " zoekresultaten");
    for (let i = 0; i < j.length; i++) {
        let stopListItem = document.createElement("div");
        
        let stopNameElem = document.createElement("a");
        stopNameElem.href = siteDomain + "stop.htm?sid=" + j[i].stop_id.toString();
        $(stopNameElem).text(j[i].name);
        $(stopListItem).append(stopNameElem);
        
        let stopDescElem = document.createElement("p");
        $(stopDescElem).text("Type: " + j[i].loc_type + ", ID: " + j[i].stop_id.toString());
        $(stopListItem).append(stopDescElem);
        
        if ("platform_code" in j[i]) {
            let stopPlatformElem = document.createElement("p");
            $(stopPlatformElem).text("Perron " + j[i].platform_code);
            $(stopPlatformElem).addClass("res_platform");
            $(stopListItem).append(stopPlatformElem);
        }
        $(stopListItem).addClass("searchResult");
        
        // Zebra striping
        if (i % 2 == 1) {
            $(stopListItem).addClass("res_odd");
        }

        $("#searchResults").append(stopListItem);
    }
}


function addStopTimeToTripList(st) {
    let tripElem = document.createElement("div");
    let tripTopBox = document.createElement("div");
    let tripBottomBox = document.createElement("div");
    let destName = document.createElement("a");
    destName.href = "https://google.com";
    // headsign
    if ("stop_headsign" in st && st.stop_headsign != "") {
        $(destName).text(st.stop_headsign);
    } else {
        $(destName).text(st.trip.headsign);
    }
    let agencyElem = document.createElement("p");
    let shortName = document.createElement("p");
    $(agencyElem).text(agencyNiceNames[st.route.agency]);
    $(shortName).text(st.route.short_name);
    // departure time
    let depTime = document.createElement("p");
    $(depTime).text(st.depart_time.substring(0,5));
    
    // distance
    let distElem = document.createElement("p");
    $(distElem).text((st.distance / 1000).toFixed(1) + " km");
    
    $(shortName).addClass("tl_shortname");
    $(destName).addClass("tl_destname");
    $(distElem).addClass("tl_distelem");
    $(agencyElem).addClass("tl_agency");
    $(depTime).addClass("tl_deptime");
    $(tripTopBox).addClass("tl_top");
    $(tripBottomBox).addClass("tl_bottom");
    if (st.route.fgcolor != "NULL" && st.route.bgcolor != "NULL") {
        $(tripTopBox).css({
            "color": "#" + st.route.fgcolor,
            "background-color": "#" + st.route.bgcolor + "99"
        });
        $(shortName).css({
            "background-color": "#" + st.route.bgcolor
        });
    } else {
        $(tripTopBox).css({
            "background-color": "#dddddd40"
        });
        $(shortName).css({
            "background-color": "#dddddd64"
        });
    }
    
    // append elems
    $(tripTopBox).append(depTime);
    $(tripTopBox).append(shortName);
    $(tripTopBox).append(destName);
    $(tripBottomBox).append(distElem);
    $(tripBottomBox).append(agencyElem);
    
    $(tripElem).append(tripTopBox);
    $(tripElem).append(tripBottomBox);
    $(tripElem).addClass("searchResult");
    $("#tripList").append(tripElem);
    $("#loadingIcon").remove();
}

function populateTrips() {
    if (window.location.href.includes("stop.htm") == false) {
        return
    }
    
    // https://stackoverflow.com/questions/901115/how-can-i-get-query-string-values-in-javascript
    const urlParams = new URLSearchParams(window.location.search);
    const stopIdParam = urlParams.get("sid");
    
    let stopId = parseInt(stopIdParam);
    if (isNaN(stopId)) {
        $("#tl_header").text("Helaas, er is iets misgegaan!");
        return
    }
    var stopInfo;
    var stopInfoRequest = new Promise(function(resolve, reject) {
        $.ajax({
            url: apiDomain + "stop_info",
            type: "get",
            data: { sid: stopId },
            success: function(response) {
                stopInfo = response;
                resolve(response);
            },
            error: function(response) {
                reject("Helaas, er is iets misgegaan!");
            }
        });
    });
    stopInfoRequest.then(function(response) {
        let stopInfo = response;
        let stopHeader = "";
        switch (stopInfo.loc_type) {
            case "stop":
                stopHeader += "Halte";
                break;
            case "station":
                stopHeader += "Station";
                break;
            default:
                stopHeader += stopInfo.loc_type;
                break;
        }
        stopHeader += " " + stopInfo.name;
        $("#tl_head").text(stopHeader);
        return new Promise(function(resolve, reject) {
            $.ajax({
                url: apiDomain + "get_child_stops",
                type: "get",
                data: { sid: stopId },
                dataType: "json",
                success: function(response) {
                    resolve(response);
                },
                error: function(req) {
                    reject("Helaas, er is iets misgegaan!");
                }
            });
        });
    }).then(function(response) {
        
        if (response.length == 0) {
            // get stop trips
            // no child stops
            $.ajax({
                url: apiDomain + "stop_trip_times",
                type: "get",
                data: { sid: stopId },
                dataType: "json",
                success: function(response) {
                    for (let i = 0; i < response.length; i++) {
                        addStopTimeToTripList(response[i]);
                    }
                },
                error: function(req) {
                    alert("Helaas, er is iets misgegaan!");
                }
            });
        } else {
            for (let i = 0; i < response.length; i++) {
                let cStopId = response[i].stop_id;
                $.ajax({
                    url: apiDomain + "stop_trip_times",
                    type: "get",
                    data: { sid: cStopId },
                    dataType: "json",
                    success: function(response) {
                        for (let i = 0; i < response.length; i++) {
                            addStopTimeToTripList(response[i]);
                        }
                    },
                    error: function(req) {
                        alert("Helaas, er is iets misgegaan!");
                    }
                });
                
            }
        }
    });
}


function performSearch() {
    if ($("#searchOption").val() == "route") {
        location.href = "https://qbuzz.nl/gd";
        return;
    }
    let sQuery = $("#query").val()
    $.ajax({
        url: apiDomain + "search_stop",
        type: "get",
        data: { query: sQuery },
        dataType: "json",
        success: function(response) {
            jsonToStopList(response);
        },
        error: function (req) {
            alert("Helaas, er is iets misgegaan!");
        }
    });
}


$(function() {
    $("#searchBtn").click(function() {
        performSearch();
    });
    $("#query").keyup(function(event) {
        if (event.key === "Enter") {
            performSearch();
        }
    });
    $("#betaHeader").text("alpha v0.0.8");
    populateTrips();
});
