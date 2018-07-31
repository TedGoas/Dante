<?php snippet('page-begin') ?>
	<div class="flex">
		<div class="home-intro p-relative z-50 bg-gray-1">
			<div class="p5">
				<div>
					<h1 class="fs-headline1">I’m a reliable product designer and front-end developer working on websites, applications, and HTML&nbsp;emails.</h1>
					<p class="fs-body2 lh-md">I believe design is about taking the complex and chaotic and making it accessible to people. I design things to be understandable, readable, responsive, and as fast as possible. Since 2001, I’ve been trying to create work that is cool enough to show my friends and honest enough to show my parents.</p>
				</div>
				<hr role="presentation" aria-role="hidden" class="hr hr-sm my5 bg-violet-2">
				<div class="mt5">
					<h2 class="fs-caption tt-uppercase ls-2 fc-light mb3">Currently</h2>
					<p>I work at Stack Overflow creating better workflows for over 50 million developers.</p>
					<div class="homepage-section-grid">
						<a href="/work/stack-overflow" class="card-homepage">
							<h3>Working @ Stack</h3>
							<p>How we design at Stack Overflow and a few notable projects.</p>
						</a>
						<a href="/work/stack-overflow-for-teams" class="card-homepage">
							<h3>Stack Overflow for Teams</h3>
							<p>Designing and iterating on a new product aimed at small-medium engineering teams.</p>
						</a>
						<a href="/work/stack-overflow-for-enterprise" class="card-homepage">
							<h3>Stack Overflow for Enterprise</h3>
							<p>Adapting Stack Overflow for large teams to share private, secure knowledge.</p>
						</a>
					</div>
				</div>
				<div class="mt5">
					<h2 class="fs-caption tt-uppercase ls-2 fc-light mb3">Before that</h2>
					<p>I worked at Canfield Scientific designing applications that help doctors run their practice and clinicians run their studies.</p>
					<div class="homepage-section-grid">
						<a href="/work/canfield-scientific" class="card-homepage">
							<h3>Working @ Canfield</h3>
							<p>How we designed at Canfield and a few notable projects.</p>
						</a>
						<a href="/work/canfield-scientific-clinical-services" class="card-homepage">
							<h3>Clinical Services</h3>
							<p>Designing a clinical web app that helps pharmaceutical companies organize trials.</p>
						</a>
						<a href="/work/canfield-scientific-site" class="card-homepage">
							<h3>Canfield Scientific</h3>
							<p>Navigating company politics to create a first-in-class corporate site.</p>
						</a>
					</div>
				</div>
				<div class="mt5">
					<h2 class="fs-caption tt-uppercase ls-2 fc-light mb3">Off Hours</h2>
					<p>I maintain <a href="http://tedgoas.github.io/Cerberus/">Cerberus</a>, <a href="/work/email-design">help folks with emails</a>, and <a href="/blog">occasionally blog</a>:</p>
					<div>
						<?php foreach(page('blog')->children()->visible()->flip()->limit(3) as $article): ?>
						<div>
							<a href="<?php echo $article->url() ?>" class="card-homepage">
								<h3><?php echo $article->title()->html() ?></h3>
								<p><?php echo $article->description()->html() ?></p>
							</a>
						</div>
						<?php endforeach ?>
					</div>
				</div>
				<div class="mt5">
					<h2 class="fs-caption tt-uppercase ls-2 fc-light mb3">When Not Working</h2>
					<p>I enjoy family time with my wife and kids, live music, snowboarding, hockey, soccer, Newcastle Ale, and Troy McClure quotes.</p>
				</div>
			</div>
		</div>
		<div class="home-photo">
			<img src="/assets/images/ted-home.jpg" alt="ted-home" width="650" height="1110">
		</div>
	</div>
<?php snippet('page-end') ?>