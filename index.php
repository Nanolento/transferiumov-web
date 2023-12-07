<?php

include 'model.php';

$slogan = "PHP is onderweg!";

if (new_route("/tov/", "get")) {
    $page_title = "TransferiumOV";
    include __DIR__ . "/views/main.php";
}
elseif (new_route("/tov/search", "get")) {
    // validate
    if (!isset($_GET['type']) or !isset($_GET['query'])) {
        echo "Invalid query!";
        die();
    }
    $search_query = htmlspecialchars($_GET['query']);

    $page_title = "Zoekresultaten: $search_query - TransferiumOV";

    if ($_GET['type'] != "stop") {
        echo "This search type is not yet available";
        redirect("https://www.qbuzz.nl/gd");
    }
    // execute
    $search_results = get_search_results($search_query);
    if (is_numeric($search_results)) {
        redirect("/tov/stop?sid=".$search_results);
    }

    // include view
    include __DIR__ . "/views/search.php";
}
elseif (new_route("/tov/stop", "get")) {
    // validate
    if (!isset($_GET['sid']) or !is_numeric($_GET['sid'])) {
        echo "Invalid data was given!";
        die();
    }
    $stop_info = get_stop_info($_GET['sid']);
    if (!$stop_info or !isset($stop_info['name'])) {
        echo "The stop does not exist!";
        die();
    }
    $page_title = "Halte ".$stop_info['name']." - TransferiumOV";
    // execute
    $trip_list = get_trip_list($_GET['sid']);

    // include view
    include __DIR__ . "/views/stop.php";
}
elseif (new_route("/tov/trip", "get")) {
    if (!isset($_GET['tid']) or !is_numeric($_GET['tid'])) {
        echo "Invalid data was given!";
        die();
    }
    $trip_info = get_trip_info($_GET['tid']);
    $route_info = get_route_info($trip_info['route_id']);
    $page_title = "Informatie over rit - TransferiumOV";
    if ($route_info['bgcolor'] != "NULL" and $route_info['fgcolor'] != "NULL") {
        $page_header = "<span style='background-color: #" . $route_info['bgcolor'] . ";color: #" .
            $route_info['fgcolor'] . ";'>Lijn ".$route_info['short_name']."</span> naar ".$trip_info['headsign'];
    } else {
        if ($route_info['type'] != 2 and $route_info['type'] != 4) {
            $page_header = "Lijn ";
        } else $page_header = "";
        $page_header .= $route_info['short_name']." naar ".$trip_info['headsign'];
    }
    $trip_no = $trip_info['short_name'];

    $stop_list = get_stop_list($_GET['tid']);
    include __DIR__ . "/views/trip.php";
}
else {
    http_response_code(404);
    echo "Bad page";
}

?>