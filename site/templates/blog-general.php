<?php snippet('page-begin') ?>
<article>

	<?php if($image = $page->image()): ?>
	<div class="ta-center article-hero <?php echo $page->article_hero_classes() ?>">
		<img src="<?php echo $image->url() ?>" alt="<?php echo $page->title()->html() ?>" height="<?php echo $page->image()->height() ?>" width="<?php echo $page->image()->width() ?>" class="wmx100 h-auto flush">
	</div>
	<?php endif ?>

	<div class="p-default">
		<div class="article-title">
			<h1 class="mb2"><?php echo $page->title()->html() ?></h1>
			<time class="fs-caption fc-light tt-uppercase ls-1">
				<?php echo $page->date('F d, Y') ?>
			</time>
			<hr role="presentation" aria-role="hidden" class="hr hr-sm my5 bg-violet-2">
		</div>
		<?php echo $page->text()->kirbytext() ?>
		<?php snippet('article-footer') ?>
	</div>

</article>
<?php snippet('page-end') ?>