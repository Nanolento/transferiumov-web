const siteDomain = "http://127.0.0.1:8080/";
const apiDomain = "http://127.0.0.1:8000/";


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


function addStopTimesToTripList(stopTimes) {
    if ($("#tl_tripcount").length == 0) {
        let countElem = document.createElement("p");
        $(countElem).text(stopTimes.length.toString() + " ritten vandaag");
        $(countElem).attr("id", "tl_tripcount");
        $("#tripList").append(countElem);
    }
    stopTimes.forEach(st => {
        let tripElem = document.createElement("div");
        let tripTopBox = document.createElement("div");
        let tripBottomBox = document.createElement("div");
        let destName = document.createElement("a");
        destName.href = siteDomain + "trip.htm?tid=" + st.trip_id.toString() +
                        "&sid=" + st.stop_id.toString();
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
        let typeElem = document.createElement("p");
        if (st.trip.long_name != "") {
            $(typeElem).text(st.trip.long_name);
        } else {
            capitalizedType = st.route.type.charAt(0).toUpperCase() + st.route.type.slice(1);
            $(typeElem).text(capitalizedType);
        }
        // departure time
        let depTime = document.createElement("p");
        $(depTime).text(st.depart_time.substring(0,5));
        
        // distance
        //let distElem = document.createElement("p");
        //$(distElem).text((st.distance / 1000).toFixed(1) + " km");
        
        
        
        $(destName).addClass("tl_destname");
        //$(distElem).addClass("tl_distelem");
        $(agencyElem).addClass("tl_agency");
        $(depTime).addClass("tl_deptime");
        $(typeElem).addClass("tl_type");
        $(tripTopBox).addClass("tl_top");
        $(tripBottomBox).addClass("tl_bottom");
        if (st.route.fgcolor != "NULL" && st.route.bgcolor != "NULL" && st.route.type != "train"
            && st.route.short_name.includes("trein") == false) {
            $(tripTopBox).css({
                "background-color": "#" + st.route.bgcolor + "50"
            });
            $(shortName).css({
                "background-color": "#" + st.route.bgcolor,
                "color": "#" + st.route.fgcolor
            });
        } else if (st.route.type != "train" && st.route.short_name.includes("trein") == false) {
            $(tripTopBox).css({
                "background-color": "#dddddd40"
            });
            $(shortName).css({
                "background-color": "#dddddd64"
            });
        } else {
            $(tripTopBox).css({
                "background-color": "#dddddd40"
            });
            $(destName).css({
                "margin": "1em 1em"
            });
        }
        
        $(tripBottomBox).append(agencyElem);
        // append elems
        $(tripTopBox).append(depTime);
        if (st.route.type == "train" || st.route.short_name.includes("trein")) {
            $(shortName).addClass("tl_trainname");
            $(tripBottomBox).append(shortName);
        } else {
            $(shortName).addClass("tl_shortname");
            $(tripTopBox).append(shortName);
            $(tripBottomBox).append(typeElem);
        }
        $(tripTopBox).append(destName);
        if (typeof st.platformCode !== 'undefined' && st.platformCode != "") {
            let platformElem = document.createElement("p");
            $(platformElem).text(st.platform_code);
            $(platformElem).addClass("tl_platform");
            $(tripTopBox).append(platformElem);
        }
        
        //$(tripBottomBox).append(distElem);
        
        // realtime placeholder
        let rtSep = document.createElement("p");
        $(rtSep).text("|");
        let realtimeBox = document.createElement("div");
        $(realtimeBox).css({
            "color": "#aaa",
            "font-style": "italic"
        });
        $(realtimeBox).text("Geen realtime-informatie beschikbaar");
        $(tripBottomBox).append(rtSep);
        $(realtimeBox).addClass("tl_rtbox");
        $(rtSep).addClass("tl_rtbox");
        $(tripBottomBox).append(realtimeBox);
        
        $(tripElem).append(tripTopBox);
        $(tripElem).append(tripBottomBox);
        $(tripElem).addClass("searchResult");
        $("#tripList").append(tripElem);
    });
    $("#loading").css("display", "none");
    $("#tl_controls").css("display", "flex");
    
    // if reloading, don't scroll
    // check if loading has happened before, else say it has
    if ($("#loaded").val() == "yes") {
        return;
    } else {
        $("#loaded").val("yes");
    }
    
    // scroll to current time
    // get element to scroll to
    let currentHour = new Date().getHours();
    let hourOffset = 0; 
    while ($(".tl_currenttime").length == 0) {
        // 30 instead of 24 because GTFS times can go over 24 hours.
        let hour = ((currentHour + hourOffset) % 30).toString().padStart(2, '0')
        $("#tripList").children().each(function(){
            if ($(this).children().first().text().startsWith(hour)) {
                $(this).addClass("tl_currenttime");
                return false;
            }
        });
        hourOffset += 1;
        if (hourOffset > 30) {
            break;
        }
    }
    // now scroll there
    if ($(".tl_currenttime").length != 0) {
        $("#tripList").scrollTop($(".tl_currenttime").position().top + $("#tripList").scrollTop() - $("#tripList").offset().top);
    }
}


function createTimeOut(ms, message) {
    let timedOutPromise = new Promise(function(resolve, reject) {
        setTimeout(function() {
            reject(new Error(message));
        }, ms);
    });
    return timedOutPromise;
}


function populateTrips() {
    // https://stackoverflow.com/questions/901115/how-can-i-get-query-string-values-in-javascript
    const urlParams = new URLSearchParams(window.location.search);
    const stopIdParam = urlParams.get("sid");
    
    // store stop id
    var sidStorage = document.createElement("input");
    sidStorage.type = "hidden";
    $(sidStorage).val(stopIdParam);
    $(sidStorage).attr("id", "stopId");
    $("#tripList").append(sidStorage);
    // and if the first load has happened yet.
    var loadStorage = document.createElement("input");
    loadStorage.type = "hidden";
    $(loadStorage).val("no");
    $(loadStorage).attr("id", "loaded");
    $("#tripList").append(loadStorage);
    
    
    let stopId = parseInt(stopIdParam);
    if (isNaN(stopId)) {
        $("#tl_head").css({
            "background-color": "#f5948c"
        });
        $("#tl_head").text("Laden van halteinformatie mislukt.");
        $("#loading").css("display", "none");
        return
    }
    var stopInfoRequest = new Promise(function(resolve, reject) {
        $.ajax({
            url: apiDomain + "stop_info",
            type: "get",
            data: { sid: stopId },
            success: function(response) {
                resolve(response);
            },
            error: function(response) {
                reject(new Error(`Laden van halteinformatie mislukt.`));
            }
        });
    });
    stopInfoRequest.then(function(response) {
        let stopInfo = response;
        let stopHeader = stopInfo.name;
        $("#tl_head").text(stopHeader);
        document.title = stopHeader + " - OVbuzz";
        if (stopInfo.parent_station != 0) {
            location.replace("/stop.htm?sid=" + stopInfo.parent_station.toString());
            return new Promise(function(resolve, reject) {
                // this is not a real error, but just to avoid
                // the "TypeError" that comes up when redirecting.
                reject(new Error(`Laden...`));
            });
        }
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
                    reject(new Error(`Laden van bijbehorende haltes is mislukt.`));
                }
            });
        });
    }).then(function(response) {
        let stops = [];
        if (response.length == 0) {
            stops.push({
                "stopId": stopId
            });
        } else {
            for (let i = 0; i < response.length; i++) {
                stops.push({
                    "stopId": response[i].stop_id
                });
            }
        }
        let promises = [];
        for (let i = 0; i < stops.length; i++) {
            let getPromise = new Promise(function(resolve, reject) {
                $.ajax({
                    url: apiDomain + "stop_trip_times",
                    type: "get",
                    data: { sid: stops[i].stopId },
                    dataType: "json",
                    success: function(response) {
                        resolve(response);
                    },
                    error: function(req) {
                        reject(new Error(`Laden van rittijden voor halte ${stops[i].stopId} mislukt.`));
                    }
                });
            });
            
            let timedOutPromise = createTimeOut(45000, `Tijdens het laden van rittijden voor halte ${stops[i].stopId} deed ` +
                                                       `de server er te lang over om te reageren.`);
            promises.push(Promise.race([getPromise, timedOutPromise]));
        }
        Promise.allSettled(promises).then(ffPromises => {
            let stopTimes = [];
            for (let i = 0; i < ffPromises.length; i++) {
                if (ffPromises[i].status == "fulfilled") {
                    // for this stop only
                    // clone the array as the promise value is immutable.
                    let localStopTimes = Array.from(ffPromises[i].value);
                    // if it has a platform code, append platform code to the stop times.
                    stopTimes = stopTimes.concat(localStopTimes);
                } else {
                    let warning = document.createElement("p");
                    $(warning).text(ffPromises[i].reason.message);
                    $(warning).addClass("warning");
                    $("#tripList").append(warning);
                }
            }
            // now we have all stopTimes with their platform codes.
            // now we sort them by departure time.
            stopTimes.sort(function(a, b) {
                let compareIntA = parseInt(a.depart_time.substring(0,2)) * 60 + parseInt(a.depart_time.substring(3,5));
                let compareIntB = parseInt(b.depart_time.substring(0,2)) * 60 + parseInt(b.depart_time.substring(3,5));
                return compareIntA - compareIntB;
            });
            // now we can create elements.
            // we can use nearly identical code to the previous attempt.
            addStopTimesToTripList(stopTimes);
        });
    }).catch(function(error) {
        if (error.message != "Laden...") {
            // avoid a red flash on screen when redirecting.
            $("#tl_head").addClass("warning");
        }
        $("#tl_head").text(error.message);
        $("#loading").css("display", "none");
    });
}


function reloadTrips() {
    // Exact copy of populateTrips, omitting the stopInfo request since we already have
    // that information.
    
    // https://stackoverflow.com/questions/901115/how-can-i-get-query-string-values-in-javascript
    const stopIdParam = $("#stopId").val();
    
    let stopId = parseInt(stopIdParam);
    
    var stopInfoRequest = new Promise(function(resolve, reject) {
        $.ajax({
            url: apiDomain + "get_child_stops",
            type: "get",
            data: { sid: stopId },
            dataType: "json",
            success: function(response) {
                resolve(response);
            },
            error: function(req) {
                reject(new Error(`Laden van bijbehorende haltes is mislukt.`));
            }
        });
    });
    stopInfoRequest.then(function(response) {
        let stops = [];
        if (response.length == 0) {
            stops.push({
                "stopId": stopId
            });
        } else {
            for (let i = 0; i < response.length; i++) {
                stops.push({
                    "stopId": response[i].stop_id
                });
            }
        }
        let promises = [];
        for (let i = 0; i < stops.length; i++) {
            let getPromise = new Promise(function(resolve, reject) {
                $.ajax({
                    url: apiDomain + "stop_trip_times",
                    type: "get",
                    data: { sid: stops[i].stopId },
                    dataType: "json",
                    success: function(response) {
                        resolve(response);
                    },
                    error: function(req) {
                        reject(new Error(`Laden van rittijden voor halte ${stops[i].stopId} mislukt.`));
                    }
                });
            });
            
            let timedOutPromise = createTimeOut(45000, `Tijdens het laden van rittijden voor halte ${stops[i].stopId} deed ` +
                                                       `de server er te lang over om te reageren.`);
            promises.push(Promise.race([getPromise, timedOutPromise]));
        }
        Promise.allSettled(promises).then(ffPromises => {
            let stopTimes = [];
            for (let i = 0; i < ffPromises.length; i++) {
                if (ffPromises[i].status == "fulfilled") {
                    // for this stop only
                    // clone the array as the promise value is immutable.
                    let localStopTimes = Array.from(ffPromises[i].value);
                    // if it has a platform code, append platform code to the stop times.
                    stopTimes = stopTimes.concat(localStopTimes);
                } else {
                    let warning = document.createElement("p");
                    $(warning).text(ffPromises[i].reason.message);
                    $(warning).addClass("warning");
                    $("#tripList").append(warning);
                }
            }
            // now we have all stopTimes with their platform codes.
            // now we sort them by departure time.
            stopTimes.sort(function(a, b) {
                let compareIntA = parseInt(a.depart_time.substring(0,2)) * 60 + parseInt(a.depart_time.substring(3,5));
                let compareIntB = parseInt(b.depart_time.substring(0,2)) * 60 + parseInt(b.depart_time.substring(3,5));
                return compareIntA - compareIntB;
            });
            // now we can create elements.
            // we can use nearly identical code to the previous attempt.
            
            // since we are reloading, remove old elems.
            $(".searchResult").remove();
            // re-add stop times.
            addStopTimesToTripList(stopTimes);
        });
    }).catch(function(error) {
        console.log("if this happens, we dont know whats happening");
    });
}


function getTripInfo() {
    const urlParams = new URLSearchParams(window.location.search);
    const stopIdParam = urlParams.get("sid");
    const tripIdParam = urlParams.get("tid");
    const tripId = parseInt(tripIdParam);
    const stopId = parseInt(stopIdParam);
    let tripStopList = new Promise(function(resolve, reject) {
        $.ajax({
            url: apiDomain + "trip_stoptimes",
            type: "get",
            data: { tid: tripId },
            dataType: "json",
            success: function(response) {
                resolve(response);
            },
            error: function(req) {
                reject(new Error(`Laden van ritinformatie is mislukt.`));
            }
        });
    });
    let timedOutPromise = createTimeOut(45000, `Laden van ritinformatie duurde te lang.`);
    Promise.race([tripStopList, timedOutPromise]).then(function(response) {

        $.ajax({
            url: apiDomain + "trip_info",
            type: "get",
            data: { tid: tripId },
            dataType: "json",
            success: function(resp) {
                if (resp.route.type != "train")
                    headText = "Lijn ";
                else headText = "";
                headText += resp.route.short_name;
                headText += " naar " + resp.headsign;
                document.title = resp.route.short_name + " " + resp.headsign + " - OVbuzz";
                $("#sl_ritnr").text("Rit " + resp.short_name + ", ");
                $("#tl_head").text(headText);
                if (!isNaN(stopId)) {
                    addTripInfoToStopList(response, stopId);
                } else {
                    addTripInfoToStopList(response, 0);
                }
            }
        });
    }).catch(function(req) {
        $("#tl_head").text(req.message);
        $("#tl_head").addClass("warning");
        $("#loading").css("display", "none");
    });
}


function addTripInfoToStopList(stopTimes, sid) {
    $("#sl_ritnr").text($("#sl_ritnr").text() + "stopt bij " + stopTimes.length.toString() + " haltes.");
    stopTimes.forEach(st => {
        let stopElem = document.createElement("div");
        $(stopElem).addClass("sl_box");
        let stopNameElem = document.createElement("p");
        let stopLinkElem = document.createElement("a");
        let stopPlaceName = document.createElement("p");
        if (st.stop_name.includes(",")) {
            $(stopLinkElem).text(st.stop_name.split(",")[1].split("(")[0]);
            $(stopPlaceName).text(st.stop_name.split(",")[0]);
            $(stopPlaceName).addClass("sl_placename");
            stopLinkElem.href = siteDomain + "stop.htm?sid=" + st.stop_id;
            
        } else {
            $(stopLinkElem).text(st.stop_name);
            stopLinkElem.href = siteDomain + "stop.htm?sid=" + st.stop_id;
        }
        $(stopNameElem).addClass("sl_name");
        $(stopNameElem).append(stopLinkElem);
        let depTimeElem = document.createElement("p");
        $(depTimeElem).text(st.depart_time.substring(0,5));
        $(depTimeElem).addClass("sl_deptime");
        
        let stopBox = document.createElement("div");
        let depBox = document.createElement("div");
        $(stopElem).addClass("sl_box");
        $(stopBox).addClass("sl_sbox");
        $(depBox).addClass("sl_dbox");
        $(depBox).append(depTimeElem);
        $(stopBox).append(stopNameElem);
        if (st.stop_name.includes(",")) {
            $(stopBox).append(stopPlaceName);
        }
        let distElem = document.createElement("p");
        $(distElem).text((st.distance / 1000).toFixed(1) + " km");
        $(distElem).addClass("sl_dist");
        $(depBox).append(distElem);
        $(stopElem).append(depBox);
        $(stopElem).append(stopBox);
        
        if (sid != 0) {
            if (st.stop_id == sid) {
                $(stopElem).addClass("sl_selstop");
            }
        }
        $("#stopList").append(stopElem);
    });
    $("#loading").css("display", "none");
}


function performSearch() {
    if ($("#searchOption").val() == "route") {
        location.href = "https://qbuzz.nl/gd";
        return;
    }
    let sQuery = $("#query").val()
    let searchPromise = new Promise(function(resolve, reject) {
        $.ajax({
            url: apiDomain + "search_stop",
            type: "get",
            data: { query: sQuery },
            dataType: "json",
            success: function(response) {
                resolve(response);
            },
            error: function (req) {
                reject(new Error(`Laden van zoekresultaten is mislukt.`));
            }
        });
    });
    let timedOutPromise = createTimeOut(10000, `Laden van zoekresultaten duurde te lang.`);
    // create loading spinner for searching
    let loadingIcon = document.createElement("img");
    $(loadingIcon).attr("id", "loading");
    $(loadingIcon).attr({
        "src": "loading.png",
        "width": "16",
        "height": "16"
    });
    $(loadingIcon).addClass("rotate");
    $("#searchResults").html("");
    $(loadingIcon).insertAfter("#searchBtn");
    Promise.race([searchPromise, timedOutPromise]).then(function(response) {
        jsonToStopList(response);
        $("#loading").css("display", "none");
    }).catch(function(error) {
        let warning = document.createElement("p");
        $(warning).text(error.message);
        $(warning).addClass("warning");
        $("#searchResults").append(warning);
        $("#loading").css("display", "none");
    });
}


$(function() {
    /*$("#searchBtn").click(function() {
        if ($("#query").val().length >= 3) {
            performSearch();
        }
    });*/
    $("#reloadBtn").click(function() {
        $("#loading").css("display", "block");
        reloadTrips();
    });
    $("#deleteFilterBtn").click(function() {
        location.reload();
    });
    $("#query").keyup(function(event) {
        if ($("#query").val().length < 3) {
            $("#searchBtn").prop("disabled", true);
        } else {
            $("#searchBtn").prop("disabled", false);
        }
        if (event.key === "Enter" && $("#query").val().length >= 3) {
            performSearch();
        }
        
    });
    
    if (location.href.includes("stop.htm")) {
        populateTrips();
    }
    else {
        $("#content").css({
            "padding": "1em"
        });
    }
    if (location.href.includes("trip.htm")) {
        getTripInfo();
    }
});
