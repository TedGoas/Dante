<?php snippet('page-begin') ?>
<article class="work-detail">
	<h1><?php echo $page->title()->html() ?></h1>
	<p><?php echo $page->summary()->html() ?></p>

	<figure>[theming refactor illustration]</figure>
	<p>Stack Overflow Enterprise is a stand-alone, private instance of Stack Overflow for organizations with large engineering teams.</p>
	<figure>[Fake Theme (or can we use real clients?)]</figure>
	<p>Lots of developers trust Stack Overflow and THE place to learn, share, and get answers to their programming questions. However Stack Overflow is default public, so folks can’t ask questions containing sensitive or proprietary data. Stack Overflow for Enterprise is a private, secure version of Stack Overflow for large teams to ask and answer questions amongst themselves.</p>
	<p>My role as product design is two fold:</p>
	<p>Create features to Enterprise (mostly focused on privacy and community management).</p>
	<p>Ensure work on “public Stack Overflow” accounts for Enterprise use cases so we maintain feature parity with the rest of the site.</p>
	<h2>Themes</h2>
	<p>Data security and privacy are top concerns of Enterprise users. In many cases, folks have their Enterprise site open in one tab and public Stack Overflow open in another. It’s important for folks to know where they are at a glance so they don’t post info in the wrong place. We provide every Enterprise client with a unique, branded theme to help ensure folks that they’re in a safe place.</p>
	<figure>[diagram of options]</figure>
	<p>The first major project I took on when I started at Stack Overflow was to create a scalable system that allows us to customize Stack Overflow’s look and feel for current and future enterprise clients. I removed redundant LESS and I refactored LESS variables so they could be overridden by a single line of code. (Eg. gathering all the various definitions of links and assigning them something like `color: @enterprise-link-color`.) This theming system allows us to create new themes in as little as eight lines of LESS.</p>
	<figure>[code example]</figure>
	<p>Spinning up a new theme takes about 15 minutes (most of which is spent searching for logos in vector format) and paves the way for allowing admins to update their theme using a web interface (without touching the file system).</p>
	<h2>Community Management</h2>
	<p>Stack Overflow is default public and roles can only be earned through activity, and that doesn’t jive well for a company discussing proprietary information. So we designed a suite of tools that allow clients to manage their own instance. Who is allowed in, who can see what, who can perform certain actions, that sorta thing.</p>
	<figure>[Research docs, manage users table]</figure>
	<p>We regularly speak with our Enterprise clients, so we scheduled several interviews to understand their workflow and requirements. We learned everything from how they manage their own teams to the terms they use at work. Armed with this research, we tested several prototypes using Invision and Google Hangouts until we narrowed on </p>
	<h2>Tag Watching</h2>
	<p>Not all work</p>
	<figure>[Tag Watching flow]</figure>
</article>
<?php snippet('page-end') ?>