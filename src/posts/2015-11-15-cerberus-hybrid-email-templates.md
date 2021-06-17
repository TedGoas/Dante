---
title: Cerberus Hybrid Email Templates
body_class: blog
featured_image: cerberus/cerberus3.svg
image_caption: Wireframe of a mobile phone.
description:  I released a third version of Cerberus, including a hybrid template.
---

**TL;DR:** I quietly released a third version of [Cerberus responsive email templates](https://github.com/TedGoas/Cerberus). The big difference is that now there is a hybrid template that works on mobile without media queries.

<hr role="presentation" aria-role="hidden" class="hr-sm">

I’ve been writing HTML emails for a while. I’d become comfortable making responsive websites using media queries, so it seemed like a natural fit for emails. I constructed a simple set of responsive email patterns based on responsive breakpoints and called it Cerberus. I could quickly construct emails desktop and responsive emails very quickly. The majority of my email lists primarily use iOS Mail, which supports media queries. I thought I had struck a good balance. Things were going great.

I’ve heard of hybrid email design as a way to enforce responsive email layouts in email clients that don’t support media queries (like Gmail). It seemed like a good idea, but it required a significant amount of extra work and anyway, email isn’t the main function of my job. Clients weren’t asking for it. So I procrastinated learning hybrid design.

<figure class="bg-white p-8 w-64 max-w-full rounded">
	<img src="/assets/img/cerberus/no-media-queries.jpg" alt="No media queries allowed. Cartoon." width="210" height="198">
</figure>

While I procrastinated, I watched Gmail usage grow in my lists. I also noticed a number of new mobile email clients popping up, many of which don’t support media queries. I realized the relying on media query support wasn’t going to scale. It was time to invest in hybrid design.

I went to [The Email Design Conference](https://litmus.com/conference) in Boston with the goal of learning a practical way to code hybrid emails. By attending Fabio Carneiro’s talk and [studying his code](https://github.com/fcarneiro/tedc15_template), I finally wrapped my head around the concept. I’ve also learned quite a bit from the [Action Rocket folks](http://labs.actionrocket.co/the-hybrid-coding-approach).

The hybrid template reflects what I’ve learned so far. It’s a start, and something I look forward to improving as I go. It’s open source, obviously, so I encourage you to help reduce the entropy of the code.

And wouldn’t you know it, about a month after the conference, a client asked me if I could design a responsive email that looked good in Gmail.
