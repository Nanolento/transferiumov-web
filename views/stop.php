<?php

include __DIR__ . "/../templates/header.php";

?>
<h2 class="tl_header" id="tl_head"><?= $stop_info['name'] ?></h2>

<div id="tl_controls">
    <p>
        <button id="earlierTripBtn">&lt; Eerder</button>
        <button id="laterTripBtn">Later &gt;</button>
    </p>

    <p id="tl_filter_p"><span id="tl_filter_header">Filters:</span>
        <input type="checkbox" id="uitstapStops" name="usFilter" checked>
        <label for="usFilter">Uitstaphaltes</label>
        <button id="filterApplyBtn">Toepassen</button>
        <button id="deleteFilterBtn">Filters wissen</button>
        <button id="filterHideBtn">X</button>
    </p>
    <p id="tl_filter_sh">
        <button id="filterShowBtn">Filters</button>
    </p>
</div>
<div id="tripList">
    <?= $trip_list ?>
</div>
<?php

include __DIR__ . "/../templates/footer.php";

?>