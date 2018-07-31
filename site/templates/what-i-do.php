<?php snippet('page-begin') ?>

	<h1><?php echo $page->title()->html() ?></h1>

	<div class="skills-chart">
		<div class="inside">
			<div class="skills-chart-legend">
				<ul class="skills-chart-legend-ul">
					<li class="skills-chart-legend-li skills-chart-legend-li--interest">Perceived Interest</li>
					<li class="skills-chart-legend-li skills-chart-legend-li--skill">Relative Skill</li>
				</ul>
			</div>
			<div class="skills-chart-canvas">
				<canvas id="myChart" width="700" height="500"></canvas>
			</div>
		</div>
	</div>

	<div class="inside">
		<div class="uk-grid uk-grid-large">
			<div class="uk-width-1-2">
				<div class="what-i-do-summary">
					<p>I'm a highly adaptable designer best suited in teams where everyone can wear multiple hats. From scoping requirements to planning content – through design and development – collaborating with clients and co-workers is paramount. I prefer working with others and sharing regular updates rather than disappearing for long stretches and emerging with big surprises.</p>
				</div>
			</div>
			<div class="uk-width-1-2">
				<div class="what-i-do-summary">
					<p>My goal is to be a designer-manager hybrid. I enjoy hands-on work and having my own projects. On top of that, I’d like to mentor or manage a small team, making sure they’re happy, inspired, and successfully delivering for their clients. I’m interested in facilitating critiques, discussing new processes, designing exercises, helping with sales leads, and any other problems whether code or people.</p>
				</div>
			</div>
		</div>

		<div class="skills-detail-list skills-detail-list--good">
			<h4 class="skills-detail-title skills-detail-title--good">I Can Wrangle This Stuff</h4>
			<ul class="skills-detail-ul">
				<li class="skills-detail-li skills-detail-li--good">Information Architecture</li>
				<li class="skills-detail-li skills-detail-li--good">Mobile Design (iOS)</li>
				<li class="skills-detail-li skills-detail-li--good">Email Marketing</li>
				<li class="skills-detail-li skills-detail-li--good">Website Performance</li>
				<li class="skills-detail-li skills-detail-li--good">Source Control (Git, SVN)</li>
				<li class="skills-detail-li skills-detail-li--good">Copywriting</li>
				<li class="skills-detail-li skills-detail-li--good">SEO &amp; Findability</li>
			</ul>
		</div>
		<div class="skills-detail-list skills-detail-list--bad">
			<h4 class="skills-detail-title skills-detail-title--bad">This Stuff, Not So Much</h4>
			<ul class="skills-detail-ul">
				<li class="skills-detail-li skills-detail-li--bad">Back-End Programming</li>
				<li class="skills-detail-li skills-detail-li--bad">Print Design</li>
				<li class="skills-detail-li skills-detail-li--bad">Logo Design</li>
				<li class="skills-detail-li skills-detail-li--bad">Illustration</li>
				<li class="skills-detail-li skills-detail-li--bad">SEO / PPC Campaigns</li>
				<li class="skills-detail-li skills-detail-li--bad">Social Media Mgmt</li>
			</ul>
		</div>

	</div>

</div>
<script src="/assets/js/Chart.min.js"></script>
<?php snippet('page-end') ?>