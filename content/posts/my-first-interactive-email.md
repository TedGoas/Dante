---
title: My first interactive email
body_class: blog
featured_image: /images/blog/interactive-email.webp
image_caption: A wall with holes in it resembling a punch card.
excerpt: I recently coded my first interactive email using punched card coding. I wrote about what I did and how it works.
highlightjs: true
date: 2020-01-02
---

**TL;DR:** I coded my first interactive email using radio buttons to toggle on/off states without using JavaScript.

---

I was first introduced to interactive email in 2015 when I attended Mark Robbins’ presentation at Litmus Live in Boston.

JavaScript isn’t supported in any email client, so up to that point the only interactive things I’d done in email were relatively basic (like creating a `:hover` effect on a button using CSS).

But in his presentation, Mark introduced me to the concept of punched card coding: using checkbox and radio button tags in email to mimic on/off functionally that JavaScript typically enables on the web.

I was blown away by [Mark’s talk](https://www.youtube.com/watch?v=xhUfiOSOk3g). I told myself to look out for an opportunity to use what I learned at work, but promptly forgot about it for four years as “regular” work took the front seat 😬.

## The Pilot

Fast forward to 2019, I now work on Stack Overflow’s private Q&A products. Teams can ask questions, post answers, and vote on the best ones in a private setting.

However some teams have mentioned they’d like to improve their culture of voting. Eg. The team posts useful answers, but folks don’t upvote or accept the best ones to signal a high quality answer to rest of the team.

Folks don't spend all day with Stack Overflow open in a browser tab, so how can we meet folks where they already are?

> “What if you could vote on questions right from your email, without even visiting the site? I bet that’s something an interactive email would be able to do!”

Four years after learning about punched card coding, I finally found a good pilot project, tied it to a business need, and set aside a day to code my first interactive email.

## What We Built

The “Happy Path UX" allows someone to view an answer to their question and optionally vote on or accept it as the best answer, all without leaving their inbox. This is what I built:

<figure>

https://codepen.io/tedgoas/pen/MWYpazJ
<figcaption>Try clicking the icons on the left!</figcaption>
</figure>

## The Code

The HTML uses the radio input along with the `:checked` attribute to show and hide content using CSS.

### HTML

<pre><code class="code-block html">&lt;input type="radio" name="vote" id="ArrowUpLg" style="display: none !important; max-height: 0; visibility: hidden;"&gt;
&lt;label for="ArrowUpLg" class="ArrowUpLg" style="cursor: pointer;"&gt;
  &lt;img src="ArrowUpLg.png" height="36" width="36"&gt;
&lt;/label&gt;

&lt;input type="radio" name="vote" id="ArrowUpLgactive" style="display: none!important; max-height: 0; visibility: hidden;"&gt;
&lt;label for="ArrowUpLgactive" class="ArrowUpLgactive" style="cursor: pointer; display: none;"&gt;
  &lt;img src="ArrowUpLgactive.png" height="36" width="36"&gt;
&lt;/label&gt;
</code></pre>

The actual radio button is visually hidden and linked to from their `<label>` tag using the `for` and `id` attributes. The image file is wrapped inside the `<label>` to make the click/tap area nice and big.

For each icon, I created two almost identical versions of the code: one for the “initial” state and another for the “active” state. The “active” state is hidden by default with inline CSS (Inline CSS is still the most universal way to style HTML in email).

So the base HTML and CSS inserts and positions each icon state in the email, and hides the “active” image for each icon. With this foundation, the CSS in the `<head>` adds the functionality.

### CSS

<pre><code class="css">#ArrowUpLg:checked + .ArrowUpLg {
  display: none !important;
}
#ArrowUpLg:checked ~ .ArrowUpLgactive {
  display: block !important;
}
#ArrowDownLg:checked + .ArrowDownLg {
  display: none !important;
}
</code></pre>

When an icon is clicked, the `<label>` tag, it checks the hidden radio button.

In the CSS, the `:checked` selector is used to toggle the `display` property of the adjacent `<img>` between `block` and `none`. The first time an icon is clicked or tapped, I hide the initial state (`display: none !important`) and show the “active” state (`display: block !important`). The `!important` is necessary to override inline CSS styles.

## The Happy Path UX

The end result is an email with working upvote and downvote arrows, and a checkmark to accept the answer.

We should only be able to upvote or downvote an answer, but not both. So we used radio buttons and included the upvote and downvote arrows in a single group using the `name` attribute. This means that if the upvote arrow is active, and then the downvote arrow is selected, the upvote arrow is unselected in the process.

The “accepted” checkmark is independent of the voting arrows, so I gave that its own `name`.

## Email Client Fallbacks

I’ve been using the term “Happy Path UX” to describe the ideal state. Unfortunately not all email clients support [this level of interactivity](http://freshinbox.com/resources/css.php), so I have to think about fallbacks.

For instance, desktop Outlook on Windows does not support HTML form tags in email. Left alone, Outlook would display each icon… but nothing would happen when they’re clicked. Both confusing and frustrating for a user.

In this cases like this, we can target email clients that don’t support our desired UX and code in a fallback (Like say, static image files that click to the website).

In this example, I targeted Outlook using `<!--[if mso]><![endif]—>` tags to hide the interactive form content from Outlook but display it in other email clients.

[How to Target Email](https://howtotarget.email/) contains a long list of ways to target different email clients. I'll use this to display the interactivity to clients that support it and hide it from the rest.

## Punched Card Coding
This was my first foray into punched card coding. It’s a pretty steep learning curve, but I had a giant “A-Ha!” moment the first time I got a proof of concept working.

![Mind blown animation](https://media.giphy.com/media/3oKIPjHdsUZOlJXTQQ/giphy.gif)

Punched card coding can involve radio buttons, checkboxes, or button tags to achieve a number of things. Javascript still isn’t supported in any email client, but we can still toggle state, build tabs, reveal a hidden menu, build a carousel, and more.

![illustrations of types of interactive emails, c/o Email Monks.](https://i.imgur.com/b1b23iq.png)

[More on punched card coding](https://www.webdesignerdepot.com/2015/10/punched-card-coding-the-secret-of-interactive-email/)

## Known Issues and Questions
My example above poses several questions outside of the HTML and CSS.

* **Can we maintain state?** Eg. What happens if I vote in an email, close the email, and re-open it? Is the arrow still active? If it’s not and I vote again, what happens?
* **What about security?** Eg. If I forward my email, can someone else vote on my behalf?
* **What about testing?** Eg. Emulators like Litmus only produce static screenshots. I’ll need a working version of every email client we want to test.

If you’re a Stack Overflow user, I’m not sure when we’ll figure this out, but I’m working on it! This is simply and exploration of what’s possible using interactive email.

If you’ve written markup using punched card coding or "the checkbox hack,” I’ve love input on how I could improve and optimize this.

**If you’re a Stack Overflow user, would this be useful?**

💌 ✌️
