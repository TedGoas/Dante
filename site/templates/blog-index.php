<?php snippet('header') ?>
<div class="outside body">

	<div class="inside page-title">
		<h1 class="page-title-h1"><?php echo $page->title()->html() ?></h1>
		<ul class="page-title-ul">
			<li class="page-title-li"><a href="<?php echo url('blog/feed') ?>" title="RSS Feed" class="icon-social icon-social-rss"><i class="icon-rss"></i></a></li>
		</ul>
	</div>
	
	<div class="blog-index">
		<ul class="blog-index-ul">
			<?php foreach(page('blog')->children()->visible()->flip() as $article): ?>
			<li class="blog-index-li">
				<a href="<?php echo $article->url() ?>" class="blog-index-a link-dark">
					<span class="blog-meta blog-index-meta blog-meta--date blog-index-meta--date"><?php echo $article->date('F d, Y') ?></span>
					<h2 class="blog-index-title"><?php echo $article->title()->html() ?></h2>
					<span class="blog-meta blog-index-meta blog-index-meta--summary"><?php echo $article->description()->html() ?></span>
				</a>
			</li>
			<?php endforeach ?>
		</ul>
	</div>

</div>

<?php snippet('footer') ?>