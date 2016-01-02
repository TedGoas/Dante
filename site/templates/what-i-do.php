<?php snippet('header') ?>	
<div class="outside body">
	
	<div class="inside page-title page-title--flush-no-border">
		<h1 class="page-title-h1"><?php echo $page->title()->html() ?></h1>
	</div>
	
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
		<div class="uk-grid">
			<div class="uk-width-1-2">
				<div class="what-i-do-summary">
					<?php echo $page->text()->kirbytext() ?>
				</div>
			</div>
			<div class="uk-width-1-4">
	
				<div class="skills-detail-list">
					<h4 class="skills-detail-title skills-detail-title--good">I Can Wrangle This Stuff</h4>
					<ul class="skills-detail-ul skills-detail-ul--even">
						<li class="skills-detail-li">Information Architecture</li>
						<li class="skills-detail-li">Mobile Design (iOS)</li>
						<li class="skills-detail-li">Email Marketing</li>
						<li class="skills-detail-li">Website Performance</li>
						<li class="skills-detail-li">Source Control (Git, SVN)</li>
						<li class="skills-detail-li">Copywriting</li>
						<li class="skills-detail-li">SEO &amp; Findability</li>
					</ul>
				</div>
			</div>
			<div class="uk-width-1-4">
				<div class="skills-detail-list">
					<h4 class="skills-detail-title skills-detail-title--bad">This Stuff, Not So Much</h4>
					<ul class="skills-detail-ul skills-detail-ul--odd">
						<li class="skills-detail-li">Back-End Programming</li>
						<li class="skills-detail-li">Print Design</li>
						<li class="skills-detail-li">Logo Design</li>
						<li class="skills-detail-li">Illustration</li>
						<li class="skills-detail-li">SEO / PPC Campaigns</li>
						<li class="skills-detail-li">Social Media Mgmt</li>
					</ul>
				</div>
			</div>
		</div>
	
	</div>
	
</div>
<script src="/assets/js/Chart.min.js"></script>
<?php snippet('footer') ?>