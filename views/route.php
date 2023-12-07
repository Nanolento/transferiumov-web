<?php
include __DIR__ . "/../templates/header.php";
?>
<h2 id="tl_head"><?= $page_header ?></h2>
<p><b>Waarschuwing</b>: Experimentele functie</p>
<div id="routeTableContainer">
    <table class="rt_table">
        <?= $route_table ?>
    </table>
</div>
<?php
include __DIR__ . "/../templates/footer.php";
?>
