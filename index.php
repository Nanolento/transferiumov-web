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
    echo "<pre>";
    print_r($_GET);
    echo "</pre>";
}
else {
    http_response_code(404);
    echo "Bad page";
}

?>