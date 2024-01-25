<?php

include __DIR__ . "/../templates/header.php";

?>

<h1>Welkom bij TransferiumOV</h1>
<p>Dit is jouw reisplanner voor het openbaar vervoer in Nederland.
    Zoek jouw halte op met de zoekbalk hieronder. Je kunt ook een
    bepaalde lijn opzoeken door het zoektype te veranderen met het menu
    links van de zoekbalk.</p>
<p id="betaWarning"><b>TransferiumOV is in béta.</b> Op dit moment laat TransferiumOV je dus alleen de geplande dienstregeling zien.
    Wil je een echte reis plannen? Gebruik dan <a href="https://9292.nl/">9292.nl</a>
    want TransferiumOV laat niet zien of voertuigen uitvallen of vertraging hebben.
    Later zal TransferiumOV dit wel kunnen, en ook komt er een reisplanner waarin je
    super gemakkelijk je reis kunt plannen.<br><br>
    TransferiumOV is nu al beschikbaar om je kennis te laten maken met deze website.
    Langzamerhand zullen er meer functies toegevoegd worden om het compleet te maken.
    <a href="/toekomst">Kijk hier wat er nog aan komt</a></p>
<noscript>Sommige functionaliteiten van TransferiumOV kunnen mogelijk niet werken
als je browser JavaScript niet ondersteunt of niet aan heeft staan.<br></noscript>

<form action="/zoeken" method="get">
    <select id="searchOption" name="type">
        <option value="stop" selected>Halte/station</option>
        <option value="route">Lijn</option>
    </select>
    <input id="query" name="query" type="text" placeholder="Zoeken">
    <button type="submit" id="searchBtn" disabled>Zoeken</button>
</form>
<!--<br><textarea id="output"></textarea>--><br>

<?php

include __DIR__ . "/../templates/footer.php";

?>
