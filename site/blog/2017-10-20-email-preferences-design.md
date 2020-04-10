---
title: Designing a Better Email Preference Center
body_class: blog
featured_image: /images/blog/email-preferences/hero.png
image_caption: Part of the user interface for Stack Overflow’s email preferences.
excerpt: Lessons and insights from redesigning Stack Overflow’s email preferences.
---

I’m on the Product Design team at [Stack Overflow](https://stackoverflow.com/), a place where developers can get answers to their programming questions, find a job, and build communities around similar interests. Like many other websites, Stack Overflow sends email. Earlier this year, we set out to explore how we could improve our email experience. We’d love to share what we learned in the process.

This is the first in a two part series about how we’re overhauling Stack Overflow’s email subscription UX.

## The Current State of Email Preference Centers

When I hear folks talk about email, usually it goes something like this:

<figure>
	<blockquote class="twitter-tweet" data-lang="en"><p lang="en" dir="ltr">Want to receive unwanted emails for the rest of your life, and possibly the life of your children? Stay at a hotel ONCE.</p>&mdash; Fabio Carneiro, but with crippling depression (@flcarneiro) <a href="https://twitter.com/flcarneiro/status/492699321532698626?ref_src=twsrc%5Etfw">July 25, 2014</a></blockquote>
<script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>
</figure>

…or this…

<figure>
	<blockquote class="twitter-tweet" data-lang="en"><p lang="en" dir="ltr">What they don&#39;t tell you about college is HOW MANY UNSOLICITED EMAIL NEWSLETTERS YOUR SCHOOL SENDS YOU EVERY DAY!!!!!!</p>&mdash; bteef (@brennateefy) <a href="https://twitter.com/brennateefy/status/827006416472780801?ref_src=twsrc%5Etfw">February 2, 2017</a></blockquote>
<script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script>
</figure>

…or this:

<figure>
	<blockquote class="twitter-tweet" data-lang="en"><p lang="en" dir="ltr">There’s a special place in hell for services that require log in to unsubscribe from their newsletter.</p>&mdash; Sara Soueidan 🐦 (@SaraSoueidan) <a href="https://twitter.com/SaraSoueidan/status/885181468103847936?ref_src=twsrc%5Etfw">July 12, 2017</a></blockquote>
<script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script></figure>

I can’t blame them; why trust anyone when there are so many bad actors out there? Sometimes it seems like you mysteriously get on an email list and have to jump through hoops to get off.

Until about a year ago, Stack Overflow didn’t send much email aside from a few messages sent to active Q&A users and basic things like resetting a password. We’ve been working hard to ramp up Stack Overflow’s email program and send better targeted emails. As our email program evolved, we knew our email preferences needed to keep pace. Our existing design wasn’t going to cut it, so we set out to redesign Stack Overflow’s email preference center.

<figure class="unbound w-max-5xl">
    <img src="/images/blog/email-preferences/existing-preferences.png" alt="Stack Overflow's previous email preferences." height="600" width="1134">
    <figcaption class="caption">We can do better</figcaption>
</figure>

## Our Goal

First, we needed to fix our legacy system in order to avoid becoming the bad actor ourselves. Designing for a community that connects over 50 million developers can pose some unique challenges. We created a few [design principles](https://www.gov.uk/design-principles) to help guide our ideas for Stack Overflow’s email preference center:

* **Be honest** about what’s happening.
* **Be clear** about what’s possible.
* **Be quick** in removing roadblocks and honoring users’ wishes.

<div><hr></div>

## Common Pitfalls (and what we did to solve them)

### Pitfall #1: Inundating folks with emails after signup

<figure>
    <img src="/images/blog/email-preferences/opted-into-everything.png" alt="Photo of someone automatically opted into every email." height="400" width="1000">
    <figcaption class="caption">Aww hell no!</figcaption>
</figure>

How many times have you joined a new service and gotten opted into EVERY SINGLE EMAIL THEY SEND? Yeah, we didn’t want to be that guy… but at the same time, we were underselling ourselves by playing it too conservative with email. Users frequently made comments like "Oh I didn’t know you had x/y/z feature." Rather than just not send any email at all, we had to convince ourselves that we could do it in a responsible way.

> One of my biggest apprehensions is annoying our community. Worrying about that keeps me up at night. — [Nick Craver](https://stackoverflow.blog/2016/11/how-we-make-money-at-stack-overflow-2016-edition/)

We reorganized our email categories and reconsidered how folks are opted into each one. We made email subscriptions trigger-based wherever possible. For example, we don’t send you any Jobs emails until you engage with the Jobs product (apply for a job, set status to ‘looking’, etc.). We don’t send you any community emails until you’ve participated. We don’t opt you into any newsletters. And no, we don’t employ any pop-ups imploring you (or shaming you) to sign up. We don’t even have an email signup form on most pages.

<figure>
    <img src="/images/blog/email-preferences/email-footer.png" alt="Stack Overflow's email footer." height="180" width="800">
    <figcaption class="caption">Our email footer</figcaption>
</figure>

And when we do email you, we tell you why. Every email includes a reason you got email. We watched our language and made sure our internal speak didn’t end up in the text (such as "Profile merge expired," "Active status decayed," and other glorious names we give emails at Stack Overflow).

Lastly, we do our best to remove folks who probably don’t want to be emailed. If an email is rejected, we’ll unsubscribe you. If you’re unresponsive to emails we send, we’ll unsubscribe you. If you mark it as spam, we’ll unsubscribe you. We want to keep in touch, but only in ways that you find helpful.

#### TAKEAWAY:
**Be honest:** We’re careful about not emailing anyone who doesn’t want to hear from us. If we’re not sure, we don’t send the email.

### Pitfall #2: Sending poorly targeted emails
So many times, I sign up for a service and get an email I didn’t expect.

> "Where did this come from?"
> "What did I do to receive this?"
> "How do I change my preferences?"

When a preference center gives me a lot of options, I want to know what exactly each of those options actually means. A list of vague categories like "Announcements" or "Product Updates" doesn’t set clear expectations about what email I’d receive and how often I’d receive them.

<figure>
    <img src="/images/blog/email-preferences/what-are-these-emails.png" alt="Screen of vaguely-described emails." height="200" width="700">
    <figcaption class="caption">What… exactly are these?</figcaption>
</figure>

Same goes for when I receive an email. So many times, I’ve arrived at a preferences page after clicking "unsubscribe" in an email and have no idea which email I just turned off. It’s often hard to tell exactly what category controls a certain email, so I have to guess and disable certain message types until I stop getting the ones I don’t want any more.

We addressed this by including a brief explanation of each email category. Where possible, we say how often we send an email. We try to be as clear as possible so a user may edit their preferences with confidence.

If the unsubscribe link is clicked in any email, we bring you to your email preferences with that email highlighted so it’s clear what you just unsubscribed from. Regardless of how you end up in your email preferences, we want your experience to be as good as possible.

<figure>
    <img src="/images/blog/email-preferences/stackmail-unsubscribe.png" alt="Stack Overflow confirms email unsubscribes." height="180" width="880">
</figure>

Stack Overflow highlights the email you unsubscribed from so you don’t have to guess.

#### TAKEAWAY:
**Be clear:** We describe each email and highlight important actions so users know what’s going on.

### Pitfall #3: Poor, Inaccessible Email UX

When updating your email preferences, how many times have you been forced to…

* …log into a site or app?
* …navigate a non-responsive site on mobile?
* …make sense of confusing text?
* …type your email address (on mobile)?
* …confirm an unsubscribe?
* …wait a week for it to process?

<figure>
    <img src="/images/blog/email-preferences/processing-request.png" alt="Ee are processing your unsubscribe." height="150" width="900">
    <figcaption class="caption">This is where I mark emails as spam.</figcaption>
</figure>

> There is nothing worse than making the user do more than completely necessary when it comes to trying to remove themselves from communications.- [Becs Rivett-Kemm](https://medium.com/@Conversio/sorting-out-our-email-marketing-opt-ins-223ca92483e7#.awwrvphxz)

We think of this as any other conversion. If we optimize the landing pages from our emails, why not our subscription preferences? Unsubscribing might not be a flow we want them to complete, but if that’s what someone wants to do we shouldn’t make it any harder than it has to be.

We provide a one-click unsubscribe wherever we can. We did a lot of discovery and prototyping on when to include an unsubscribe link in email footers; it’s not always clear! For instance, we researched the **Welcome Email** for 15 websites and found only about half included an unsubscribe link.

You can edit most of your Stack Overflow emails on a phone, without logging in, with a single click or tap. Changes are instant. And no, we don’t send [an unsubscribe confirmation email](https://postmarkapp.com/blog/dont-send-unsubscribe-confirmation-emails).

<figure>
    <img src="/images/blog/email-preferences/stack-overflow-email-preferences.png" alt="Stack Overflow's email preferences redesign." height="900" width="1250">
    <figcaption class="caption">Our email preferences redesign</figcaption>
</figure>

#### TAKEAWAY:
**Be quick:** We removed every roadblock we could.

<hr role="presentation" aria-role="hidden" class="hr-sm">

## Conclusion
Good subscription UX takes care of you — your privacy and the quality of your email life. It makes sensible decisions for you that respect your time, data, and attention. We provide sensible defaults, but give you choice, independence, and power to make your own experience.

* **Be honest** about what’s happening, why, and what you can do about it. Designs should build confidence through transparency.
* **Be clear** about what’s possible. Everything we make should be as understandable, descriptive, and inclusive.
* **Be quick** in removing roadblocks and honoring users’ wishes. Designs should remove contextual barriers and meet them wherever they are. Accessible design is good design.

This article shows how we applied our design principles to the design of Stack Overflow’s email preference center. We’ll also be publishing more of a step-by-step approach about how we designed the UX behind unified email management for 150+ sites. Stay tuned!

Thanks to [Donna](https://twitter.com/donna_says) and [Kristina](https://twitter.com/kristinalustig) for their help with this article.

## Further Reading
* [7 Really Good Unsubscribe Pages + Preference Centers](https://explore.reallygoodemails.com/7-really-good-unsubscribe-pages-preference-centers-dbf7e838aea5)
* [Sorting out our email marketing opt-ins](https://medium.com/conversio/sorting-out-our-email-marketing-opt-ins-223ca92483e7)

Also published <a href="https://medium.com/stack-overflow-design/designing-a-better-email-preference-center-4fddd44b91b5">on Medium</a>
