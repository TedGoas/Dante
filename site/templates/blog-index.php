<?php snippet('page-begin') ?>
<section class="default-spacing">
	<div class="default-title w-auto flex ai-center">
		<h1 class="mr4"><?php echo $page->title()->html() ?></h1>
		<a href="<?php echo url('blog/feed') ?>" title="RSS Feed">Feed</a>
	</div>
	<ul class="list-ls-none p0">
		<?php foreach(page('blog')->children()->visible()->flip() as $article): ?>
		<li class="my4 py2 lh-sm">
			<div class="flex jc-space-between ai-start">
				<a href="<?php echo $article->url() ?>" class="mr1"><h2 class="fs-body1 m0 d-inline"><?php echo $article->title()->html() ?></h2></a>
				<time class="wmn2 ta-right fs-fine fc-light tt-uppercase ls-2 ff-mono">
					<?php echo $article->date('F d, Y') ?>
				</time>
			</div>
			<span class="fs-caption fc-light d-block mt2"><?php echo $article->description()->html() ?></span>
		</li>
		<?php endforeach ?>
	</ul>
</section>
<?php snippet('page-end') ?>