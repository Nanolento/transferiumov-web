<?php

include __DIR__ . "/../templates/header.php";

?>
<h2 class="tl_header" id="tl_head"><?= $stop_info['name'] ?></h2>

<div id="tl_controls">
    <p><button id="reloadBtn">Herladen</button></p>
    <p><span id="tl_filter_header">Filters:</span>
        <input type="checkbox" id="placeholderFilter" name="plfilter">
        <label for="plfilter">Voorbeeldfilter</label>
        <button id="filterApplyBtn">Toepassen</button>
        <button id="deleteFilterBtn">Filters wissen</button>
    </p>
</div>
<div id="tripList">
    <?= $stop_list ?>
</div>
<?php

include __DIR__ . "/../templates/footer.php";

?>