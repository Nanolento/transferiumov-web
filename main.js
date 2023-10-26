$(function() {
    $("#searchBtn").click(function() {
        sQuery = $("#query").val()
        $.ajax({
            url: "http://localhost:5000/search_stop",
            type: "get",
            data: {
                query: sQuery
            },
            dataType: "json",
            success: function(response) {
                $("#output").html(JSON.stringify(response));
            },
            error: function (req, status, err) {
                alert('Something went wrong', status, err);
            }
        });
    });
});
