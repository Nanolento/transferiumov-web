<!DOCTYPE html>
<html>
<head>
    <!-- Mobile friendly -->
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?= $page_title ?></title>
    <link rel="stylesheet" href="style.css"/>

    <!-- Inter font -->
    <link rel="preconnect" href="https://rsms.me/">
    <link rel="stylesheet" href="https://rsms.me/inter/inter.css">

    <!-- JQuery -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.5.1/jquery.min.js" integrity="sha512-bLT0Qm9VnAYZDflyKcBaQ2gg0hSYNQrJ8RilYldYQ1FxQYoCLtUjuuRuZo+fjqhx/qtq/1itJ0C2ejDxltZVFg==" crossorigin="anonymous" referrerpolicy="no-referrer"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/bootstrap/4.6.1/js/bootstrap.min.js" integrity="sha512-UR25UO94eTnCVwjbXozyeVd6ZqpaAE9naiEUBK/A+QDbfSTQFhPGj5lOR6d8tsgbBk84Ggb5A3EkjsOgPRPcKA==" crossorigin="anonymous" referrerpolicy="no-referrer"></script>
    <!-- Main script -->
    <script type="application/javascript" src="main.js"></script>

</head>
<body>
<header>
    <a href="/"><img alt="TransferiumOV logo" title="TransferiumOV" src="logo.png" width=188 height=52 /></a>
    <span id="betaHeader"><?php if (isset($slogan)) { echo $slogan; } ?></span>
    <!-- navigation bar goes here -->
</header>
<div id="content">