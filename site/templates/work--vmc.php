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
			<img src="/assets/images/work/vmc/style-guide.png" alt="color pallete and source sans pro font stack" width="713" height="225">
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
						<p>When we started out, honestly I didn’t know exactly what we were building. So I resorted to low-fidelity, low-risk prototypes using whiteboards and Balsamiq wireframes. This paid off, as we wireframed about eight versions of the interface and feature set before things began falling into place.</p>
					</div>
					<div class="uk-width-1-2">
						<p>As the product vision began to crystalize, I moved to a combination of Photoshop and designing in the browser. Throughout the design process, I led presentations, organized feedback from product demos, and prioritized resulting design UI work.</p>
					</div>
				</div>
			</div>
		</div>
		<div class="figure flush-bottom">
			<img src="/assets/images/work/vmc/wireframe.jpg">
		</div>
	</div>
	
	<div class="outside work-section work-section--white-text work-section-challenge1">
		<div class="inside">
			<div class="work-section-header">
				<strong class="byline">Challenge No. 1</strong>
				<h2 class="caps">The Feature Set Grew A Lot During the Project</h2>
			</div>
			<div class="narrow-width dual-paragraphs">
				<div class="uk-grid">
					<div class="uk-width-1-2">
						<p>We had a number of major insights late in the project that required us to make large, destabilizing changes to the UI. Many of these surfaced as we built the admin area. “How does a doctor delegate certain responsibilities to her staff?” We didn’t anticipate that one from the start.</p>
					</div>
					<div class="uk-width-1-2">
						<p>We already had a lot of tech running in the browser, so moments like this were hard to overcome. Much of this work fell to the back-end developers, so I reused UI patterns wherever possible to keep the complexity as low as possible. I then worked with our QA team to catch any front-end bugs and verify my fixes.</p>
					</div>
				</div>
			</div>
			<div class="uk-grid">
				<div class="uk-width-1-2">
					<figure class="figure figure-center">
						<img src="/assets/images/work/vmc/visia.jpg" alt="Interactive 3D Image Viewer">
						<figcaption class="caption caption--border">Image Viewing: lots of features added.</figcaption>
					</figure>
				</div>
				<div class="uk-width-1-2">
					<figure class="figure figure-center">
						<img src="/assets/images/work/vmc/analytics.jpg" alt="Doctor Analytics">
						<figcaption class="caption caption--border">Analytics: not part of the original plan.</figcaption>
					</figure>
				</div>
			</div>
		</div>
	</div>
	
	<div class="outside work-section work-section-challenge2">
		<div class="inside">
			<div class="work-section-header">
				<strong class="byline">Challenge No. 2</strong>
				<h2 class="caps">Unpredictable UI's</h2>
			</div>
			<div class="narrow-width dual-paragraphs">
				<div class="uk-grid">
					<div class="uk-width-1-2">
						<p>Another challenge was the number of configurations each screen needed to accommodate. What does a consultation with no data look like? What if a patient visits multiple doctors? Depending what’s enabled for any given login, the UI was quite unpredictable.</p>
					</div>
					<div class="uk-width-1-2">
						<p>As we worked through our milestones, blind spots began to rear their ugly heads. We had to be equally mindful of scenarios when “everything is turned on” and ones with almost everything turned off.</p>
					</div>
				</div>
			</div>
			<figure class="figure figure-center">
				<img src="/assets/images/work/vmc/education.jpg">
				<figcaption class="caption caption--border">Education Section: May be there, might not. Might have one chapter, might have 15.</figcaption>
			</figure>
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
						<p>Our milestones were usually tied to trade shows, client meetings, and other immovable dates. We were always prepared to ship a stable version of the product around these dates and watched closely as new clients signed up and new features made it into the wild.</p>
					</div>
					<div class="uk-width-1-2">
						<p>As more practices began using the app, my role to tapered off. The front-end was pretty modular and a style guide was in place, so the engineers were able to reuse existing markup blocks to create new views without my involvement.</p>
					</div>
				</div>
			</div>
		</div>
		<img src="/assets/images/work/vmc/admin-perspective.jpg" class="figure-full-bleed">
	</div>
	
	<div class="outside work-section work-section-learn">
		<div class="inside">
			<div class="work-section-header">
				<h2 class="caps">What I Learned</h2>
			</div>
			<div class="work-section-learn-text">
				<h3>UI Should Be Clear and Flexible</h3>
				<p>As the product grew, I began to anticipate edge cases. I learned not to be cute with navigation in a medical app like this. However good it looks in Photoshop, it’s going to look different when populated with real data. And there is simply no icon for “anthropometric”, so don’t even try that fancy icon menu. It won’t scale.</p>
				<h3>Dark UI Brings Out Skin Tones</h3>
				<p>I started out with a light color palette, but we learned that a dark interface is better at highlighting skin tones and features. Since this is a big part of what Canfield does, I’ve begun porting this design language into other projects.</p>
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
<?php snippet('work-navigation') ?>
</div>
<?php snippet('footer') ?>