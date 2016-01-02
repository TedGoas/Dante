<div class="work-navigation">
	<ul class="work-navigation-ul">
		<?php if($prev = $page->prev()): ?>
		<li class="work-navigation-li work-navigation-li--previous">
			<span class="work-navigation-byline">previous</span>
			<a href="<?php echo $prev->url() ?>" class="work-navigation-a link-brackets">
				<strong class="work-navigation-strong"><?php echo $page->prev()->title() ?></strong>
			</a>
		</li>
		<?php endif ?>
		<li class="work-navigation-li work-navigation-li--all">
			<span class="work-navigation-byline">all</span>
			<a href="/work" class="work-navigation-a link-brackets">
				<strong class="work-navigation-strong">Work</strong>
			</a>
		</li>
		<?php if($next = $page->next()): ?>
		<li class="work-navigation-li work-navigation-li--next">
			<span class="work-navigation-byline">next</span>
			<a href="<?php echo $next->url() ?>" class="work-navigation-a link-brackets">
				<strong class="work-navigation-strong"><?php echo $page->next()->title() ?></strong>
			</a>
		</li>
		<?php endif ?>
	</ul>
</div>
