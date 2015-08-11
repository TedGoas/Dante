<?php snippet('header') ?>	
<div class="outside body">
	
	<div class="inside page-title page-title--flush-no-border">
		<h1 class="page-title-h1"><?php echo $page->title()->html() ?></h1>
		<ul class="page-title-ul">
			<li class="page-title-li">I'm a design generalist, but I can't do it all.</li>
		</ul>
	</div>
	
	<div class="skills-graph-container">
		<div class="skills-graph-container-inside inside">
			<div class="skills-graph-legend">
				<ul class="skills-graph-legend-ul">
					<li class="skills-graph-legend-li perceived-interest">
						Perceived Interest
					</li>
					<li class="skills-graph-legend-li vs">
						vs.
					</li>
					<li class="skills-graph-legend-li relative-skill">
						<div class="relative-skill-line"></div>
						Relative Skill
					</li>
				</ul>
			</div>
			<div class="skills-graph-graph">
				<div class="skills-graph-line">
					<img src="/assets/images/skill-graph-lines.png" width="825" height="100" class="skill-graph-lines">
				</div>
				<div class="skills-graph-bars">
					<div class="skills-graph-bar-container">
						<div class="skills-graph-bar skills-graph-bar--web"></div>
					</div>
					<div class="skills-graph-bar-container">
						<div class="skills-graph-bar skills-graph-bar--ui"></div>
					</div>
					<div class="skills-graph-bar-container">
						<div class="skills-graph-bar skills-graph-bar--htmlcss"></div>
					</div>
					<div class="skills-graph-bar-container">
						<div class="skills-graph-bar skills-graph-bar--js"></div>
					</div>
					<div class="skills-graph-bar-container">
						<div class="skills-graph-bar skills-graph-bar--cms"></div>
					</div>
					<div class="skills-graph-bar-container">
						<div class="skills-graph-bar skills-graph-bar--email"></div>
					</div>
					<div class="skills-graph-bar-container">
						<div class="skills-graph-bar skills-graph-bar--demos"></div>
					</div>
					<div class="skills-graph-bar-container">
						<div class="skills-graph-bar skills-graph-bar--lead"></div>
					</div>
				</div>
				<div class="skills-graph-labels">
					<div class="skills-graph-label">
						Web + Mobile <br class="hide-on-mobile">Design
					</div>
					<div class="skills-graph-label">
						Product + UI <br class="hide-on-mobile">Design
					</div>
					<div class="skills-graph-label">
						HTML <br class="hide-on-mobile">&amp; CSS
					</div>
					<div class="skills-graph-label">
						JavaScript <br class="hide-on-mobile">(jQuery)
					</div>
					<div class="skills-graph-label">
						CMS's <br class="hide-on-mobile">(no speciality)
					</div>
					<div class="skills-graph-label">
						Email <br class="hide-on-mobile">Design
					</div>
					<div class="skills-graph-label">
						Demos &amp; <br class="hide-on-mobile">Presentations
					</div>
					<div class="skills-graph-label">
						Leading Teams <br class="hide-on-mobile">&amp; Projects
					</div>
				</div>
			</div>
		</div>
	</div>
	
	<div class="inside">	
		<div class="narrow-width what-i-do-summary"><?php echo $page->text()->kirbytext() ?></div>
		
		<div class="narrow-width">
			<div class="uk-grid uk-grid-large">
				<div class="uk-width-1-2">
					<div class="line-list line-list--center">
						<h4 class="good">I Can Wrangle This Stuff</h4>
						<ul class="line-list-ul line-list-ul--center">
							<li class="line-list-li">Email Marketing</li>
							<li class="line-list-li">SEO &amp; Findability</li>
							<li class="line-list-li">Website Performance</li>
							<li class="line-list-li">Copywriting</li>
							<li class="line-list-li">Marketing Design</li>
						</ul>
					</div>
				</div>
				<div class="uk-width-1-2">
					<div class="line-list line-list--center">
						<h4 class="bad">This Stuff, Not So Much</h4>
						<ul class="line-list-ul line-list-ul--center">
							<li class="line-list-li">Back-End Programming</li>
							<li class="line-list-li">Print Design</li>
							<li class="line-list-li">Logo Design</li>
							<li class="line-list-li">SEO / PPC Campaigns</li>
							<li class="line-list-li">Social Media Mgmt</li>
						</ul>
					</div>
				</div>
			</div>
		</div>
	
	</div>
	
</div>
<?php snippet('footer') ?>