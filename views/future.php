<?php

include __DIR__ . "/../templates/header.php";

?>
<h1>Over TransferiumOV</h1>
<p>TransferiumOV is jouw ov-dashboard voor de concessies Frysl&acirc;n en Groningen-Drenthe.
Je kunt je reis plannen, dienstregelingen zien en statistieken bekijken.
Er zal informatie komen over de voertuigen, omlopen, lijnen en bijbehorende statistieken 
zullen ook beschikbaar zijn.</p>
<p id="betaWarning"><b>TransferiumOV is in pre-alpha.</b> De site is vroegtijdig gelanceerd.
Er zullen nog veel
dingen veranderen op deze site en veel van de functies die genoemd zijn zijn
er nog niet. Zie de toekomstsectie hieronder voor wat de plannen zijn.</p>

<h1>Changelog</h1>
<h2>Pre-Alpha 2 - <i>28-02-2024</i></h2>
<p>Bug met nachtritten opgelost, 01:00 verschijnt nu als 01:00 i.p.v. 25:00</p>
<h2>Pre-Alpha 1 - <i>28-02-2024</i></h2>
<p>Initiële lancering TransferiumOV.</p>
<h1>De toekomst van TransferiumOV</h1>
<p>TransferiumOV is in pre-alpha. Dit betekent dat niet alle functies zijn toegevoegd en
niet alle functies die er al zijn helemaal goed functioneren. Op deze pagina vind je
alles wat nog gaat worden toegevoegd aan TransferiumOV (volgens plan).</p>
<p>Hierondergenoemde 'huidige functies' zijn de functies die vanaf januari 2024 beschikbaar zijn.
De toekomstige functies zullen beschikbaar worden zodra ze klaar zijn. Deze pagina zal dan tevens
fungeren als changelog.</p>
<p>Huidige functies:
<ul>
    <li>Geplande dienstregeling</li>
    <li>Rittijden</li>
    <li>Ritinformatie</li>
    <li>Zoeken op lijn en halte</li>
</ul></p>
<p>Toekomstige functies:
<ul>
    <li>Routes van ritten</li>
    <li>Kaarten met hiervoorgenoemde routes en voertuigen</li>
    <li>Oude ritten bekijken*</li>
    <li>Reisplanner
    <ul>
        <li>Reis plannen van A naar B</li>
        <li>Filters, op:
        <ul>
            <li>Voertuigtype*</li>
            <li>Vervoerders*</li>
            <li>Type dienst, zoals het uitsluiten van belbussen*</li>
            <li>Haltes / buslijnen uitsluiten*</li>
        </ul></li>
        <li>Berekeningsmethoden, zoals snelst, goedkoopst, etc.</li>
        <li>Later mogelijk ook via bestemmingen (A via C naar B)</li>
    </ul></li>
    <li>Realtime-informatie, o.a.
    <ul>
        <li>Vertragingen</li>
        <li>Rituitval</li>
        <li>Nummer van bijbehorend voertuig van rit</li>
        <li>Aanpassingen aan rit</li>
    </ul></li>
    <li>Voertuigposities</li>
    <li>Voertuiginformatie*</li>
    <li>Mededelingen (nieuwe dienstregelingen, tijdelijke wijzigingen etc.)*</li>
    <li>Filters, op:
    <ul>
        <li>lijnnummer*</li>
        <li>vervoerder*</li>
    </ul></li>
    <li>Favoriete lijnen/ritten/haltes*</li>
    <li>Meldingen voor PWA?</li>
    <li>En mogelijk meer!</li>
</ul></p>
<p><i>* Functie exclusief voor concessiegebieden Frysl&acirc;n en Groningen-Drenthe.</i></p>

<?php

include __DIR__ . "/../templates/footer.php";

?>
