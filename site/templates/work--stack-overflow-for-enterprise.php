<?php snippet('page-begin') ?>
<article>
	<h1><?php echo $page->title()->html() ?></h1>
	<p class="">Stack Overflow Enterprise is a private instance of Stack Overflow for organizations with large engineering teams. Stack Overflow for Enterprise is a private, secure version of Stack Overflow for large teams to ask and answer questions amongst themselves.</p>
	<figure class="my7">
		<img src="/assets/images/work/stack-overflow-enterprise/stack-enterprise-function.svg" alt="Enterprise function statement" height="300" width="1000">
		<figcaption class="stuff">How Stack Overflow for Enterprise is <a href="https://www.feltpresence.com/functions.html">like a function</a>.</figcaption>
	</figure>
	<h2>My Role</h2>
	<p>Lots of developers trust Stack Overflow and THE place to get answers to their programming questions, but since Stack Overflow is default public folks can’t always ask questions specific to their company or questions containing sensitive or proprietary data. My team takes core Stack Overflow and figures what should stay the same, what needs to change, and what should be added for our Enterprise clients.</p>
	<p>My role as product design is two fold:</p>
	<ol>
		<li>Create features specific to Stack Overflow Enterprise (usually tools to help folks optimize and manage their own community).</li>
		<li>Work with other product teams to ensure their work can be used in Enterprise (involves reviewing specs and adjusting designs).</li>
	</ol>
	<figure class="my7">
		<img src="/assets/images/work/stack-overflow-enterprise/stack-enterprise-theming.svg" alt="three enterprise theme designs" height="812" width="1000">
		<figcaption class="stuff">Stack Overflow themes can be customized.</figcaption>
	</figure>
	<h2>Themes</h2>
	<p>Data security and privacy are top concerns of Enterprise users. In many cases, folks have their Enterprise site open in one tab and public Stack Overflow open in another. It’s important for folks to know where they are at a glance so they don’t post info in the wrong place. One way we tackle this is to make a branded theme for every client.</p>
	<p>My first major project at Stack Overflow was to create a scalable system that allows us to customize Stack Overflow’s look and feel for current and future enterprise clients. I removed redundant LESS and I refactored LESS variables so they could be overridden. The resulting LESS architecture allows us to create new themes in as little as eight lines of code. Spinning up a new theme takes about 15 minutes.</p>
	<figure class="my7">
		<img src="/assets/images/work/stack-overflow-enterprise/stack-enterprise-less.png" alt="screenshot of LESS variables in a code editor" height="450" width="1000">
		<figcaption class="stuff">Diagram of an early theming system</figcaption>
	</figure>
	<p>This work paved the way for allowing admins to update their theme without editing any LESS/CSS. I researched, designed, and helped implement an interface for admins to preview and update the look and feel of their site. Not only does this give admins easier control over their site, but it removes theming from the file system (a minor security vulnerability if we ever mistakenly deployed a theme to the wrong client&nbsp;😬).</p>
	<h2>Community Management</h2>
	<p>The biggest difference between Stack Overflow and its Enterprise counterpart is that Enterprise instances are managed by a single organization (as opposed to Stack Overflow being managed by the collective public). Stack Overflow for Enterprise can be used any number of ways (including discussing proprietary information), so we designed a suite of tools that allow organizations to manage their own instance however they see fit. Who can log in, who can see what, who can perform certain actions, that sorta thing.</p>
	<figure class="my7">
		<img src="/assets/images/work/stack-overflow-enterprise/manage users.svg" alt="A data table of users that can be searched, sorted, and filtered." height="495" width="1000" class="bordered">
		<figcaption class="stuff">One of several ways an admin can manage her team's access and privileges.</figcaption>
	</figure>
	<p>My team regularly speaks with our Enterprise clients about their workflows. Sometimes we ask open-ended questions, while other times we watch them react to a prototype. I also work with our community management team, who work directly with clients and know what makes a Stack Overflow community succeed (and fail). We balance all this research and use it to inform our project requirements and design directions.</p>
	<h2>Tag Watching</h2>
	<p>Regarding the Q&A part of Stack Overflow for Enterprise, our goal is to keep the experience consistent with public Stack Overflow and Teams. I had this in mind when I redesigned the workflow for following and ignoring specific tags in Enterprise. I prototyped, tested, and iterated a few designs, noting the small adjustments (such as copy tweaks) we’d want to make when adapting the feature for different product areas.
	<figure class="outline my7">
		<img src="/assets/images/work/stack-overflow-enterprise/stack-enterprise-tag-watching.svg" alt="Tag Watching worflow diagram" height="1000" width="1000" class="bordered">
		<figcaption class="stuff">The workflow and UI that shipped in 2017-2018. It’s since been updated to match what’s on StackOverflow.com.</figcaption>
	</figure>
</article>
<?php snippet('page-end') ?>