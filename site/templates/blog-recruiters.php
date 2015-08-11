<?php snippet('header') ?>
<link rel="stylesheet" href="/blog/an-open-letter-to-technical-recruiters/styles.css" />
<div class="outside recruiters">
	
<nav class="cf">
	<ul>
		<li class="logo"><em>from the desk of</em> <a href="/" title="home">Ted Goas</a></li>
		<li><a href="/blog" title="blog" class="archive"><span>&#11013;</span> More Articles</a></li>
	</ul>
</nav>
<div id="wrapper">
<article>
  <header>
    <div id="meta">This message was sent on <time datetime="@date" pubdate="pubdate"><?php echo $page->date('F d, Y') ?></time>.</div>
    <span id="to">Technical recruiters who aren't trying that hard</span>
    <h1><?php echo $page->title()->html() ?></h1>
  </header>
  <div id="email" role="main">
	  <?php echo $page->text()->kirbytext() ?>
  </div>
  <footer id="emailBottom">
  	<p class="green"><img src="/blog/an-open-letter-to-technical-recruiters/green.png" height="17" width="18">Please consider the environment before printing this email.</p>
  	<p>This communication is for informational purposes only. It is not intended as an official confirmation and/or an "offer and acceptance" with respect to loan or any other business terms. Please do not rely on this email (or this email chain) as creating a binding agreement of any kind, including, without limitation, a commitment for financing, the terms of which may be subject to further bank approval and/or the execution of formal documentation. This message and any attachments contain confidential or privileged information which is intended for the recipient named above. If you are not the intended recipient, any disclosure, copying, use, or distribution of the information included in this message and any attachments is prohibited. If you have received this communication in error, please notify us by reply e-mail and immediately and permanently delete this message and any attachments. </p>
  </footer>
</article>
</div>


</div>
<?php snippet('footer') ?>