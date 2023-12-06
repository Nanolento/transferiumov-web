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
    $stop_list = get_stop_list($_GET['sid']);

    // include view
    include __DIR__ . "/views/stop.php";
}
else {
    http_response_code(404);
    echo "Bad page";
}

?>