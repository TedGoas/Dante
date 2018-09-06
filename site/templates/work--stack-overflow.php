<?php snippet('page-begin') ?>
<article>
	<figure class="mb5">
		<img src="http://via.placeholder.com/900x400">
	</figure>
	<h1><?php echo $page->title()->html() ?></h1>
	<p>Since 2016, I’ve been a Sr. Product Designer at Stack Overflow, where I help create better workflows for over 50 million developers. Most of my work is focused on Stack Overflow for Enterprise, Stack Overflow for Teams, design systems, and anything related to email design. Most of Stack Overflow’s product and engineering teams, including myself, work remotely.</p>
	<figure class="outset my5">
		<img src="http://via.placeholder.com/900x400">
		<figcaption class="stuff">[Salary Calculator]</figcaption>
	</figure>
	<h2>How We Work</h2>
	<p>We follow a <a href="https://www.designcouncil.org.uk/news-opinion/design-process-what-double-diamond">double-diamond product development process</a>. From the early stages of each project, I work with product managers and engineers to create roadmaps, define scope, and write functional specs. From there, I lead design exploration and prototyping, playing a lead role in design critiques, demos, and user research sessions. We iterate until we narrow on a design direction. I help implement the designs in HTML / CSS (LESS) and work with the team to clarify any details or edge cases that come up along the way. The design and front-end are aided and informed by our design system.</p>
	<p>This is usually how it goes, though we frequently adapt as we move change projects and (sometimes) teams. We’re pretty flexible.</p>
	<figure class="outset my5">
		<img src="http://via.placeholder.com/900x400">
		<figcaption class="stuff">Sample of a 5% fun exercise, where designers take 60 minutes to brainstorm with no boundaries.</figcaption>
	</figure>
	<h2>A Typical Week</h2>
	<p>I spend about half my time on communication. Attending meetings on Google Hangouts, being present in chat, updating Trello cards, commenting on GitHub issues, etc. Even though Stack Overflow’s designers work on different parts of product, we’re in constant communication, ensuring we’re designing consistently across the product. We hop on video calls several times a week to plan work, review designs, brainstorm, or just hang out.</p>
	<p>Hmm, maybe I should talk about some <em>actual</em> work I’ve done...</p>
	<figure class="outset my5">
		<img src="http://via.placeholder.com/900x400">
		<figcaption class="stuff">Our <a href="https://stackoverflow.design/email/">Email design system</a></figcaption>
	</figure>
	<h2>A Few Notable Projects</h2>
	<p>When I joined Stack Overflow, we didn’t send much email aside from a few messages sent to active Q&A users and basic things like resetting a password. Email designs were inconsistent, templates were broken in many places, and outgoing emails were not tracked. I helped standardize our email design and rebuilt many of our templates so they display consistently across email clients. I also initiated <a href="https://stackoverflow.design/email/">Stack Overflow’s email design system</a> that empowers non-email-designers to build well-designed, consistently-rendered email without knowing all the ins-and-outs of email design.</p>
	<figure class="outset my5">
		<img src="http://via.placeholder.com/900x400">
		<figcaption class="stuff">I paired with another designer to redesign Stack’s email preferences</figcaption>
	</figure>
	<p>As our email program evolved and we started to send better-targeted emails, I helped redesign our email preference center to keep pace. My coworker and I <a href="https://medium.com/stack-overflow-design/designing-a-better-email-preference-center-4fddd44b91b5">wrote about our design goals</a> and <a href="https://medium.com/stack-overflow-design/stack-overflow-email-management-a-ux-case-study-964784da541b">published a UX case study</a> for this project.</p>
	<figure class="outset my5">
		<img src="http://via.placeholder.com/900x400">
		<figcaption class="stuff">Notes from user research sessions</figcaption>
	</figure>
	<p>One of the larger projects I worked on was the first version of <a href="https://stackoverflow.com/teams">Stack Overflow for Teams</a>. We built Teams (in part) because of the success of our Enterprise product. Stack Overflow for Enterprise is a private, secure version of Stack Overflow for large teams to ask and answer questions amongst themselves. Turns out large teams aren’t the only ones with this use case. During my time on the Teams... err… team, I helped research, prototype, design, test, and ship several features.</p>
	<figure class="outset my5">
		<img src="http://via.placeholder.com/900x400">
		<figcaption class="stuff">[Teams Content Identification Explorations]</figcaption>
	</figure>
	<p>We had a hunch that security would be a top concern for potential customers. As we started interviewing folks who’d expressed early interest, this hunch was quickly validated. Folks were concerned that private information might mistakenly end up on public Stack Overflow. This research showed us where we should be focusing our time and effort. Data privacy and security was a primary concern.</p>
	<figure class="outset my5">
		<img src="http://via.placeholder.com/900x400">
		<figcaption class="stuff">[Slack wireframe]</figcaption>
	</figure>
	<p>Another problem we faced was getting questions surfaced to the right people (either someone who needs an answer or someone who knows an answer). Stack Overflow is just one piece of a developer’s workflow, so if something important comes up, we’d like to meet them where they already are. We expanded our notifications, created the ability to @ping anyone in a team, and designed a Slack integration.</p>
	<figure class="outset my5">
		<img src="http://via.placeholder.com/900x400">
		<figcaption class="stuff">[Notifying, Search Autocomplete, Email, How Slack posts appear]</figcaption>
	</figure>
	<blockquote>
		<p>The value of a good question and answer exchange is not realized when the question is answered. Rather the true value is fulfilled later: when someone else references the Q&A exchange or when a subject matter expert doesn’t have to answer the same question again…</p>
	</blockquote>
	<p>Once users are able to continuously get the right answers on time, they’ll trust and value the product as a reliable, accurate source of information. That’s our theory. We’re currently working to make content more findable within Stack Overflow. We’re retooling our search, creating webhooks, and overhauling transactional emails. We work with our customer success team and frequently speak with customers to find ways to integrate Teams into our developers’ existing workflows.</p>
</article>
<?php snippet('page-end') ?>