<?php
include __DIR__ . "/../templates/header.php";
?>

<h2 class="tl_header" id="tl_head"><?= $page_header ?></h2>
<div id="sl_top">
    <p id="sl_ritnr">Rit <?= $trip_no ?></p>
    <p id="sl_maplink"><a href="/tov/map?type=trip&tid=<?= $_GET['tid'] ?>">Kaart</a></p>
</div>
<div id="stopList">
    <?= $stop_list ?>
</div>
<p>Wanneer de aankomsttijd niet is gegeven, is deze gelijk aan de vertrektijd.</p>
<?php
include __DIR__ . "/../templates/footer.php";
?>