<?php snippet('header') ?>	
<div class="outside body article">
	
	<?php if($image = $page->image()): ?>
	<div class="article-hero <?php echo $page->article_hero_classes() ?>">
		<img src="<?php echo $image->url() ?>" alt="<?php echo $page->title()->html() ?>" height="<?php echo $page->image()->height() ?>" width="<?php echo $page->image()->width() ?>">
	</div>
	<?php endif ?>
	
	<div class="inside">
		<article class="narrow-width">
			<div class="article-title">
			  <span class="caption article-date"><?php echo $page->date('F d, Y') ?></span>
			  <h1 class="article-h1"><?php echo $page->title()->html() ?></h1>
			  <div class="hr"><hr></div>
			</div>
			<div class"article-content">
			  <?php echo $page->text()->kirbytext() ?>
			</div>
			<?php snippet('article-footer') ?>
		</article>
	</div>
</div>
<?php snippet('footer') ?>