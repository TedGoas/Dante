---
title: "Cerberus: Simple Patterns for Responsive Email"
body_class: blog
featured_image: cerberus.jpg
image_caption: Sketch wireframe of a mobile phone.
description:  I made a few simple, but solid patterns for responsive HTML emails.
---

TL;DR: I made another set of [responsive email templates](http://tedgoas.github.io/Cerberus/).

<a href="http://tedgoas.github.io/Cerberus/">View on Github</a>

## The Backstory

Last year I set a personal goal to contribute on GitHub and give back to a community that has taught me so much. A few months ago, I created a fairly in-depth responsive email template containing what I thought was a number of common email patterns. Everything worked in popular email clients, even in Outlook. [I put it on GitHub](https://github.com/TedGoas/Responsive-Email-XX). Some people starred / forked / talked about it. I was happy: I made progress towards my goal.

But after a while, I noticed that I had stopped using it. I found the template so complicated that I sometimes had to relearn parts of it. And if *I* was having trouble understanding it, I worried about how others were fairing.

**Big problem.**

In hindsight, I packed way too much into a single template. It became hard to follow how the HTML and CSS matched up. And I only used about half of the layout patterns in production emails. Why did I include so much? No good reason.

So I fixed it.

You may be thinking, “Oh wonderful... another responsive email template.” Yep, I thought about that too. 2013 seemed to be the year of email. Responsive emails took off when [Zurb](http://zurb.com/playground/responsive-email-templates) and [InterNations](https://github.com/InterNations/antwort) showed it was possible. Lots of folks joined the movement, improving both the code quality and process. [Campaign Monitor](http://www.campaignmonitor.com/), [MailChimp](http://mailchimp.com/), and [Litmus](https://litmus.com/) all rolled out huge updates and new tools. [Books were written](http://modernhtmlemail.com/). Blogs were started. [GIFs were Tumbled](http://emailmarketingreactions.tumblr.com/). Email even got its [first ever conference](https://litmus.com/conference).

Looking at everything that happened in 2013, I saw a focus on prebuilt templates and design tools like CSS inliners, code previews, template builders. Aside from Brian Grave’s [responsive email patterns](https://github.com/briangraves/ResponsiveEmailPatterns), I didn’t see many resources dedicated to folks who kinda already know what they’re doing<sup>1</sup> and code from scratch by hand.

But that’s how I work and I wanted to make something that’d help folks like me.

So I removed the stuff I never used from my first email and refactored the rest. I compartmentalized the pattern blocks so that they may be mixed and matched to build an email. Everything has good email client support, including Outlook, Android, and even mobile Gmail.

So that’s it. A small number of responsive email patterns that, when combined, go a long way.

A mantra of email design is: keep the layout simple. Where my first attempt failed, I hope this one succeeds.

So if you like doing things by hand and want a few solid code blocks to start with, check out [Cerberus](http://tedgoas.github.io/Cerberus/)<sup>2</sup> on GitHub. It’s what I use to start every HTML email I create.

<a href="http://tedgoas.github.io/Cerberus/">View on Github</a>

<sup>1</sup> - Well, not 100% true. Everyone mentioned in this article helps seasoned email designers, whether it’s studying code on GitHub or reading about email tricks and gotchas on blogs / Twitter.

<sup>2</sup> - Between desktop, mobile, and Outlook, HTML email is a three-headed dog from hell.
