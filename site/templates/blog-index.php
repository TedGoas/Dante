<?php snippet('page-begin') ?>
<section class="default-spacing">
	<div class="default-title w-auto flex ai-end">
		<h1 class="mr4"><?php echo $page->title()->html() ?></h1>
		<a href="<?php echo url('blog/feed') ?>" title="RSS Feed" class="img ml2">
			<svg width="18px" height="19px" viewBox="0 0 18 19" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
			    <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
			        <g transform="translate(-175.000000, -19.000000)" fill="#FD7E14" fill-rule="nonzero">
			            <path d="M175.15408,28.7506 C177.38248,28.7506 179.47732,29.62108 181.0516,31.20436 C182.62876,32.78764 183.49708,34.89652 183.49708,37.14148 L186.93112,37.14148 C186.93112,30.6208 181.64776,25.3162 175.15408,25.3162 L175.15408,28.7506 Z M175.15948,22.66264 C183.10144,22.66264 189.56308,29.15956 189.56308,37.1458 L192.99712,37.1458 C192.99712,27.2656 184.99468,19.2286 175.15948,19.2286 L175.15948,22.66264 Z M179.90824,34.74676 C179.90824,36.06004 178.843,37.12528 177.52972,37.12528 C176.21644,37.12528 175.1512,36.0604 175.1512,34.74676 C175.1512,33.43276 176.21608,32.36824 177.52936,32.36824 C178.84264,32.36824 179.90824,33.43276 179.90824,34.74676 Z" id="icon-rss"></path>
			        </g>
			    </g>
			</svg>
		</a>
	</div>
	<ul class="article-list list-ls-none p0">
		<?php foreach(page('blog')->children()->visible()->flip() as $article): ?>
		<li class="blog-list-item flex jc-space-between ai-start my4 lh-sm">
			<span>
				<a href="<?php echo $article->url() ?>" class="mr1 fs-caption"><?php echo $article->title()->html() ?></a>
			</span>
			<time class="ta-right ws-nowrap fs-fine fc-light tt-uppercase ls-1 mt2">
				<?php echo $article->date('F d, Y') ?>
			</time>
		</li>
		<?php endforeach ?>
	</ul>
</section>
<?php snippet('page-end') ?>