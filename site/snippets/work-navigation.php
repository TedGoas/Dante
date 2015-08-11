<div class="work-navigation">
	<ul class="work-navigation-ul">
		<?php if($prev = $page->prev()): ?>
		<li class="work-navigation-li"><a href="<?php echo $prev->url() ?>" class="button button-black button-with-icon work-navigation-a"><i class="icon-left-open"></i> <?php echo $page->prev()->title() ?></i></a></li>
		<?php endif ?>
		<?php if($next = $page->next()): ?>
		<li class="work-navigation-li"><a href="<?php echo $next->url() ?>" class="button button-black button-with-icon work-navigation-a"><?php echo $page->next()->title() ?> <i class="icon-right-open"></i></a></li>
		<?php endif ?>
	</ul>
</div>
