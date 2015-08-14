<?php snippet('header') ?>
<div class="body">
	<div class="outside work-hero">
		<h1 class="work-hero-h1"><?php echo $page->title()->html() ?></h1>
	</div>
	<div class="outside work-section-intro">
		<div class="inside inside--centered">
			<p class="work-section-intro-p narrow-width"><?php echo $page->summary()->html() ?></p>
		</div>
	</div>
	
	<div class="outside work-section work-section--careers">
		<div class="inside">
			<div class="work-section-header">
				<h2 class="caps">Canfield Careers</h2>
			</div>
			<div class="narrow-width dual-paragraphs">
				<div class="uk-grid">
					<div class="uk-width-1-2">
						<p>This was a fun internal project for the company. When brainstorming ideas to increase awareness of our recruiting efforts, I suggested creating a company careers website to work in parallel with  <a href="http://www.canfieldsci.com/careers/">CanfieldSci’s Careers page</a>. I created a plan to create and manage the site, and sold it to management.</p>
					</div>
					<div class="uk-width-1-2">
						<p>Since this was a low-risk website, I used it as an opportunity to experiment with things I’d been reading about. I designed and coded a fancy mobile navigation, tinkered with SVG sprites, and thought through a few subtle interface animations (rather just just animating for animation’s sake). All great learning exercises when thinking about what’s appropriate for the next project.</p>
					</div>
				</div>
				<div class="site-link"><div class="unavailable">Currently In Development</div></div>
			</div>
			<div class="full-width-figure flush-bottom">
				<img src="/assets/images/work/canfield-misc/careers.jpg" height="800" width="1000" alt="alt">
			</div>
		</div>
	</div>
	
	<div class="outside work-section work-section--email">
		<div class="inside">
			<div class="work-section-header">
				<h2 class="caps">Email Design</h2>
			</div>
			<div class="narrow-width dual-paragraphs">
				<div class="uk-grid">
					<div class="uk-width-1-2">
						<p>I’m responsible for every email Canfield sends. We sent about marketing 20-25 emails a year, a mixture of promotional, loyalty, event, and digest emails. I work with stakeholders to design a concept for each email and code each for both desktop and mobile. I verify each design using my small device lab and Litmus, and finally schedule its deployment in Campaign Monitor.</p>
					</div>
					<div class="uk-width-1-2">
						<p>Our web products also send transactional emails for things like password reset and account confirmation. I write production-ready email code from the start so the engineers don’t have to worry about things like inlining CSS or replacing image references. I start by writing code for the shared parts like the header and footer, and then create a few patterns for the engineers to use when creating the various transactional email types.</p>
					</div>
				</div>
			</div>
			<div class="full-width-figure flush-bottom">
				<img src="/assets/images/work/canfield-misc/email-design.jpg" height="800" width="1000" alt="HTML Email Design and Development">
			</div>
		</div>
	</div>
	
	<div class="outside work-section work-section--white-text work-section--dermsummit">
		<div class="inside">
			<div class="work-section-header">
				<h2 class="caps">Derm Summit</h2>
			</div>
			<div class="narrow-width dual-paragraphs">
				<div class="uk-grid">
					<div class="uk-width-1-2">
						<p>I planned, designed, coded the website for each year of the Dermatology Summit Conference. I worked closely with the conference owners to create a concept for each year. While building and maintaining the site, I work with project managers and other designers to ensure all aspects of the conference (web, email, print, PR) are consistent and kept on the same schedule.</p>
					</div>
					<div class="uk-width-1-2">
						<p>This is different from everything else I work on at Canfield because I’m the only employee involved in this project. I work directly with the project managers (located in Atlanta and San Francisco) and build everything by myself without developer help, including staging the site and deploying to production.</p>
					</div>
				</div>
				<div class="site-link"><a href="http:/www.dermsummit.com">Visit the Site</a></div>
			</div>
			<div class="full-width-figure flush-bottom">
				<img src="/assets/images/work/canfield-misc/derm-summit.jpg" height="800" width="1000" alt="Derm Summit Conference homepage">
			</div>
		</div>
	</div>
	
	<div class="outside work-section work-section--findmyskincare">
		<div class="inside">
			<div class="work-section-header">
				<h2 class="caps">Find My Skincare</h2>
			</div>
			<div class="narrow-width dual-paragraphs">
				<div class="uk-grid">
					<div class="uk-width-1-2">
						<p>Most of Canfield’s marketing is geared towards pharmaceutical business, healthcare practitioners, and people who know the industry jargon. With Find My Skincare, though, I was challenged to explain Canfield’s complicated products in layman's terms and convince website visitors it’s worth choosing a doctor who has a Canfield product rather than one who doesn’t.</p>
					</div>
					<div class="uk-width-1-2">
						<p>This project was a good exercise in collaborative design and iteration. I worked with our copywriter through three site architectures, five sets of wireframes, four design concepts, and even a complete rebrand. Eventually we figured out how best to present our message on the website and how much to say without becoming overly technical or irrelevant to the average layperson. We paired this message with a search tool tied into Google Maps for people to find doctors in their area.</p>
					</div>
				</div>
				<div class="site-link"><div class="unavailable">Currently In Development</div></div>
			</div>
			<div class="full-width-figure flush-bottom">
				<img src="/assets/images/work/canfield-misc/find-my-skincare.jpg" height="800" width="1000" alt="Find My Skincare homepage">
			</div>
		</div>
	</div>
	
	<?php snippet('work-navigation') ?>
</div>
<?php snippet('footer') ?>