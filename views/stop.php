<?php

include __DIR__ . "/../templates/header.php";

?>
<noscript>Je hebt JavaScript nodig om OVbuzz te gebruiken!
Check of JavaScript aan staat in je browser of dat
je browser het ondersteunt.<br></noscript>
<h2 class="tl_header" id="tl_head">Informatie wordt opgehaald...</h2>
<div id="loading">
    <img class="rotate" src="loading.png" width=64 height=64 />
    <p>Informatie wordt opgehaald...</p>
</div>
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

</div>
<p id="disclaimer">&copy; Copyright 2022-2023 Jelmer Smit<br>OVbuzz is niet geassocieerd met de openbare vervoerders in
    de Benelux.<br>OVbuzz stelt slechts een website beschikbaar waarop de dienstregelingen
    van de Nederlandse openbaar vervoerders te zien zijn.<br>OVbuzz maakt gebruik van GTFS data
    van, maar is niet geassocieerd met OVapi B.V.</p>

<?php

include __DIR__ . "/../templates/footer.php";

?>