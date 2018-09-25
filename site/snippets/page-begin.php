<!DOCTYPE html>
<!--
             `.`       /`  ```````````````
        ````....`....`````````.`     `-..`                  ``:
/```............                     `...`             /`..``.-.`
``````    ....                      ....`           ``...`    `..`
         `...`                      ...`           ....`       `
        `....                      `...          `...`
        .../       `              `...         `...`                                 ```        ```
       ....    ``../`     ``..........        ....`                   ````      ````...`  `........
       ...`   ......`    ....`......-        ....           `...`   `......````..``...` `....```
      ...`  :......`   -....   .....        ....         ``.....` `......-.....` /...` ....`
      ..:-  -..```   `....`  `.....`       ....`        `..` ...``...` `.-``..```-...` ....````
     ...`  ...`    `.....- `...`...`      `...`     .-`.`   `..` ...- `..- .....-...`   ``.......`
    :-..   ....  `..``...`...` `..`       ....`   ``-.`    `... `...`....`  ````:..`   `..````...`
    ...`    `....``    ````    ...`       `..````..``     `..`   ......`         ..`  .......``.
    `.`                        ..-.       `......`      ``..`                    ```
     `                         ..`          ``   ```   `...
                                                `.. ``...`
                                               ....-:..
                                               ``..``

-->
<html lang="en">
<head>
	<meta charset="UTF-8">
	<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
	<meta name="viewport" content="width=device-width">
	<meta http-equiv="cleartype" content="on">
	<link rel="dns-prefetch" href="//www.google-analytics.com">
	<title><?php echo $page->title() ?> &infin; Ted Goas</title>
	<meta name="description" content="<?php echo $page->description()->html() ?>">
	<link type="text/plain" rel="author" href="http://www.tedgoas.com/humans.txt">
	<?php echo css('assets/css/global.css') ?>
	<link href="https://fonts.googleapis.com/css?family=Permanent+Marker" rel="stylesheet">

	<?php foreach($page->code()->filterBy('extension', 'css') as $css): ?>
		<?php echo css($css->url()) ?>
	<?php endforeach ?>

	<link rel="alternate" type="application/rss+xml" href="<?php echo url('blog/feed') ?>" title="Blog Feed">
	<link rel="canonical" href="<?php echo kirby()->request()->url() ?>">
	<link rel="meta" type="application/rdf+xml" title="Dublin" href="http://www.tedgoas.com/dublin.rdf">

	<?php if($image = $page->image()): ?>
		<meta property="og:image" content="<?php echo $image->url() ?>">
		<meta name="twitter:image:src" content="<?php echo $image->url() ?>">
	<?php endif ?>
	<meta property="og:author" content="https://www.twitter.com/tedgoas">
	<meta property="og:type" content="article" />
	<meta name="twitter:card" content="summary_large_image">
	<meta property="og:title" content="<?php echo $page->title()->html() ?>">
	<meta name="twitter:title" content="<?php echo $page->title()->html() ?>">
	<meta property="og:description" content="<?php echo $page->description()->html() ?>">
	<meta name="twitter:description" content="<?php echo $page->description()->html() ?>">
	<meta name="twitter:domain" content="tedgoas.com">
	<meta name="twitter:site" content="@tedgoas">
	<meta name="twitter:creator" content="@tedgoas">
	<meta property="og:site_name" content="Ted Goas's sites">
	<meta property="og:url" content="<?php echo kirby()->request()->url() ?>">
	<meta name="p:domain_verify" content="f0ba8ac9c9222a104dfc0fc75aad2d6b">
</head>
<body class="<?php echo $page->slug() ?> <?php echo $page->parents() ?>">
	<div class="body">
		<header role="header" class="header px3 pt4 pb5">
			<div class="mb4 lh-sm flex ai-end gsx gs3 logo">
				<div class="flex-cell p-relative" style="top: 13px;">
					<a href="/"><?php snippet('tg-sig-logo') ?></a>
				</div>
				<p class="flex-cell mb0 role">Senior Product Designer working remotely at Stack Overflow</p>
			</div>
			<div role="navigation" class="navigation flex ff-row-wrap">
				<a href="/" title="Home" class="td-none d-block p2 -home">Home</a>
				<a href="/work" title="Portfolio + Case Studies" class="td-none d-block p2 -work">Work</a>
				<a href="/what-i-do" title="Skills + Interests" class="td-none d-block p2 -what-i-do">What I Do</a>
				<a href="/bio" title="About Me" class="td-none d-block p2 -bio">A Short Bio</a>
				<a href="/contact" title="Drop Me a Line" class="td-none d-block p2 -contact">Contact</a>
				<a href="/blog" title="Articles" class="td-none d-block p2 -blog">Blog</a>
			</div>
		</header>
		<div class="main">