<?php

include __DIR__ . "../templates/header.php";

?>

<h1>Welkom bij TransferiumOV</h1>
<p>BAHAA DE SITE MOET HELEMAAL VERANDERD WORDEN MET PHP EN DE NIEUWE NAAM!!!!</p>
<p>Dit is jouw reisplanner voor het openbaar vervoer in Nederland.
    Zoek jouw halte op met de zoekbalk hieronder. Je kunt ook een
    bepaalde lijn opzoeken door het zoektype te veranderen met het menu
    links van de zoekbalk.</p>
<p>Op dit moment laat OVbuzz je alleen de geplande dienstregeling zien.
    Wil je een echte reis plannen? Gebruik dan <a href="https://9292.nl/">9292.nl</a>
    want OVbuzz laat niet zien of voertuigen uitvallen of vertraging hebben.
    Later zal OVbuzz dit wel kunnen, en ook komt er een reisplanner waarin je
    super gemakkelijk je reis kunt plannen.</p>
<noscript>Je hebt JavaScript nodig om OVbuzz te gebruiken!
    Check of JavaScript aan staat in je browser of dat
    je browser het ondersteunt.<br></noscript>
<select id="searchOption">
    <option value="stop" selected>Halte/station</option>
    <option value="route">Lijn</option>
</select>
<input id="query" type="text" placeholder="Zoeken"></input>
<button id="searchBtn" disabled>Zoeken</button>
<!--<br><textarea id="output"></textarea>--><br>
<div id="searchResults"></div>

<?php

include __DIR__ . "../templates/footer.php";

?>
