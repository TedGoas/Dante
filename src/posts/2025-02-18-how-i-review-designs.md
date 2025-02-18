---
title: How I review design work
body_class: blog
featured_image: "reviewing-design-work.png"
image_caption: Four abstract graphs offering feedback.
description: Defining what "good design” actually looks like.
---

Defining what "good design” actually looks like.

---

Good design can be tricky. What’s obvious to one person might not make sense to someone else. Design might feel subjective, but there are things I (and the rest of design leadership) consistently look for when reviewing designs.

Good design is the result of early and good collaboration. Early designs usually won’t check every box, but we can anticipate some stuff and avoid spending too much time on designs that don’t quite land.

**This document attempts to define what “good” actually means for design at Dialpad.** It gives us a shared target so that when we get to leadership reviews, we’ve anticipated much of their feedback and they trust that the direction is good.

## Have a Narrative

It’s important to start with why we’re doing a project in the first place. Is it a metric we’re trying to improve? Is it an unmet user need we’re solving for? A sale we’re trying to close? Before I look at any screens, I need to understand why we’re doing something in the first place. It helps us all stick to first principles when reviewing designs.

**You know how we say that storytelling is important? This is what we mean.**

Only after I have this context can I give you feedback that’s actually helpful and not just skin-deep “increase the spacing here” type feedback.

You don’t always need a slide deck, 1-2 paragraphs or a 30 second spiel is usually good enough. I don’t appreciate being dropped in the middle of a Figma file with no notes, nor do I appreciate being linked to a large Jira epic or 15-page PRD just to know what a project is.

Design leadership covers a lot of ground and I’m relying on **you** to tell me what a project is and why it matters.

Be strategic about what you share and what feedback you’re after. You shouldn’t show and explain everything in the design file. To this end, it’s helpful to organize your thoughts and Figma file ahead of time. It’s incredibly hard to follow someone rambling while zipping around a Figma artboard over screenshare. You likely won’t get the feedback you’re looking for this way.

## Your Own Ideas

Often a PM or engineer will introduce a project with a solution already in mind. It’ll be included in the Jira ticket, described in a PRD, or mentioned in a meeting. And that’s great. We should definitely explore and draw out other people’s ideas. But I want to see you thinking of your own ideas too.

**Figuring out what to do is a big part of senior design roles.**

I want to see that you’re not just executing someone else’s ideas. I want to see that you’ve explored an idea from at least two or three different angles (read: not the same idea with two or three minor variations).

Coming up with different ways to solve a problem shows that you’re not just doing what you’re told, but really using your own judgment. That’s what makes someone great in a senior role. Don’t be afraid to ask questions and suggest bold ideas. The way you come up with and improve ideas is just as important as making them happen.

## Consistency vs. Innovation

Dialpad has been around for a while, which means we’ve built up a lot of design patterns that are quick and easy to use. But let’s not settle for “quick and easy” if there’s room for improvement. Sometimes a new approach could make things better.

When reviewing designs, I ask myself the following questions about consistency and innovation:

- Are we proposing a new solution to an old problem? Is there a good reason?
- Do we have examples across the product that do something similar, while noting the pros and cons?
- Does the design use patterns customers are used to, or would it be something new they’d have to learn?

If there is an existing pattern that accomplishes a task, I want to see it. At the same time if you think a new pattern is warranted, I want to see that too. Bonus points if you have a reasoned preference towards one or the other.

While fixing inconsistencies is important, we should also think about the user’s context. Sometimes it’s important to push for a better experience even if it means more work. Other times it’s better to stick with what we have for the sake of consistency and speed. Having multiple designs drawn out helps facilitate this discussion.

## Masking Complexity

Dialpad is an incredibly complex product that contains a lot of technical workflows and generates a ton of data.

Our customers shouldn’t have to know that.

Our aim should be to make communication instantly and easily understood, like a web browser does for connecting to and displaying websites.

When reviewing designs, I ask myself the following questions about scaling a feature:

- Is the information presented in a screen easy to understand at a glance? Can the user go deeper if they want?
- Does it involve too many clicks? Are we asking users to do things we could automate?
- How might a new user perceive this feature? What about a power user?
- Do we need to build something new? Or can we change something we already have?

The design should be easily understood but robust enough to handle complexity and scale.

## UX Copy

Remember [design is mostly words](https://signalvnoise.com/posts/3404-reminder-design-is-still-about-words). I want to see you hold UX copy to the same standard as user flows, rectangles, and color.

When reviewing designs, I ask myself the following questions about UX copy:

- Can there be less words? Whether it’s a blog post or a single form field, my first reaction when writing anything is to remove words.
- Is the language clear? Can we simplify or remove technical jargon, acronyms, and internal speak?
- Is the language consistent? Will I understand this based on what I already know about Dialpad? Are we using [verbs](https://dialtone.dialpad.com/guides/content/action-language/) consistently? What about [date and time](https://dialtone.dialpad.com/guides/content/grammar-and-mechanics/#date-and-numbers) formats? Even things like [capitalization](https://dialtone.dialpad.com/guides/content/grammar-and-mechanics/#capitalization) are important.

We have [copy guidelines](https://dialtone.dialpad.com/guides/content/) and a [ChatGPT bot](https://chatgpt.com/g/g-DW8egWr9M-dp-copy-optimizer) trained in Dialpad’s voice and tone. Use them!

When writing copy, I usually put something like this into ChatGPT:

```
Rewrite the following sentence 10 times. Keep it short, 10-15 words max.
Use simple language and the rules you know for our UX copy.
"A poorly written sentence that gets my idea across."
```

Usually the best copy is a combination of these examples. I used this technique when writing this article.

## How Does It Feel?

When reviewing workflows, a prototype is worth a thousand static screens. I love seeing prototypes early, like even at the wireframe stage. It helps me preview what it would feel like to actually use the design.

When reviewing prototypes, I ask myself the following questions:

- How discoverable is a feature? If I was new to the product, would I understand where to go and what to do?
- How does it feel? Is it a lot of clicks? How are the transitions between steps?
- How does it make me feel compared to other apps I use? How would I feel if I had to use this design every day? Every week?

It’s not always practical to prototype in code, so things like Figma prototypes offer the next best thing to how a design would actually feel in the product. From new user onboarding through to task completion, an interactive prototype gives me a decent idea of what the user journey would feel like from start to finish.

## How Could This Fail?

Most design reviews focus on selling an idea, convincing the audience why a design is good. But that’s only part of the equation. I want to know about the downsides too. We should be our own worst critic.

What are the pros *and* the cons of each design direction. How could a design fail? When reviewing a design, I’ll be looking for reasons why it won’t work or how it could be abused or exploited, so it helps if you’ve thought about this too. Thinking about this ahead of time helps facilitate the discussion amongst the team.

## Conclusion

While not an exhaustive list of things that will make design “good,” thinking about these things ahead of time helps focus the discussion with leadership around around deep, meaty topics.

When we embrace different definitions of "good," lean on clear frameworks, and create a supportive space for critique, we can deliver design work that hits both creative and business goals.