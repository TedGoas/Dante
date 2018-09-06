<?php snippet('page-begin') ?>
<article>
	<h1><?php echo $page->title()->html() ?></h1>
	<p><?php echo $page->summary()->html() ?></p>

	<figure>[illustration from landing page]</figure>
	<p>Stack Overflow for Teams is a private, secure home for your team’s questions and answers. It’s just like Stack Overflow, but private for individual teams.</p>
	<h2>Data Privacy</h2>
	<p>When we started building Teams, our theory was that folks would purchase Teams because they need a way to organize their private programming knowledge and they’re already comfortable with Stack Overflow. But there was one big problem: Stack Overflow has always been open and public. Not the ideal mantra for a team interesting in storing their sensitive data.</p>
	<figure>[Notes / interviews]</figure>
	<p>Our concern was quickly validated as we started interviewing folks who’d expressed interest in Teams. This research showed us where we should be focusing our time and effort. Data privacy and security was a primary concern.</p>
	<p>We didn’t want the design to stray too far from the familiar Stack Overflow experience, it’s REALLY important for users to know where they are at all times. Posting sensitive information in the wrong case could be distrarous, so we knew our design had to be clear at all times.</p>
	<figure>[Content Identification]</figure>
	<p>I prototyped and helped test several iterations of the content identification and messaging system. After several rounds of user testing, we converged on a single direction. As other teams began implementation, I designed a settings interface to allow team admins to update their team’s appearance.</p>
	<h2>Notifications</h2>
	<figure>[Mentioning / search autocomplete]</figure>
	<p>Another problem we faced was getting questions surfaced to the right people (either someone who needs an answer or someone who knows an answer). Stack Overflow is just one piece of a developer’s workflow, so if something important comes up, we’d like to meet them where they already are. We expanded our notifications, created the ability to @ping anyone in a team, and designed a Slack integration.</p>
	<figure>[Email / How Slack posts appear]</figure>
	<p>The value of a good question and answer exchange is not realized when the question is answered. Rather the true value is fulfilled later: when someone else references the Q&A exchange or when a subject matter expert doesn’t have to answer the same question again…</p>
	<p>We’re currently working to make content more findable within Stack Overflow. We’re retooling our search and tagging systems so they better surface specific pieces of content and keep them updated. Once users are able to continuously get the right answers on time, they’ll trust and value the product as a reliable, accurate source of information.</p>
	<figure>[Slack wireframe]</figure>
</p>
</article>
<?php snippet('page-end') ?>