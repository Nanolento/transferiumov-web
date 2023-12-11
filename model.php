<?php

/* enable error reporting */
/* FOR DEVELOPMENT ONLY */
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

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

/**
 * Connects to the DB, returns the PDO object
 * @return PDO|void PDO if successful, stops execution if not
 */
function connect_db() {
    $charset = "utf8mb4";
    $dsn = "mysql:host=localhost;dbname=ovbuzz;charset=$charset";
    $options = [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    ];
    try {
        // Please specify your username and password here.
        $pdo = new PDO($dsn, "jelmer", "1234", $options);
        return $pdo;
    } catch (PDOException $e) {
        sprintf("Failed to connect. %s", $e->getMessage());
        die($e->getMessage());
    }
}

/**
 * Looks up stops based on the given query and returns HTML for displaying search results.
 * @param string $query The search query to use
 * @return string HTML for displaying search results.
 */
function get_search_results($query) {
    $pdo = connect_db();
    $stmt = $pdo->prepare("SELECT * FROM Stop WHERE name LIKE ?;");
    $stmt->execute(["%".$query."%"]);
    $result_count = $stmt->rowCount();
    if ($result_count == 1) {
        return $stmt->fetch()['id'];
    }
    elseif ($result_count > 0) {
        $resultsList = $result_count . " zoekresultaten";
        $results = $stmt->fetchAll();
        foreach ($results as $result) {
            $resultElem = "<div class='searchResult'>
            <a href='stop?sid=".$result['id']."'>".$result['name']."</a>
            <p>Type: ".$result['loc_type'].", ID: ".$result['id']."</p></div>";
            $resultsList .= $resultElem;
        }
        return $resultsList;
    } else {
        return "Geen zoekresultaten.";
    }
}

/**
 * Redirects the browser to a different location.
 * @param string $location Location to redirect to
 * @return void
 */
function redirect($location){
    header(sprintf('Location: %s', $location));
    die();
}


/**
 * Retrieves information about one stop.
 * @param int $sid The stop id to look up info for.
 * @return array An associative array with info about the stop.
 */
function get_stop_info($sid) {
    $pdo = connect_db();
    $stmt = $pdo->prepare("SELECT * FROM Stop WHERE id = ?");
    $stmt->execute([$sid]);
    if ($stmt->rowCount() >= 1) {
        return $stmt->fetch();
    } else {
        return [];
    }
}

/**
 * Looks up trips that call at the given stop and calls html_trip_list() to create HTML for it.
 * @param int $sid The stop id to get trips for.
 * @return string HTML for displaying the stop list.
 */
function get_trip_list($sid) {
    // Get trips from db
    $pdo = connect_db();
    $stmt = $pdo->prepare("SELECT st.stop_headsign, ".
                          "st.depart_time, st.trip_id, st.platform_code, ".
                          "st.pickup_type, ".
                          "t.realtime_id, t.headsign, ".
                          "t.direction_id, t.route_id, ".
                          "t.wheelchair_allowed, t.long_name ".
                          "FROM StopTime st, Trip t, CalendarDate cd WHERE ".
                          "t.id = st.trip_id AND ".
                          "cd.service_id = t.service_id AND ".
                          "cd.date = ? AND st.depart_time > ? AND ".
                          "st.depart_time < ? AND st.stop_id = ?;");
    // Execute this statement but only retrieve trips from now until 3 hours in future
    $stmt->execute([date("Y-m-d"), date("H:i:s"),
        (intval(date("H")) + 3).date(":i:s"), $sid]);
    // Add routes to the list
    $trip_list = $stmt->fetchAll();
    $routes = Array();
    $trip_list_exp = Array();
    foreach ($trip_list as $trip) {
        if (!array_key_exists($trip['route_id'], $routes)) {
            $routes += Array(
                $trip['route_id'] => get_route_info($trip['route_id'], $pdo)
            );
        }
        $trip['route'] = $routes[$trip['route_id']];
        array_push($trip_list_exp, $trip);
    }
    // Sort the array so earlier trips come first.
    usort($trip_list_exp, function($i1, $i2) {
        return $i1['depart_time'] <=> $i2['depart_time'];
    });
    // Convert the trip list array to a nice HTML view
    // equivalent to addStopTimesToTripList in main.js
    // return it because that is what we want
    return html_trip_list($trip_list_exp);
    //return json_encode($trip_list_exp, JSON_PRETTY_PRINT);
}

/**
 * A lookup table that contains the user-friendly names of agencies compared to their in-database stored names.
 */
$agency_nice_names = Array(
    "IFF:EB" => "Eurobahn",
    "IFF:VALLEI" => "Valleilijn",
    "HTM" => "HTM",
    "BRENG" => "Breng",
    "KEOLIS" => "Keolis",
    "TEXELHOPPER" => "Texelhopper",
    "ALLGO" => "allGo (Keolis)",
    "IFF:NSI" => "NS International",
    "FF" => "Westerschelde Ferry",
    "BRAVO:ARR" => "Bravo (Arriva)",
    "SYNTUS:UT" => "Syntus Utrecht",
    "BLUEAMIGO" => "Blue Amigo",
    "TRANSDEV" => "Transdev",
    "HERMES" => "Hermes",
    "IFF:ES" => "EU Sleeper",
    "IFF:RET" => "RET",
    "TWENTS" => "Twents (Keolis)",
    "IFF:ARRIVA" => "Arriva",
    "BRAVO:CXX" => "Bravo (Hermes)",
    "IFF:DB" => "Deutsche Bahn",
    "OVREGIOY" => "OV Regio IJsselmond",
    "CXX" => "Connexxion",
    "UOV" => "U-OV",
    "QBUZZ" => "Qbuzz",
    "IFF:BN" => "Blauwnet",
    "ARR" => "Arriva",
    "IFF:VIAS" => "VIAS",
    "EBS" => "EBS",
    "IFF:RNET" => "R-net",
    "IFF:NS" => "NS",
    "IFF:NMBS" => "NMBS",
    "OVERAL" => "Overal (Connexxion)",
    "GVB" => "GVB",
    "DELIJN" => "De Lijn",
    "NIAG" => "NIAG",
    "RET" => "RET",
    "IFF:BRENG" => "Breng",
    "ARR:Branding:RRReis#TW:P65" => "RRReis (Arriva)"
);

/**
 * Creates HTML for displaying a given trip list.
 * get_trip_list() calls this function.
 * @param array $trip_list The associative array with trip information.
 * @return string HTML that displays a list of trips.
 */
function html_trip_list($trip_list) {
    $tl_str = "<p>".count($trip_list)." ritten in de komende 3 uren</p>";
    $train_style = false; // this bool indicates if the styling needs to adapt for trains
    foreach ($trip_list as $trip) {
        if (!$train_style and ($trip['route']['type'] == 2 or $trip['route']['type'] == 4)) {
            $train_style = true;
        }
        // Use stop headsign or trip headsign
        if ($trip['stop_headsign'] != "") {
            $headsign = $trip['stop_headsign'];
        }
        else {
            $headsign = $trip['headsign'];
        }
        // get nice name for agency
        global $agency_nice_names;
        $agency = $agency_nice_names[$trip['route']['agency']];

        // get route type
        if ($trip['long_name'] != "") {
            $type_str = $trip['long_name'];
        } else {
            $route_types = ["Tram", "Metro", "Trein", "Bus", "Veerboot"];
            $type_str = $route_types[$trip['route']['type']];
        }
        // create link
        $dest_link = "/tov/trip?tid=".$trip['trip_id'];
        // color elems
        if (isset($trip['route']['fgcolor']) and isset($trip['route']['bgcolor'])
            and $trip['route']['fgcolor'] != "NULL" and $trip['route']['bgcolor'] != "NULL") {
            $style_str = "style='background-color: #".$trip['route']['bgcolor']."50;'";
            $style_sn_str = "style='color: #".$trip['route']['fgcolor'].";".
                "background-color: #".$trip['route']['bgcolor'].";'";
        } else {
            $style_str = "style='background-color: #dddddd40;'";
            $style_sn_str = "style='background-color: #dddddd64;'";
        }
        // create html
        $tl_str .= "<div class='searchResult'>
        <div class='tl_top' ".$style_str.">
            <p class='tl_deptime'>".substr($trip['depart_time'],0,5)."</p>";
        if (!$train_style) $tl_str .= "<p class='tl_shortname' ".$style_sn_str.">".$trip['route']['short_name']."</p>";
        $tl_str .= "<a class='tl_destname' href='".$dest_link."'>".$headsign."</a>
            <p class='tl_platform'>".$trip['platform_code']."</p>
        </div>
        <div class='tl_bottom'>
            <p class='tl_agency'>".$agency."</p>";
        if (!$train_style) {
            $tl_str .= "<p class='tl_type'>".$type_str."</p>";
        } else {
            $tl_str .= "<p class='tl_type'>".$trip['route']['short_name']."</p>";
        }
        if ($trip['pickup_type'] == 1) {
            $tl_str .= "<p class='tl_problem'>Niet instappen</p>";
        }
        $tl_str .= "</div></div>";
    }
    return $tl_str;
}

/**
 * Retrieves information about a route.
 * @param int $route_id The route ID to look up information for.
 * @param PDO $pdo The database connection to use.
 * @return false|array False if no route was found, else an associative array with info about the route.
 */
function get_route_info($route_id, $pdo=null) {
    if (!isset($pdo)) {
        $pdo = connect_db();
    }
    $stmt = $pdo->prepare("SELECT r.short_name, r.long_name, r.fgcolor, r.bgcolor, r.type, r.agency FROM Route r WHERE id = ?;");
    $stmt->execute([$route_id]);
    if ($stmt->rowCount() >= 1) {
        return $stmt->fetch();
    } else {
        return false;
    }
}

/**
 * Retrieves information about a trip
 * @param int $tid The trip ID to look up information for.
 * @return false|array False if no trip was found, else an associative array with info about the trip.
 */
function get_trip_info($tid) {
    $pdo = connect_db();
    $stmt = $pdo->prepare("SELECT * FROM Trip WHERE id = ?;");
    $stmt->execute([$tid]);
    if ($stmt->rowCount() == 1) {
        return $stmt->fetch();
    } else return false;
}

/**
 * Creates a list of stops a trip calls at.
 * Uses html_stop_list() to generate nice HTML.
 * @param int $tid Trip ID to generate a stop list for.
 * @return string HTML to display a stop list
 */
function get_stop_list($tid) {
    $pdo = connect_db();
    $stmt = $pdo->prepare("SELECT st.arrival_time, st.depart_time, st.stop_id, st.stop_seq, s.name".
                          " FROM StopTime st, Stop s WHERE st.stop_id = s.id AND st.trip_id = ?;");
    $stmt->execute([$tid]);
    if ($stmt->rowCount() >= 1) {
        $stop_list = $stmt->fetchAll();
        usort($stop_list, function($i1, $i2) {
            return $i1['arrival_time'] <=> $i2['arrival_time'];
        });
        return html_stop_list($stop_list);
    } else return "";
}

/**
 * Generates HTML for displaying a stop list.
 * Used by get_stop_list().
 * @param array $stop_list The stop list to use when genearting the HTML.
 * @return string HTML to display a nice stop list.
 */
function html_stop_list($stop_list) {
    $sl_str = "<table class='sl_table'><tr><th>Aankomst</th><th>Vertrek</th><th>Halte</th><th>Plaats</th></tr>";
    foreach ($stop_list as $stop) {
        // times, if arrival=depart only show depart
        if ($stop['depart_time'] == $stop['arrival_time']) {
            $depart_time = substr($stop['depart_time'], 0, 5);
            $arrival_time = "";
        } else {
            $depart_time = substr($stop['depart_time'], 0, 5);
            $arrival_time = substr($stop['arrival_time'], 0, 5);
        }

        // stop name
        if (($pos = strpos($stop['name'], ",")) !== false) {
            $sname = substr($stop['name'], $pos + 2);
            $place_name = substr($stop['name'], 0, $pos);
        } else {
            $sname = $stop['name'];
            $place_name = "";
        }
        $sl_str .= "<tr><td class='sl_time'>".$arrival_time."</td><td class='sl_time'>".$depart_time."</td><td>".
        "<a href='/tov/stop?sid=".$stop['stop_id']."'>".$sname."</a></td><td>".$place_name."</td></tr>";
    }
    $sl_str .= "</table>";
    return $sl_str;
}

function get_routes($query) {
    $pdo = connect_db();
    $stmt = $pdo->prepare("SELECT * FROM Route WHERE short_name = ?;");
    $stmt->execute([$query]);
    $results = $stmt->fetchAll();
    global $agency_nice_names;
    $resultsList = "";
    foreach ($results as $result) {
        $agency = $agency_nice_names[$result['agency']];
        $resultElem = "<div class='searchResult'>
        <a href='route?rid=".$result['id']."'>Lijn ".$result['short_name']." van ".$agency."</a>
        <p>".$result["long_name"]."</p></div>";
        $resultsList .= $resultElem;
    }
    return $resultsList;
}

function get_route_table($rid) {
    $pdo = connect_db();
    // get a trip that uses this route that happen today
    $trip_stmt = $pdo->prepare("SELECT t.id FROM Trip t, CalendarDate cd ".
        "WHERE t.service_id = cd.service_id AND cd.date = ? AND t.route_id = ?;");
    $trip_stmt->execute([date("Y-m-d"), $rid]);
    if ($trip_stmt->rowCount() == 0) {
        return false;
    }
    $trips = $trip_stmt->fetchAll();
    $stop_stmt = $pdo->prepare("SELECT s.id, s.name FROM Stop s, StopTime st WHERE ".
        "st.stop_id = s.id AND st.trip_id = ?;");
    $stop_stmt->execute([$trips[0]['id']]);
    if ($stop_stmt->rowCount() == 0) {
        return false;
    }
    $stops = $stop_stmt->fetchAll();
    // obtain trip stop_times
    $trip_times = Array();
    foreach ($trips as $trip) {
        $stmt = $pdo->prepare("SELECT st.depart_time, st.stop_id FROM StopTime st WHERE ".
            "st.trip_id = ?;");
        $stmt->execute([$trip['id']]);
        array_push($trip_times, $stmt->fetchAll());
    }
    //echo "<td><pre>".json_encode($trip_times, JSON_PRETTY_PRINT)."</pre></td>";
    //return true;
    $table_rows = "";
    foreach ($stops as $stop) {
        // add stop name to table
        $table_rows .= "<tr><td class='rt_stopname'>".$stop['name']."</td>";
        // now, add stop times to table
        foreach ($trip_times as $tript) {
            foreach ($tript as $ttime) {
                if ($ttime['stop_id'] == $stop['id']) {
                    $table_rows .= "<td>" . substr($ttime['depart_time'], 0, 5) . "</td>";
                }
            }

        }
        $table_rows .= "</tr>";
    }
    return $table_rows;
}

?>