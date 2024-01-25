<?php

include 'model.php';

$template = [
    [
        "id" => 1,
        "name" => "Dashboard",
        "dest" => "/"
    ],
    [
        "id" => 2,
        "name" => "Favorieten",
        "dest" => "/favorieten"
    ],
    [
        "id" => 3,
        "name" => "Kaart",
        "dest" => "/kaart"
    ],
    [
        "id" => 4,
        "name" => "Account",
        "dest" => "/account"
    ],
    [
        "id" => 5,
        "name" => "Toekomst",
        "dest" => "/toekomst"
    ]
];

if (new_route("/", "get")) {
    $navigation = get_navigation($template, 1);
    $page_title = "TransferiumOV";
    include __DIR__ . "/views/main.php";
}
elseif (new_route("/zoeken", "get")) {
    // validate
    if (!isset($_GET['type']) or !isset($_GET['query'])) {
        http_response_code(400);
        echo "400: De zoekopdracht klopt niet! Beide het zoektype en de zoekterm moeten gegeven worden.";
        die();
    }
    $search_query = htmlspecialchars($_GET['query']);
    $navigation = get_navigation($template, 0);
    if ($_GET['type'] != "stop" and $_GET['type'] != "route") {
        http_response_code(400);
        echo "400: Het geselecteerde zoektype bestaat niet!";
        die();
    } elseif ($_GET['type'] == "route" and !is_numeric($_GET['query'])) {
        http_response_code(400);
        echo "400: De zoekterm voor een lijn moet een getal zijn!";
        die();
    } elseif ($_GET['type'] == "stop" and strlen($_GET['query']) < 3) {
        http_response_code(400);
        echo "400: De zoekterm is te kort, het minimum is drie karakters.";
        die();
    }

    if ($_GET['type'] == "stop") {
        $page_title = "Zoekresultaten: $search_query - TransferiumOV";
        // execute
        $search_results = get_search_results($search_query);
        if (is_numeric($search_results)) {
            redirect("/halte?sid=" . $search_results);
        }
    } else {
        $page_title = "Zoekresultaten: Lijn $search_query - TransferiumOV";
        $search_results = get_routes($search_query);
        if ($search_results == "") $search_results = "Geen zoekresultaten.";
    }
    // include view
    include __DIR__ . "/views/search.php";
}
elseif (new_route("/halte", "get")) {
    // validate
    if (!isset($_GET['sid']) or !is_numeric($_GET['sid'])) {
        http_response_code(400);
        echo "400: Er moet een halte-id gegeven worden en deze moet een getal zijn!";
        die();
    }
    $navigation = get_navigation($template, 0);
    $stop_info = get_stop_info($_GET['sid']);
    if (!$stop_info or !isset($stop_info['name'])) {
        http_response_code(404);
        echo "404: Deze halte bestaat niet!";
        die();
    }

    $filters = Array();

    // filters
    if (isset($_GET['us']) and is_numeric($_GET['us'])) {
        if ($_GET['us'] == 1) {
            $filters['us'] = true;
        }
    }
    if (isset($_GET['after']) and is_numeric($_GET['after'])) {
        $filters['after'] = $_GET['after'];
    } elseif (isset($_GET['before']) and is_numeric($_GET['before'])) {
        $filters['before'] = $_GET['before'];
    }

    $page_title = "Halte ".$stop_info['name']." - TransferiumOV";
    // execute
    $trip_list = get_trip_list($_GET['sid'], $filters);

    // include view
    include __DIR__ . "/views/stop.php";
}
elseif (new_route("/rit", "get")) {
    if (!isset($_GET['tid']) or !is_numeric($_GET['tid'])) {
        http_response_code(400);
        echo "400: Er moet een rit-id gegeven worden en deze moet een getal zijn!";
        die();
    }
    $navigation = get_navigation($template, 0);
    $trip_info = get_trip_info($_GET['tid']);
    if (!$trip_info) {
        http_response_code(404);
        echo "404: Deze rit bestaat niet!";
        die();
    }
    $route_info = get_route_info($trip_info['route_id']);
    // page header
    if ($route_info['bgcolor'] != "NULL" and $route_info['fgcolor'] != "NULL") {
        $page_header = "<span style='background-color: #" . $route_info['bgcolor'] . ";color: #" .
            $route_info['fgcolor'] . ";'>Lijn ".$route_info['short_name']."</span> naar ".$trip_info['headsign'];
    } else {
        if ($route_info['type'] != 2 and $route_info['type'] != 4) {
            $page_header = "Lijn ";
        } else $page_header = "";
        $page_header .= $route_info['short_name']." naar ".$trip_info['headsign'];
    }
    // page title
    if ($route_info['type'] != 2 and $route_info['type'] != 4) {
        $page_title = "Lijn ";
    } else $page_title = "";
    $page_title .= $route_info['short_name']." naar ".$trip_info['headsign']." - TransferiumOV";
    $trip_no = $trip_info['short_name'];

    $stop_list = get_stop_list($_GET['tid']);
    include __DIR__ . "/views/trip.php";
}
elseif (new_route("/lijn", "get")) {
    if (!isset($_GET['rid']) or !is_numeric($_GET['rid'])) {
        http_response_code(400);
        echo "400: Er moet een lijn-id gegeven worden en deze moet een getal zijn!";
        die();
    }
    $navigation = get_navigation($template, 0);
    $route_info = get_route_info($_GET['rid']);
    if (!$route_info) {
        http_response_code(404);
        echo "404: Deze lijn bestaat niet!";
        die();
    } elseif ($route_info['type'] == 2 or $route_info['type'] == 5) {
        http_response_code(501);
        echo "501: Sorry, deze pagina werkt niet op trein- of veerbootroutes.";
        die();
    }
    if (!isset($_GET['dir']) or !is_numeric($_GET['dir'])) {
        $direction_id = 0;
    } elseif (is_numeric($_GET['dir'])) {
        $direction_id = $_GET['dir'];
    }
    

    $page_header = "Lijn ".$route_info['short_name'].": ".$route_info['long_name'];
    $page_title = $page_header . " - TransferiumOV";

    // $route_table are the rows in the table
    // the table itself is already defined in the view.
    $route_table = get_route_table($_GET['rid'], $direction_id);
    if (!$route_table) {
        http_response_code(500);
        echo "500: Sorry, het is ons helaas niet gelukt de pagina klaar te maken.";
        die();
    }
    include __DIR__ . "/views/route.php";
}
elseif (new_route("/toekomst", "get")) {
    $navigation = get_navigation($template, 5);
    $page_title = "De toekomst van TransferiumOV";
    include __DIR__ . "/views/future.php";
}
elseif (new_route("/kaart", "get")) {
    echo "Dit is een toekomstige functie. Keer later terug!";
}
elseif (new_route("/favorieten", "get")) {
    echo "Dit is een toekomstige functie. Keer later terug!";
}
elseif (new_route("/account", "get")) {
    echo "Dit is een toekomstige functie. Keer later terug!";
}
else {
    http_response_code(404);
    echo "404: Deze pagina bestaat niet. Helaas.";
}

?>
