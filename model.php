<?php

/* enable error reporting */
/* FOR DEVELOPMENT ONLY */
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);


/**
 * Useless function that says hello
 * @return void
 */
function say_hello() {
    echo "Hello!";
}

/**
 * Check if the route exists
 * @param string $route_uri URI to be matched
 * @param string $request_type Request method
 * @return bool
 *
 */
function new_route($route_uri, $request_type){
    $route_uri_expl = array_filter(explode('/', $route_uri));
    $current_path_expl = array_filter(explode('/',parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH)));
    if ($route_uri_expl == $current_path_expl && $_SERVER['REQUEST_METHOD'] == strtoupper($request_type)) {
        return True;
    } else {
        return False;
    }
}

function connect_db($db) {
    $charset = "utf8mb4";
    $dsn = "mysql:host=localhost;dbname=ovbuzz;charset=$charset";
    $options = [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    ];
    try {
        $pdo = new PDO($dsn, "jelmer", "1234", $options);
        return $pdo;
    } catch (PDOException $e) {
        sprintf("Failed to connect. %s", $e->getMessage());
        die($e->getMessage());
    }
}

?>