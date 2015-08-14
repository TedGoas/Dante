<?php snippet('header') ?>
<div class="body">
	<div class="outside work-hero">
		<h1 class="work-hero-h1"><?php echo $page->title()->html() ?></h1>
	</div>
	<div class="outside work-section work-section-intro">
		<div class="inside inside--centered">
			<p class="work-section-intro-p narrow-width">
				<?php echo $page->summary()->html() ?>
			</p>
		</div>
	</div>
	
	<div class="outside work-section work-section--faint work-section-styleguide">
		<div class="inside inside--centered">
			<img src="/assets/images/work/clinical-services/style-guide.png" alt="color pallete and PT Sans font stack" width="713" height="225">
		</div>
	</div>
	
	<div class="outside work-section work-section-approach">
		<div class="inside">
			<div class="work-section-header">
				<h2 class="caps">My Approach</h2>
			</div>
			<div class="narrow-width dual-paragraphs">
				<div class="uk-grid">
					<div class="uk-width-1-2">
						<p>When we started, a bare-bone version of the app already existed, so we had the benefit of analytics and users to help our research.</p>
					</div>
					<div class="uk-width-1-2">
						<p>Our team combed through analytics, conducted user interviews, and prototyped new ideas for new interface patterns and functionality. I led several design reviews with wireframes and Photoshop mockups, but quickly moved into the browser and started designing with real data. This helped us uncover the weaknesses in the design and quickly find the blind spots.</p>
					</div>
				</div>
			</div>
		</div>
		<div class="figure flush-bottom">
			<img src="/assets/images/work/clinical-services/wireframe.jpg" alt="Evolution of the dashboard design">
		</div>
	</div>
	
	<div class="outside work-section work-section--white-text work-section-challenge1">
		<div class="inside">
			<div class="work-section-header">
				<strong class="byline">Challenge No. 1</strong>
				<h2 class="caps">This Was My First Large Business App</h2>
			</div>
			<div class="narrow-width dual-paragraphs">
				<div class="uk-grid">
					<div class="uk-width-1-2">
						<p>This was the first large product I helped design, iterate, and bulletproof. The app has just a handful of screens, but each one has a seemingly infinite number of states, edge cases, and blank slate screens.</p>
					</div>
					<div class="uk-width-1-2">
						<p>Things like oversized photos, missing text fields, and long file names would often break layouts and force us to adapt. I worked with the engineers, project managers, and quality control team to surface bugs and verify their fixes using our device lab and virtual machines (old IE versions).</p>
					</div>
				</div>
			</div>
			<figure class="figure figure-center">
				<img src="/assets/images/work/clinical-services/segmented-bar-graph.png" alt="Segmented Bar Graph">
			</figure>
		</div>
	</div>
	
	<div class="outside work-section work-section-challenge2">
		<div class="inside">
			<div class="work-section-header">
				<strong class="byline">Challenge No. 2</strong>
				<h2 class="caps">Browser Support ++</h2>
			</div>
			<div class="narrow-width dual-paragraphs">
				<div class="uk-grid">
					<div class="uk-width-1-2">
						<p>I had some prior experience fixing browser bugs, but I really submerged myself in it for this project. In supporting everything from the retina iPads down to Internet Explorer 6, I gained a deep understanding of legacy browser capabilities and graceful degradation.</p>
					</div>
					<div class="uk-width-1-2">
						<p>The app also makes heavy use of print stylesheets. Every page prints clearly. Even the modal windows. Even in IE6.</p>
					</div>
				</div>
			</div>
			<div class="uk-grid">
				<div class="uk-width-1-2">
					<figure class="figure figure-center">
						<img src="/assets/images/work/clinical-services/browser-chrome.jpg">
						<figcaption class="caption caption--border">Modern Chrome on Windows 7</figcaption>
					</figure>
				</div>
				<div class="uk-width-1-2">
					<figure class="figure figure-center">
						<img src="/assets/images/work/clinical-services/browser-ie7.jpg">
						<figcaption class="caption caption--border">Internet Explorer 7 on Windows XP</figcaption>
					</figure>
				</div>
			</div>
		</div>
	</div>
	
	<div class="outside work-section work-section--white-text work-section-ship">
		<div class="inside">
			<div class="work-section-header">
				<strong class="byline">How It Turned Out</strong>
				<h2 class="caps">Launching and Maintenance</h2>
			</div>
			<div class="narrow-width dual-paragraphs">
				<div class="uk-grid">
					<div class="uk-width-1-2">
						<p>In the weeks after the launch, we received an overwhelmingly positive response from our clients. Comments ranged from “the website is more useful now” to “the website is simply a pleasure to use”. Someone even referred to it as the “Cadillac” of clinical websites.</p>
					</div>
					<div class="uk-width-1-2">
						<p>One of the most rewarding aspects of working on this app is that it's evolving. We work on it every month and I'm helping guide its course.</p>
					</div>
				</div>
			</div>
			<figure class="figure figure-center">
				<img src="/assets/images/work/clinical-services/data-table.png" alt="Data Table">
			</figure>
		</div>
	</div>
	
	<div class="outside work-section work-section-learn">
		<div class="inside">
			<div class="work-section-header">
				<h2 class="caps">What I Learned</h2>
			</div>
			<div class="work-section-learn-text">
				<div class="uk-grid uk-grid-large">
					<div class="uk-width-1-2">
						<strong class="work-section-learn-title">Designing with Data</strong>
						<p>This was the first time I designed a complex, data-driven app. It was a learning experience organizing the information architecture tasks and choosing the <em>right</em> data visualizations. Stephen Few's <a href="http://smile.amazon.com/dp/0596100167">Information Dashboard Design</a> will always have a place on my desk.</p>
					</div>
					<div class="uk-width-1-2">
						<strong class="work-section-learn-title">Scalable, Fast-Loading Interface</strong>
						<p>This is jobs-to-be-done app, which motivated us to make it fast (as if we needed a reason). I was responsible for reducing the # of requests and DNS lookups, optimizing load order, and creating a caching schema.</p>
					</div>
				</div>
				<div class="th-article">
					<a href="/blog/designing-for-medical" class="th-article-a">
						<img src="/assets/images/th-article-medical.jpg" alt="Designing for Medical" class="th-article-img">
						<strong class="th-article-title">Related Article</strong>
						<p class="th-article-p">I wrote a blog post about my experience designing for medical. The principles within guided many of my design decisions.
							<span class="th-article-link">Read It</span>
						</p>
					</a>
				</div>
			</div>
		</div>
	</div>

<?php snippet('work-navigation') ?>
</div>
<?php snippet('footer') ?>