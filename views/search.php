<?php

include __DIR__ . "/../templates/header.php";

?>

<h1>Zoekresultaten</h1>
<form action="/tov/search" method="get">
    <select id="searchOption" name="type">
        <option value="stop" selected>Halte/station</option>
        <option value="route">Lijn</option>
    </select>
    <input id="query" name="query" type="text" placeholder="Zoeken" value="<?= $search_query ?>">
    <button type="submit" id="searchBtn" disabled>Zoeken</button>
</form><br>
<div id="searchResults"><?= $search_results ?></div>

<?php

include __DIR__ . "/../templates/footer.php";

?>
