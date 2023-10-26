
function jsonToStopList(j) {
    /*
    let listItem = document.createElement("li");
    let listItemLink = document.createElement("a");
    listItemLink.href = $("#inputLinkLocation").val();
    listItemText = document.createTextNode($("#inputLinkName").val());
    listItemLink.appendChild(listItemText);
    listItem.appendChild(listItemLink);
    $("#linkList").append(listItem);
    */
    for (let i = 0; i < j.length; i++) {
        let stopListItem = document.createElement("div");
        
        let stopNameElem = document.createElement("a");
        stopNameElem.href = "https://9292.nl";
        let stopNameElemText = document.createTextNode(j[i].name);
        stopNameElem.appendChild(stopNameElemText);
        stopListItem.appendChild(stopNameElem);
        
        let stopDescElem = document.createElement("p");
        $(stopDescElem).html("Type: " + j[i].loc_type + ", ID: " + j[i].stop_id.toString())
        stopListItem.appendChild(stopDescElem);
        $(stopListItem).addClass("searchResult");
        $("#searchResults").append(stopListItem);
    }
    
}


$(function() {
    $("#searchBtn").click(function() {
        if ($("#searchOption").val() == "route") {
            location.href = "https://qbuzz.nl/gd";
        }
        let sQuery = $("#query").val()
        $.ajax({
            url: "http://localhost:5000/search_stop",
            type: "get",
            data: {
                query: sQuery
            },
            dataType: "json",
            success: function(response) {
                jsonToStopList(response);
            },
            error: function (req, status, err) {
                alert('Something went wrong', status, err);
            }
        });
    });
});
