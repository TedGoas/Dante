<?php snippet('page-begin') ?>
<article class="work-detail">
	<h1><?php echo $page->title()->html() ?></h1>
	<p><?php echo $page->summary()->html() ?></p>

	<figure>[image]</figure>
	<p>Canfield’s clinical web app helps pharmaceutical companies organize trials and track their progress. Existing workflows involved fax machines, snail mail, the phone, and email. Our goal was to bring everything online in a first class experience.</p>
	<p>A bare-bones version of an app existed, so we started by reviewing analytics and interviewing users. This got us prototyping new workflows, which we’d review internally in design critiques that I’d organize and lead. I started with wireframes, moved into Photoshop, and later wrote HTML/CSS so we could design with real data. This helped us uncover and improve the design’s weaknesses and blind spots.</p>
	<figure>[image]</figure>
	<p>The app had just a handful of screens, but each one included numerous states and edge cases. Things like oversized photos, missing text fields, and long file names would often break layouts and force us to adapt. I worked with the engineers, project managers, and quality control team to monitor the app's usage, surface bugs, and verify fixes using a small device lab and virtual machines for browser testing.</p>
	<figure>[image]</figure>
	<p>I had some prior experience fixing browser bugs, but I really submerged myself in it on this project. In supporting everything from the retina iPads down to Internet Explorer 6, I gained a deep understanding of browser capabilities and graceful degradation. The app also makes heavy use of print stylesheets. Every page prints clearly. Even the popups. Even in IE6.</p>
	<figure>[image]</figure>
	<p>After launch, we received an overwhelmingly positive response from our clients. Comments ranged from “the website is more useful now” to “the website is simply a pleasure to use”. Someone even referred to it as the “Cadillac” of clinical websites.</p>
	<figure>[image]</figure>
	<p>This was the first time I designed a complex, data-driven app. It was a learning experience organizing the information architecture, choosing the right data visualizations, and designing with rich data sets. Stephen Few's Information Dashboard Design will always have a place on my shelf.</p>
</article>
<?php snippet('page-end') ?>