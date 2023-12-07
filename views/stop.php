<?php

include __DIR__ . "/../templates/header.php";

?>
<noscript>Je hebt JavaScript nodig om OVbuzz te gebruiken!
Check of JavaScript aan staat in je browser of dat
je browser het ondersteunt.<br></noscript>
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
    <pre><?= $stop_list ?></pre>
</div>
<?php

include __DIR__ . "/../templates/footer.php";

?>