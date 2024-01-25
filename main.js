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


function applyFilters() {
    var urlParams = new URLSearchParams(window.location.search);
    if ($("#uitstapStops").is(":checked")) {
        urlParams.set("us", 0);
    } else if (!$("#uitstapStops").is(":checked")) {
        urlParams.set("us", 1);
    }
    location.replace(window.location.pathname + "?" + urlParams.toString());
}


$(function() {
    $("#dirSwitchBtn").click(function() {
        var urlParams = new URLSearchParams(window.location.search);
        const directionParam = urlParams.get("dir");
        if (directionParam == 0) {
            urlParams.set("dir", 1);
        } else {
            urlParams.set("dir", 0);
        }
        location.href = window.location.pathname + "?" + urlParams.toString();
    });
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
        var urlParams = new URLSearchParams(window.location.search);
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
    $("#earlierTripBtn").click(function() {
        let splitTimeStr = $("div.tl_top > .tl_deptime").first().text().split(":");
        let hrs = parseInt(splitTimeStr[0]);
        let mins = parseInt(splitTimeStr[1]);
        let beforeSeconds = hrs * 3600 + mins * 60;
        var urlParams = new URLSearchParams(window.location.search);
        urlParams.set("before", beforeSeconds);
        urlParams.delete("after");
        location.replace(window.location.pathname + "?" + urlParams.toString());
    });
    $("#laterTripBtn").click(function() {
        let splitTimeStr = $("div.tl_top > .tl_deptime").last().text().split(":");
        let hrs = parseInt(splitTimeStr[0]);
        let mins = parseInt(splitTimeStr[1]);
        let afterSeconds = hrs * 3600 + mins * 60;
        var urlParams = new URLSearchParams(window.location.search);
        urlParams.set("after", afterSeconds);
        urlParams.delete("before");
        location.replace(window.location.pathname + "?" + urlParams.toString());
    });
});
