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
    "IFF:BRENG": "Breng",
    "ARR:Branding:RRReis#TW:P65": "RRReis (Arriva)"
};


function createTimeOut(ms, message) {
    let timedOutPromise = new Promise(function(resolve, reject) {
        setTimeout(function() {
            reject(new Error(message));
        }, ms);
    });
    return timedOutPromise;
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


function applyFilters() {
    if ($("#uitstapStops").is(":checked")) {
        location.href += "&us=0";
    } else if (!$("#uitstapStops").is(":checked")) {
        location.href += "&us=1";
    }
}


$(function() {
    $("#deleteFilterBtn").click(function() {
        location.reload();
    });
    $("#query").keyup(function(event) {
        if ($("#query").val().length < 3 && $("#searchOption").val() == "stop") {
            $("#searchBtn").prop("disabled", true);
        } else if ($("#query").val().length != 0) {
            $("#searchBtn").prop("disabled", false);
        } else {
            $("#searchBtn").prop("disabled", true);
        }
        
    });

    if (location.href.includes("search")) {
        const urlParams = new URLSearchParams(window.location.search);
        const searchParam = urlParams.get("type");
        if (searchParam == "route") {
            $("#searchOption").val("route");
        } else {
            $("#searchOption").val("stop");
        }
    }
    if (location.href.includes("trip.htm")) {
        getTripInfo();
    }
    $("#filterShowBtn").click(function() {
        $("#tl_filter_p").show();
        $("#tl_filter_sh").hide();
        $("#tl_timectrl").hide();
        $("#tl_controls").css("justify-content", "right");
    });
    $("#filterHideBtn").click(function() {
        $("#tl_filter_p").hide();
        $("#tl_filter_sh").show();
        $("#tl_timectrl").show();
        $("#tl_controls").css("justify-content", "space-between");
    });
    $("#filterApplyBtn").click(function() {
        applyFilters();
    });
    $("#lijnFilter").change(function() {
        if (this.checked) {
            lijnNum = parseInt(prompt("Voer het lijnnummer in waarop je wilt filteren."));
            if (!isNaN(lijnNum)) {
                $("#lfLabel").text("Lijn " + lijnNum.toString());
            } else {
                $("#lijnFilter").prop("checked", false);
            }
        } else {
            $("#lfLabel").text("Lijn");
        }
    });
});
