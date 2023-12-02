<?php

include 'model.php';

$slogan = "PHP is onderweg!";

if (new_route("/tov/", "get")) {
    $page_title = "TransferiumOV";
    include __DIR__ . "/views/main.php";
}
elseif (new_route("/tov/search", "get")) {
    echo "<pre>";
    print_r($_GET);
    echo "</pre>";
}
else {
    http_response_code(404);
    echo "Bad page";
}

?>