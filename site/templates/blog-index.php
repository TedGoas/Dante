<?php snippet('page-begin') ?>
	<h1><?php echo $page->title()->html() ?></h1>
	<a href="<?php echo url('blog/feed') ?>" title="RSS Feed">Feed</a>

	<ul class="list-ls-none">
		<?php foreach(page('blog')->children()->visible()->flip() as $article): ?>
		<li class="my4 lh-sm">
			<a href="<?php echo $article->url() ?>" class="td-none">
				<h2 class="fs-body1 m0 d-inline-block"><?php echo $article->title()->html() ?></h2>
			</a>
			<p class="mt2 mb0 fs-fine"><?php echo $article->description()->html() ?></p>
			<time class="fs-fine fc-light tt-uppercase ls-2 ff-mono">
				<?php echo $article->date('F d, Y') ?>
			</time>
		</li>
		<?php endforeach ?>
	</ul>
<?php snippet('page-end') ?>