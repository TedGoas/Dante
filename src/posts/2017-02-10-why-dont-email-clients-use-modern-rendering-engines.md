---
title: Why don't email clients use modern rendering engines?
body_class: blog
featured_image: email-rendering-engines/email-header.png
image_caption: Abstract illustration of three emails.
description:  Email clients use rendering engines appropriate for displaying emails.
---

> Why don't email clients use modern rendering engines? It's 2017, why are still stuck with HTML tables. Why don’t emails clients leverage modern browser engines to HTML document properly?

I came across [this question on Stack Overflow](http://stackoverflow.com/questions/41432973/why-dont-email-clients-use-modern-rendering-engines). As with any developer who’s dealt with HTML email knows, the lack of basic CSS support in email clients can be… well… frustrating.

I answered the question on Stack Overflow, but would like to build upon it here. Feel free to vote or comment [on the original post](http://stackoverflow.com/questions/41432973/why-dont-email-clients-use-modern-rendering-engines/41447893#41447893) (more people will find it that way).

---

**Why don't email clients use modern rendering engines?**

The question suggests that email clients should display content as web browsers do. I argue that email clients use rendering engines appropriate **for displaying emails**. This is not always in step with displaying web pages.

Only a small percent of email users care about HTML/CSS support. Think email marketers, designers, and developers. The vast majority of email users simply want a simple, secure way of sending and receiving rich text messages with other people. That’s what email clients are designed for. Full support of the CSS spec is not required for this.

Even advanced users don’t often cite good HTML/CSS support as a top concern. Recent innovations give us a little insight as to what folks are frustrated with regarding email clients: help managing incoming messages, more security, less spam, productivity tools, and overall ease of use.

<figure>
	<img src="/assets/img/email-rendering-engines/gmail-inbox.png" alt="Gmail Inbox features." height="684" width="1000" class="rounded">
	<figcaption>Good HTML/CSS support: not something your average user cares about.</figcaption>
</figure>

No one cares if it takes developers a long time to use `<table>`s, deprecated HTML attributes, and inline CSS to create an email. When it comes to changing how emails are rendered… “If it’s not broke, why fix it?” When email clients actually do update rendering, it’s rarely news outside of the tech community. No one cares.

Consider **Desktop Outlook**, which typically comes bundled with programs like Word and Powerpoint. All these programs have a similar interface and display output. If you can author a Word document, there’s almost no learning curve in writing an email in Outlook. That’s huge for a lot of people. In all likelihood, Outlook’s rendering engine wasn’t chosen based on its ability to render an HTML document properly, yet the product is still considered a success. Because desktop Outlook and doesn’t get automatic updates, old versions (that we have to code for) tend to hang around. Litmus partnered with Microsoft in 2016 to do something about this, but it’s likely we’ll be supporting quirky versions of Outlook for a while.

Fun fact: Outlook 2000-2003 rendered email using whatever version of Internet Explorer was installed on the computer (usually Internet Explorer 6). But because of a legal decision made in 2000 to [prevent Microsoft from bundling IE with Windows](https://en.wikipedia.org/wiki/United_States_v._Microsoft_Corp.), Microsoft had to use an alternate rendering engine in future versions. So blame the US Department of Justice for that one.

**Gmail** is another example. Gmail has pretty good HTML/CSS support, but didn’t support external CSS files until late 2016. Gmail (unofficially) cited security as one of the reasons. I don’t know what keeps the Gmail team up at night, but I bet it’s not how email developers can’t optimize their email layouts. I bet it’s security. And so that’s where the gmail dev work likely gets focused.

Overall email clients do their job well. Since HTML/CSS support matters to so few people, changing it is likely not often a priority for product teams that make email clients. Sad trombone.

---

**However, things are trending in the right direction.** Gmail and Yahoo! app began supporting media queries in most of their products. Outlook for iOS got a huge facelift including good markup support. New email clients that crop up (Mailbox, Nylus. Polymail) generally have good HTML/CSS support compared to web browsers. The majority of clients based on market share use “modern rendering engines,” and CSS support rarely takes a step backwards.

<figure class="unbound max-w-xl">
	<img src="/assets/img/email-rendering-engines/email-client-stats.jpg" alt="Email client status according to Litmus." height="554" width="800" class="rounded">
</figure>

---

If folks creating email find it time-consuming to work around certain email clients, they can always reference their own email analytics and decide what to focus on. Don’t have many Outlook subscribers? Then code an email using `<div>`s. Don’t need to support every mobile client? Then use media-queries for responsive email.

But remember: **the primary job of an email client is to render emails, _not_ web pages.** Mimicking “modern browser engines” needn't be a requirement and should be considered more like a nice-to-have.

Also published <a href="https://medium.com/email-design/why-dont-email-clients-use-modern-rendering-engines-1971a0e0fda4#.4xgsd6jqq">on Medium</a>
