<?php snippet('page-begin') ?>
	<section class="bbs-dashed-svg flex ai-stretch homepage">
		<div class="pl3 pr5 py5 brs-dashed-svg grid--cell8">
			<h1 class="fs-headline1">I’m a <span class="highlighted">reliable</span> product designer and front-end developer working on websites, applications, and HTML&nbsp;emails.</h1>
			<p class="fs-body2 lh-md mb0">I believe design is about taking the complex and chaotic and making it accessible to people. I design things to be understandable, readable, responsive, and as fast as possible. Since 2001, I’ve been trying to create work that is cool enough to show my friends and honest enough to show my parents.</p>
		</div>
		<div class="pr3 pl5 py5 grid--cell4">
			<img src="/assets/images/ted-home.jpg" alt="Ted Goas" width="300" height="400">
		</div>
	</section>
	<section class="bbs-dashed-svg flex ai-stretch homepage fd-rowreverse">
		<div class="pr3 pl5 py5 bls-dashed-svg grid--cell8">
			<h2 class="fs-caption tt-uppercase ff-display ls-2 fc-light mb3">Currently</h2>
			<p>I <a href="/work/stack-overflow">work at Stack Overflow</a> creating better workflows for over 50 million developers. I’ve worked on several parts of the product; these days I work mostly on <a href="/work/stack-overflow-for-enterprise">Stack Overflow for Enterprise</a> and <a href="https://stackoverflow.design/" rel="external">our design system</a>.</p>
			<h2 class="fs-caption tt-uppercase ff-display ls-2 fc-light mt5 mb3">Before that</h2>
			<p>I worked at <a href="/work/canfield-scientific">Canfield Scientific</a> designing applications that help doctors run their practice and clinicians run their studies. I’m particularly proud of <a href="/work/canfield-scientific-clinical-services">the Clinical Services site</a> I worked on.</p>
			<h2 class="fs-caption tt-uppercase ff-display ls-2 fc-light mt5 mb3">Off Hours</h2>
			<p>I <a href="/blog">occasionally blog</a>, maintain <a href="https://tedgoas.github.io/Cerberus/">Cerberus</a>, and occasionally <a href="/work/email-design">help folks with emails</a>.</p>
		</div>
		<div class="pl3 pr5 py5 grid--cell4">
			<img src="https://via.placeholder.com/300x400">
		</div>
	</section>
	<section class="flex ai-stretch homepage">
		<div class="pl3 pr5 py5 brs-dashed-svg grid--cell8">
			<h2 class="fs-caption tt-uppercase ff-display ls-2 fc-light mb3">Recent blog posts</h2>
			<?php foreach(page('blog')->children()->visible()->flip()->limit(5) as $article): ?>
			<div>
				<a href="<?php echo $article->url() ?>">
					<h4><?php echo $article->title()->html() ?></h4>
				</a>
			</div>
			<?php endforeach ?>
		</div>
		<div class="pr3 pl5 py5 grid--cell4">
			<h2 class="fs-caption tt-uppercase ff-display ls-2 fc-light mb3">When not working</h2>
			<p>I enjoy family time with my wife and kids, live music, snowboarding, hockey, soccer, Newcastle Ale, and Troy McClure quotes.</p>
		</div>
	</section>
<?php snippet('page-end') ?>