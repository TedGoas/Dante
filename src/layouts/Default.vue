<template>
  <main class="layout" role="main">
    <Header />
    <slot/>
    <Footer />
  </main>
</template>

<script>
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default {
  components: {
    Header,
    Footer
  }
}
</script>

<style lang="scss">
// @import url('https://fonts.googleapis.com/css2?family=Caveat+Brush&family=IBM+Plex+Sans:ital,wght@0,400;0,700;1,400&display=swap');

:root { /* Dark theme */

	/* Font Family */
	--font-sans:		IBM Plex Sans, sans-serif;
	--font-display: 	'Caveat Brush', cursive;
	--font-mono:		IBM Plex mono, monospace;

	/* Font Size */
	--fs-xs:		0.875rem;	// 14px
	--fs-sm:		1rem;		// 16px
	--fs-md:		1.125rem;	// 18px
	--fs-lg:		1.5rem;		// 24px
	--fs-xl:		1.75rem;	// 28px
	--fs-subtitle:	2rem;		// 32px
	--fs-title:		3.5rem;		// 56px

	/* Spacing */
	--spacing4: 	.4rem;
	--spacingn4: 	-.4rem;
	--spacing8: 	.8rem;
	--spacingn8: 	-.8rem;
	--spacing12: 	1.2rem;
	--spacingn12: 	-1.2rem;
	--spacing16: 	1.6rem;
	--spacing-16: 	-1.6rem;
	--spacing24: 	2.4rem;
	--spacingn24: 	-2.4rem;
	--spacing32: 	3.2rem;
	--spacingn32: 	-3.2rem;
	--spacing48: 	4.8rem;
	--spacingn48: 	-4.8rem;
	--spacing64: 	6.4rem;
	--spacingn64: 	-6.4rem;
	--spacing96: 	9.6rem;
	--spacingn96: 	-9.6rem;

	/* Widths */
	--width1:	108px;
	--width2:	216px;
	--width3:	332px;
	--width4:	464px;
	--width5:	628px;
	--width6:	756px;
	--width7:	912px;
	--width8:	1024px;

	/* Colors */
	--cyan: 		#3bc9db;
	--cyan-light: 	#99e9f2;
	--cyan-dark: 	#1098ad;
	--white:		#fff;
	--ash:			#dee2e6;
	--gray-dark:	#868e96;
	--gray-darkest:	#212529;

	/* Variable Definitions */
    --site-background-color: 	#0E091D;
    --site-font-color: 			var(--text-color);

	--text-color:		var(--white);		
	--text-color-light:	var(--ash);	

	--link-color:					var(--cyan);
	--link-color-visited:			var(--cyan-light);
	--link-color-hover:				var(--cyan-dark);
	--link-underline-color:			#495057;
	--link-underline-color-hover:	#495057;
}

[theme="light"] {
    --site-background-color: 	#edf2ff;
    --site-font-color: 			var(--text-color);

	--text-color:		var(--gray-darkest);		
	--text-color-light:	var(--gray-dark);	
}

/* Atomic Classes */
.m0		{margin: 0 !important;}
.m4		{margin: var(--spacing4) !important;}
.m8		{margin: var(--spacing8) !important;}
.m12	{margin: var(--spacing12) !important;}
.m16	{margin: var(--spacing16) !important;}
.m24	{margin: var(--spacing24) !important;}
.m32	{margin: var(--spacing32) !important;}
.m48	{margin: var(--spacing48) !important;}
.m64	{margin: var(--spacing64) !important;}
.m96	{margin: var(--spacing96) !important;}

.mr0	{margin-right: 0 !important;}
.mr4	{margin-right: var(--spacing4) !important;}
.mr8	{margin-right: var(--spacing8) !important;}
.mr12	{margin-right: var(--spacing12) !important;}
.mr16	{margin-right: var(--spacing16) !important;}
.mr24	{margin-right: var(--spacing24) !important;}
.mr32	{margin-right: var(--spacing32) !important;}
.mr48	{margin-right: var(--spacing48) !important;}
.mr64	{margin-right: var(--spacing64) !important;}
.mr96	{margin-right: var(--spacing96) !important;}
.mrauto	{margin-right: auto !important;}

.mb0	{margin-bottom: 0 !important;}
.mb4	{margin-bottom: var(--spacing4) !important;}
.mb8	{margin-bottom: var(--spacing8) !important;}
.mb12	{margin-bottom: var(--spacing12) !important;}
.mb16	{margin-bottom: var(--spacing16) !important;}
.mb24	{margin-bottom: var(--spacing24) !important;}
.mb32	{margin-bottom: var(--spacing32) !important;}
.mb48	{margin-bottom: var(--spacing48) !important;}
.mb64	{margin-bottom: var(--spacing64) !important;}
.mb96	{margin-bottom: var(--spacing96) !important;}

.ml0	{margin-left: 0 !important;}
.ml4	{margin-left: var(--spacing4) !important;}
.ml8	{margin-left: var(--spacing8) !important;}
.ml12	{margin-left: var(--spacing12) !important;}
.ml16	{margin-left: var(--spacing16) !important;}
.ml24	{margin-left: var(--spacing24) !important;}
.ml32	{margin-left: var(--spacing32) !important;}
.ml48	{margin-left: var(--spacing48) !important;}
.ml64	{margin-left: var(--spacing64) !important;}
.ml96	{margin-left: var(--spacing96) !important;}
.mlauto {margin-left: auto !important;}

.mt0	{margin-top: 0 !important;}
.mt4	{margin-top: var(--spacing4) !important;}
.mt8	{margin-top: var(--spacing8) !important;}
.mt12	{margin-top: var(--spacing12) !important;}
.mt16	{margin-top: var(--spacing16) !important;}
.mt24	{margin-top: var(--spacing24) !important;}
.mt32	{margin-top: var(--spacing32) !important;}
.mt48	{margin-top: var(--spacing48) !important;}
.mt64	{margin-top: var(--spacing64) !important;}
.mt96	{margin-top: var(--spacing96) !important;}

.p0		{padding: 0 !important;}
.p4		{padding: var(--spacing4) !important;}
.p8		{padding: var(--spacing8) !important;}
.p12	{padding: var(--spacing12) !important;}
.p16	{padding: var(--spacing16) !important;}
.p24	{padding: var(--spacing24) !important;}
.p32	{padding: var(--spacing32) !important;}
.p48	{padding: var(--spacing48) !important;}
.p64	{padding: var(--spacing64) !important;}
.p96	{padding: var(--spacing96) !important;}

.pr0	{padding-right: 0 !important;}
.pr4	{padding-right: var(--spacing4) !important;}
.pr8	{padding-right: var(--spacing8) !important;}
.pr12	{padding-right: var(--spacing12) !important;}
.pr16	{padding-right: var(--spacing16) !important;}
.pr24	{padding-right: var(--spacing24) !important;}
.pr32	{padding-right: var(--spacing32) !important;}
.pr48	{padding-right: var(--spacing48) !important;}
.pr64	{padding-right: var(--spacing64) !important;}
.pr96	{padding-right: var(--spacing96) !important;}

.pb0	{padding-bottom: 0 !important;}
.pb4	{padding-bottom: var(--spacing4) !important;}
.pb8	{padding-bottom: var(--spacing8) !important;}
.pb12	{padding-bottom: var(--spacing12) !important;}
.pb16	{padding-bottom: var(--spacing16) !important;}
.pb24	{padding-bottom: var(--spacing24) !important;}
.pb32	{padding-bottom: var(--spacing32) !important;}
.pb48	{padding-bottom: var(--spacing48) !important;}
.pb64	{padding-bottom: var(--spacing64) !important;}
.pb96	{padding-bottom: var(--spacing96) !important;}

.pl0	{padding-left: 0 !important;}
.pl4	{padding-left: var(--spacing4) !important;}
.pl8	{padding-left: var(--spacing8) !important;}
.pl12	{padding-left: var(--spacing12) !important;}
.pl16	{padding-left: var(--spacing16) !important;}
.pl24	{padding-left: var(--spacing24) !important;}
.pl32	{padding-left: var(--spacing32) !important;}
.pl48	{padding-left: var(--spacing48) !important;}
.pl64	{padding-left: var(--spacing64) !important;}
.pl96	{padding-left: var(--spacing96) !important;}

.pt0	{padding-top: 0 !important;}
.pt4	{padding-top: var(--spacing4) !important;}
.pt8	{padding-top: var(--spacing8) !important;}
.pt12	{padding-top: var(--spacing12) !important;}
.pt16	{padding-top: var(--spacing16) !important;}
.pt24	{padding-top: var(--spacing24) !important;}
.pt32	{padding-top: var(--spacing32) !important;}
.pt48	{padding-top: var(--spacing48) !important;}
.pt64	{padding-top: var(--spacing64) !important;}
.pt96	{padding-top: var(--spacing96) !important;}

/* Reset */
html:focus-within {
	scroll-behavior: smooth;
}
*,
*::before,
*::after {
	box-sizing: border-box;
}
body,
h1,
h2,
h3,
h4,
p,
figure,
blockquote,
dl,
dd {
	margin: 0;
}

/* Base Styles */
body {
	min-height: 100vh;
	text-rendering: optimizeSpeed;
	background-color: var(--site-background-color);
	color: var(--site-font-color);
	font-family: var(--font-sans);
	font-size: var(--fs-md);
	line-height: 1.5;
	padding: 0 var(--spacing8);
}
a {
	transition: color ease 75ms;
	text-decoration: underline;
	text-decoration-thickness: 0.2rem;
	text-decoration-color: var(--link-underline-color);
	text-underline-offset: 0.4ex;

	&:not(:visited) {
		color: var(--link-color);
	}
	&:visited {
		color: var(--link-color-visited);
	}
	&:hover,
	&:focus,
	&:active {
		color: var(--link-color-hover);
		text-decoration-color: var(--link-underline-color-hover);
	}
}
h1,
h2,
h3 {
	color: var(--text-color-dark);
}
h1 {
	font-size: var(--fs-title);
	font-family: var(--font-display);
	line-height: 1;
	font-weight: normal;
}
h2 {
	font-size: var(--fs-subtitle);
}

img,
picture {
	max-width: 100%;
	height: auto;
	display: block;
}
.layout {
	margin: 0 auto;
	max-width: 1100px;
}
article {
	width: 70ch;
	margin: 0 auto;
}
</style>
