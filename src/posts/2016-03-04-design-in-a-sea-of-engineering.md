---
title: Design in a Sea of Engineering
body_class: blog
featured_image: design-in-a-sea-of-engineering/hero.svg
image_caption:
description:  How I get by as the sole designer working in an engineering led company.
---

As the sole designer on my team, I sometimes have trouble managing my workload.

At the time of this writing, I support a team of nine back-end developers and research engineers at [Canfield Scientific](http://www.canfieldsci.com/). They focus on PHP, JavaScript, databases, servers, security, and algorithms. I focus on visual design, HTML/CSS, interaction patterns, responsive design, and user experience. There’s a little overlap, but not much. Canfield is a small, engineering-led company. C’est la vie.

Each developer focuses on one or two projects at a time. Their work is exceedingly hard, so I can appreciate the need to really immerse oneself in a project. My job is to make their work understandable, usable, and credible.

My job is to support them.

All of them.

So I frequently juggle eight or nine projects at once. I can’t stay on a project continuously as it’s nurtured from prototype to release-ready, but I want to give each project my very best effort.

> Each developer must be able to work in my absence without becoming blocked.

This is how the design process usually works at Canfield.

---
<figure>
	<img src="/assets/img/design-in-a-sea-of-engineering/notes.svg" alt="" width="294">
</figure>

I attend every kickoff meeting I can get into. Kickoff meetings are key in establishing vision, identifying who can help in certain areas, and seeing who has skin in the game. I listen, ask questions, take notes, and afterwards, send everyone a copy to explain what I took away from the meeting. Documenting this up front is key, which I’ll explain a little later.

I usually don’t get to talk directly to our clients. While I’d love to get information first hand and bypass my team’s biases, this is the nature of the business. So I mostly interpret the vision of product managers and Canfield’s owner (who _do_ talk directly to customers). I ask a ton of questions to anyone who is closer to the client than me. Any research is better than no research. With these insights, I start to prototype.

---
<figure>
	<img src="/assets/img/design-in-a-sea-of-engineering/flowchart.svg" alt="" width="294">
</figure>

The design fidelity I start with varies with each project. For web projects, I usually wireframe in HTML/CSS/JS. For iOS design, I use a visual tool like Sketch because I don’t know how to code for iOS. Ryan Singer has a good article about [choosing design fidelity](https://m.signalvnoise.com/the-fidelity-curve-weighing-the-costs-and-benefits-of-interface-design-mockups-b259634807e2#.fhppkuoc7). Either way, I start by creating the core screens and linking them together to give a feel of the experience and flow. My initial designs are low fidelity, because changes ~always~ come in internal demos.

Leading up to demos, I’m hopeful we’re at least on the right track. We’ve defined the goals and done some research. The experience is lo-fi, but the foundation is there. No matter how much I think I’ve nailed it on my first try, our team always has insights midway through a project, so I’m prepared for that. As the demo starts, ideas come. We question the flow and consider redoing large portions of the UI. Here is where having those documented goals is helpful. Having this reference helps us identify which ideas are true to a project’s goals (and worth exploring) and which are not. Occasionally our first pass misses the mark entirely, in which case we reexamine our goals and start over. Regardless of what happens, not too much time was spent on those mocks.

After a few rounds of this, hopefully the design is looking pretty solid. Sweet! Time to kick the fidelity up a notch.

---
<figure>
	<img src="/assets/img/design-in-a-sea-of-engineering/binary.svg" alt="" width="294">
</figure>

For projects where a developer will be doing all the the code (eg. iOS), I lean on tools like Photoshop, Sketch, Principle, and Marvel to produce high fidelity mockups and interactions. If I can’t help build the actual thing, I visually document the design so the developer doesn’t have to guess. Design hand-offs are followed by lots of short, frequent chats about implementation as the dev goes. These chats teach me about constraints and considerations of a platform, which inform future projects.

This is about all I have to say about native mobile design, as I’m still pretty new at it.

---
<figure>
	<img src="/assets/img/design-in-a-sea-of-engineering/draw.svg" alt="" width="294">
</figure>

For web sites and applications, I can help build the thing, so I start transforming my prototype HTML/CSS/JS into something more production ready. Sometimes I design a full page or a few visual patterns in Photoshop to give myself something to aim for, but code and a browser are my BFF’s at this point. I can tackle viewports, performance, browser bugs, interaction timing, and content issues all while designing the page. Pretty great. Lots of folks advocate for this, so I won’t drive it into the ground.

My goal is to pair with a developer and establish a design system they can run with. Remember there’s only one of me. I might not be able to redesign an interface if new insights pop up later. This creates a scenario similar to what [Ryan Singer describes](https://www.quora.com/Should-I-focus-on-a-good-user-experience-or-push-something-out-quickly/answer/Ryan-Singer):

> On the very first iteration the design possibilities are wide open. The designer defines some screens and workflows and then the programmer builds those. On the next iteration, it’s not wide open anymore. The new design has to fit into the existing design, and the new code needs to fit into the existing code. Old code can be changed, but you don’t want to scrap everything. There is a pressure to keep moving with what is already there.<br><br>Our early design decisions are like bets whose outcome we will have to live with iteration after iteration. Since that’s the case, there is a strong incentive to be sure about our early bets. In other words, we want to reduce uncertainty on the first iterations.

So I design with the future in mind. That menu has five items now, but adding a sixth will cause it to overflow. Let’s solve this issue before we get to six links. The product category only has three products in it now? But it could have 20 by year’s end. And I heard there might be a category with just one product. So let’s anticipate that as best we can.

---

<figure>
	<img src="/assets/img/design-in-a-sea-of-engineering/code.svg" alt="" width="294">
</figure>

I write HTML so developers can copy and paste the patterns. Using BEM-style class naming system not only cuts down on specificity errors, but it’s intentionally verbose class names explain exactly what each HTML pattern is for. This helps prevent developers from pasting things where they don’t belong. Ex. pasting the pattern for `.product-details-menu` into the blog section. I’m also digging into Dan Mall’s concept of [content vs. display patterns](http://danielmall.com/articles/content-display-patterns/), which could improve this further.

> Make the right things easy and the wrong things hard.

Common CSS patterns (atoms and molecules, if you subscribe to Atomic Design) are organized into a global file, similar to how Jonathan Snook moves code [from crust to core](http://snook.ca/archives/html_and_css/code-from-crust-to-core). The remaining CSS stays in area files, no more than one per page. DRY is ideal, but [RYALAP](https://twitter.com/hashtag/ryalap) is more realistic. Hey, we’re all trying.

I keep the CSS pretty simple so the developers can understand it. They aren’t as familiar with all this pre/post-processor stuff.

* I use pre-processor syntax [sparingly](https://blog.colepeters.com/on-writing-real-css-again/), mostly for variables and tiny mixins.
* Aside from psuedo selectors, [I rarely nest CSS](http://markdotto.com/2015/07/20/css-nesting/). I’m already using BEM, so I don’t need to incur the risk of making something overly specific and causing an error.
* I’m mindful to minimize [magic numbers](https://css-tricks.com/magic-numbers-in-css/) and keep my [Shame CSS](http://csswizardry.com/2013/04/shame-css/) to a minimum so the CSS scales safely.

<blockquote class="twitter-tweet"><p lang="en" dir="ltr">Solid argument <a href="https://t.co/iRWpVEsjO0">https://t.co/iRWpVEsjO0</a> <a href="https://twitter.com/hashtag/css?src=hash&amp;ref_src=twsrc%5Etfw">#css</a> <a href="https://twitter.com/hashtag/webdev?src=hash&amp;ref_src=twsrc%5Etfw">#webdev</a> <a href="http://t.co/iUOhhBAhA7">pic.twitter.com/iUOhhBAhA7</a></p>&mdash; Ted Goas (@TedGoas) <a href="https://twitter.com/TedGoas/status/601376543978446848?ref_src=twsrc%5Etfw">May 21, 2015</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>

This leaves developers with a solid core of (mostly vanilla) CSS patterns that can be combined to create pages. When they encounter something without an obvious HTML pattern, they loop me back into the project (more on that in a bit).

JavaScript is the area where I have the most overlap with our engineers. Usually the JavaScript I write toggles class names on and off (with CSS doing the rest). I’m comfortable writing JavaScript for prototypes and basic sites, but I look to the engineers for projects that call for optimized, production-ready JavaScript.

---
<figure>
	<img src="/assets/img/design-in-a-sea-of-engineering/discuss.svg" alt="" width="294">
</figure>

Remember, the overarching goal here is to empower developers to design screens. A big part of that is **being available** when a developer has a question or becomes stuck, even if I’ve moved to different project. Some conversations are general, like explaining why things are named the way they are. Some are specific, like how to lay out a screen by combining code patterns (whiteboards are great for this). These conversations help unblock developers and improve the system.

But sometimes the code a developer needs just isn’t there. They will be tempted to write one-off HTML/CSS to solve the problem in front of them. Instead I ask them to loop me back into the project. Instead of just fixing the problem at hand, we figure out what the design system needs to do, and then add code in a responsible manner. This stuff is going to spread, remember?

---
<figure>
	<img src="/assets/img/design-in-a-sea-of-engineering/chat.svg" alt="" width="294">
</figure>

I read a lot about how other teams talk with customers, design in teams, and constantly refine user experience. While this is not my reality, my team has struck a great balance of shipping good design with a relatively small team. We do as much research as we can, spend time making sure our early design bets are good ones, design in a future-friendly manner, and make sure things don’t deteriorate over time.

This is how I get by as the sole designer working in an engineering led company.

---

Thanks to [Jason](https://twitter.com/RodriguezCommaJ), [Jim](https://twitter.com/jimesilverman/), and [Will](https://twitter.com/willgrounds) for help with this article.

credit: [Monoline Icons](https://creativemarket.com/Bloomua/113737-Monoline-Icons-Collection)