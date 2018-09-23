<?php snippet('page-begin') ?>
<article>
	<h1><?php echo $page->title()->html() ?></h1>
	<p>Canfield’s clinical web app helps pharmaceutical companies organize trials and track their progress. Existing workflows involved fax machines, snail mail, the phone, and email. Our goal was to bring everything online in a first class experience.</p>
	<p>A bare-bones version of an app existed, so we started by reviewing analytics and interviewing users. This got us prototyping new workflows, which we’d review internally in design critiques that I’d organize and lead. I started with wireframes, moved into Photoshop, and later wrote HTML/CSS so we could design with real data. This helped us uncover and improve the design’s weaknesses and blind spots.</p>
	<figure class="my7">
		<img src="/assets/images/work/canfield-clinical-services/wireframe.jpg" width="1000" height="450" alt="alt_text" class="bordered">
		<figcaption class="stuff">The evolution of a clinical study subject dashboard</figcaption>
	</figure>
	<p>The app had just a handful of screens, but each one included numerous states and edge cases. Things like oversized photos, missing text fields, and long file names would often break layouts and force us to adapt. I worked with the engineers, project managers, and quality control team to monitor the app's usage, surface bugs, and verify fixes using a small device lab and virtual machines for browser testing.</p>
	<figure class="my7">
		<img src="/assets/images/work/canfield-clinical-services/segmented-bar-graph.png" width="1100" height="800" alt="segmented bar graph for clinical site visits" class="bordered">
		<figcaption class="stuff">Exploration for a data visualization for clinical site visits</figcaption>
	</figure>
	<p>I had some prior experience fixing browser bugs, but I really submerged myself in it on this project. In supporting everything from the retina iPads down to Internet Explorer 6, I gained a deep understanding of browser capabilities and graceful degradation. The app also makes heavy use of print stylesheets. Every page prints clearly. Even the popups. Even in IE6.</p>
	<figure class="my7 w100">
		<img src="/assets/images/work/canfield-clinical-services/browsers.jpg" width="1000" height="400" alt="site rendered in internet explorer 7 and chrome side by side">
		<figcaption class="stuff">Everything displayed and behaved consistently in all major browsers. Even Internet Explorer 6 &amp; 7.</figcaption>
	</figure>
	<p>After launch, we received an overwhelmingly positive response from our clients. Comments ranged from “the website is more useful now” to “the website is simply a pleasure to use”. Someone even referred to it as the “Cadillac” of clinical websites.</p>
	<figure class="my7">
		<img src="/assets/images/work/canfield-clinical-services/data-table.png" width="1100" height="800" alt="Data table design" class="bordered">
		<figcaption class="stuff">Exploration for a data table for visits</figcaption>
	</figure>
	<p>This was the first time I designed a complex, data-driven app. It was a learning experience organizing the information architecture, choosing the right data visualizations, and designing with rich data sets. Stephen Few's Information Dashboard Design will always have a place on my shelf.</p>
	<div class="w100 wmx5">
		<a href="/blog/designing-for-medical" class="card card-small">
			<img src="/assets/images/work/th-medical-design.png" alt="Designing for Medical" height="125" width="125">
			<div>
				<strong>Related Article</strong>
				I <span class="faux-link">wrote a blog post</span> about my experience designing for medical. The principles within guided many of my design decisions working on this project.
			</div>
		</a>
	</div>
</article>
<?php snippet('page-end') ?>