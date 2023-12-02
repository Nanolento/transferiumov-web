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
    $search_query = $_GET['query'];
    include __DIR__ . "/views/search.php";
}
else {
    http_response_code(404);
    echo "Bad page";
}

?>