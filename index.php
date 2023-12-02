<?php

include 'model.php';

if (new_route("/tov/", "get")) {
    echo "Home page";
}
elseif (new_route("/tov/test", "get")) {
    echo "testing 123";
}
else {
    http_response_code(404);
    echo "Bad page";
}

?>