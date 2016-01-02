<?php snippet('header') ?>	
<div class="outside body article">
	
	<div class="inside page-title">
		<h1 class="page-title-h1"><?php echo $page->title()->html() ?></h1>
	</div>
	
	<div class="inside">
		<article>
			<div class="uk-grid uk-grid-large">
				<div class="uk-width-1-2">
					<?php echo $page->text()->kirbytext() ?>
				</div>
				<div class="uk-width-1-2 availability">
					<h2>Availability</h2>
					<img src="/assets/images/availability-dial.png" alt="relatively unavailable" height="235" width="450" class="availability-dial">
				</div>
			</div>
			<div class="tatg">
			  <div class="hr loud"><hr></div>
				<img src="/assets/images/email.svg" alt="hi spam bots" width="315" height="30">
		</article>
	</div>
	
</div>
<?php snippet('footer') ?>