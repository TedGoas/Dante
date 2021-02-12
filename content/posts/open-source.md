---
title: Anyone Can Open Source!
body_class: blog
featured_image: /images/blog/open-source/hero.png
image_caption: Artwork from Cerberus, my open source email templates.
excerpt: Lessons learned from working on a modestly successful open source project.
date: 2017-08-02
---

_This article is adapted from a talk I gave at the Stack Overflow Design Meetup In July 2017._

Before we start, a few quick bits:

- You don’t need to know how to code to do open source.
- Open source doesn’t have to require a lot of time.
- This article is focused on maintaining your own project. Contributing to others’ projects is also important, but I won’t cover that here.
- Open source projects can lead to pleasant surprises. I’ve used mine as leverage to get pay raises and at least one speaking gig.

I’m a designer. In 2013 I created [Cerberus](http://tedgoas.github.io/Cerberus/), a set of simple HTML email templates that solve a lot of common gotchas in getting emails to display properly across email clients. I have a few open source projects, but Cerberus is my main jam. It’s been used by [the team at dribbble](https://dribbble.com/shots/2839730-A-Litmus-Love-Story), and is included in products like Dreamweaver and [Litmus Builder](https://dribbble.com/shots/2839730-A-Litmus-Love-Story).

In this article, I’d like to share a few tips that guide my open source work and show a few examples of some awesome open source projects.

## 1. Choose Something Timeless and Stick With It

There’s a saying that certain jobs are [recession-proof](https://en.wikipedia.org/wiki/Recession-proof_job). I’m not suggesting every open source project should survive the nuclear apocalypse, but there are certainly parallels. A project should be something that can evolve through paradigm shifts. Something trendy like a long-shadow generator is probably not a good bet, but so many projects end up needing [a good tooltip](https://inclusive-components.design/tooltips-toggletips/) at some point.

For me, email is an obvious choice. Email is mature, ubiquitous, and has proven staying power… no matter how many people proclaim that email is dead. When I started Cerberus, I worked on it slowly and steadily for a few years before anyone started noticing it. And that’s ok, because email’s gonna be around for a while.

## 2. Make It Small and Focused

I have a full-time job, a young family, own a house, and enjoy life away from screens. I mostly work on my project alone, so it’s important not to spread myself too thin. I resist building bells and whistles; they’re more to maintain. I minimize dependencies; they’re roadblocks for folks getting started. I’ve left the design open for folks to adapt it for their own needs.

> Cerberus is a few simple, but solid patterns for responsive HTML emails.

[That’s what’s on the tin](http://tedgoas.github.io/Cerberus/). Cerberus’s design is grayscale, uses placeholder images, and contains dummy text. It doesn’t even define a font. It’s intentionally simple and unassuming. It does just a few things but it does them really well. Well, that’s the goal anyway.

<figure>

![Screenshot of Cerberus's design.](./images/open-source/cerberus-preview.png)
<figcaption>Cerberus (in all it’s beauty)</figcaption>
</figure>

When considering new features, I think about 37Signals’s “[Start with No”](https://gettingreal.37signals.com/ch05_Start_With_No.php) in Getting Real. A while back, I was asked to extend Cerberus’s three-column layout to support four columns.

> GitHub-User: Hi, can you please make a four column layout?
> Me: Hmm, that’s possible. Can you tell me a little about what you need it for?
> …

I got no response. Building a four column layout was totally possible, but I never built it because it wasn’t important enough to this person. No one’s asked for it since.

![Waiting on the porch in the movie Fight Club.](./images/open-source/fight-club.jpg)

It’s like Fight Club. You should only consider features if they’re willing to stand on the porch for three days waiting to be let in.

## 3. Dogfood It

This might go without saying, but using my own project helps me understand how it can be used so common workflows can be optimized. Email has been part of nearly every project I’ve worked on in the past few years, so I reach for Cerberus quite often.

Dogfooding it helps…

- find and fix bugs in dark corners
- write documentation
- educate and offer tips on how best to adapt and extend the project

## 4. Work on Non-Visible Features
I designed for a healthcare company for six years. Our work was heavily regulated (HIPAA) and we had strict privacy and security protocols. Every so often, I’d search for a plugin or tool to solve a problem. I usually found something that did the trick, but it would violate U.S. healthcare regulations.

> Well $@*#… can’t use this one!

I had a lot of these moments. It was very frustrating.

But it made me appreciate things like accessibility, download speed, industry-specific compliance (higher education, healthcare, government, etc.), and browser / device support. I don’t want to knowingly exclude folks from being able to use my project.

> The world doesn&#39;t need new and innovative interaction patterns as much as designers believe. It just needs shit to work.</p>&mdash; Cemre Güngör (@gem_ray)

Too often in tech, shit doesn’t “just work.”

## 5. Double-Down on Documentation
As amazingly self-documenting as I think my project is… yea, it’s really not. Prioritizing documentation makes a project more approachable and understandable. I try to remind myself that no one is in my brain but me (I hope). All those decisions I made in my head may as well not even exist to anyone else unless they’re documented somewhere.

- A decent [readme file](https://github.com/LappleApple/feedmereadmes/blob/master/README-maturity-model.md) helps people get up and running.
- Documentation helps explain why things work the way they do.
- Code comments are good for for granular things.
- Good commit messages explain what changed, when, and why.
- Thoughtful discussions in GitHub issues and pull requests explain what ideas were considered and why they were implemented (or not implemented).
- Demos help visualize results.

<figure>

![creenshot of Cerberus's code comments.](./images/open-source/cerberus-code.png)
<figcaption>Screenshot of Cerberus’s code; the dark gray text is code comments.</figcaption>
</figure>

## 6. Include Instructions on How to Contribute
As my project matured, it started to get a little attention. As folks started using it, they had ideas on how to fix stuff or add to the project. This is a great thing, though I hit a few stumbling blocks in the beginning because I didn’t specify any contribution guidelines. So I’d occasionally get messages like this:

> GitHub-User: Hey, I found and fixed a bug in a template. Here’s a pull request!
> Me: Thank you very much! Hey, Cerberus is actually three templates, would you mind fixing the other two?

People didn’t know how to help because I didn’t tell them. face-palm-dot-gif

I created [some contribution guidelines](http://tedgoas.github.io/Cerberus/#contribute) in the project’s docs to help steer the project in the direction I wanted to see it go and direct help where it’s needed most. So I don’t get a pull request out of nowhere with some changes I don’t want.

<hr role="presentation" aria-role="hidden">

## Examples!!

Alright, enough advice. Here are a few simple, focused, and well-documented open source projects I keep coming back to.

### [Bulletproof Background Images in Email](https://backgrounds.cm/)

Getting background images to display in email clients takes a lot of code that I’ll never memorize. This project provides a few options and spits out working code that can be pasted into any email template. It does this _one_ thing _really_ well.

<figure>

![Background.cm web interface.](./images/open-source/bulletproof-background-images-email.png)
<figcaption>Backgrounds.cm by Campaign Monitor</figcaption>
</figure>

### [Open Color](https://yeun.github.io/open-color/)
This project researched a color palette optimized for interfaces. It’s been tested for things like accessibility, brightness, and contrast across a range of different screens. The whole project is colors. That’s all it is. Brilliant.

<figure>

![Open Color GitHub repo.](./images/open-source/open-color.png)
<figcaption>Open Color by heeyeun</figcaption>
</figure>

### [.htaccess Snippets](https://github.com/phanan/htaccess)
I don’t know if I’d ever edited an .htaccess without bringing an entire site down… until I found this project. The entire project is the readme.md file, which contains paste-able snippets of common .htaccess commands. I’ll reference this until the day we hire an .htaccess programmer 😆.

<figure>

![.htaccess snippets GitHub repo.](./images/open-source/htaccess-snippets.png)
<figcaption>.htaccess snippets by Phan An</figcaption>
</figure>

### [Contract Killer](https://gist.github.com/malarkey/4031110)
Contract Killer is a popular open source contract for web professionals that translates confusing legal passages into layman’s terms. The entire project is a text document in a GitHub Gist. A contract is part of any freelance project I take on, so I’ve adapted my own version that I use each time.

<figure>

![Contract Killer GitHub Gist.](./images/open-source/contract-killer.png)
<figcaption>Contract Killer by Andy Clarke</figcaption>
</figure>

<hr role="presentation" aria-role="hidden">

## Wrapping up

I’m so happy you made it this far! So, to recap:

- Choose something timeless.
- Keep it small and focused.
- Use it yourself.
- Invest in good documentation.
- Guide folks on how to contribute.

Are you grinding on an open source project? Thinking about starting one? I’d love to know if you found something in here useful. Please leave a comment or [ping me on Twitter](https://twitter.com/TedGoas). On the off-chance you’ve used [Cerberus](http://tedgoas.github.io/Cerberus/), I’d love to hear about it! ✌️

<hr role="presentation" aria-role="hidden">

Also published <a href="https://medium.com/@tedgoas/anyone-can-open-source-9de60ce54e62">on Medium</a>
