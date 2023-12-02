<?php

include 'model.php';

$slogan = "PHP is onderweg!";

if (new_route("/tov/", "get")) {
    $page_title = "TransferiumOV";
    include __DIR__ . "/views/main.php";
}
elseif (new_route("/tov/test", "get")) {
    echo "testing 123";
}
else {
    http_response_code(404);
    echo "Bad page";
}

?>