---
title: A Product Design Process for the Real World
body_class: blog
featured_image: "process/hero.png"
image_caption: A few diagrams of popular prudct design processes.
description: The product design playbook I use to break down and execute on design projects.
---

At the start of 2021, Dialpad’s core product was a business phone platform. We supported several use cases, but making and receiving phone calls over the internet was our bread and butter. By the end of the year, however, we acquired two companies and pledged to add email, chat, and social to our product. I was tasked to lead design for a project that would double the size of the product.

> *(cracks knuckles)* Alright, I’m an experienced designer. I can figure out how to get this done.

I quickly discovered this was a hard statement to deliver on.

Product designers have never had so many tools and techniques at our disposal to help us do our job. Research, journey maps, Figma, code, Keynote, data analysis... the list is huge and keeps growing. With so many options, how do we know which ones to use for our projects and when? 

And let’s be honest, how do we avoid doing this?

<figure>
	<img src="/assets/img/process/straight-to-figma.jpg" alt="A bunch of police cars labeled with UX and disovery terms chasing a white SUV labeled 'Me, jumping straight into hi-fidelity designs'." height="" width="600">
    <figcaption>We’ve all been guilty at one time or another.</figcaption>
</figure>

Some teams have distilled their product design process into a diagram or chart. At Dialpad, we adapted the double-diamond product design process into a triple diamond (influenced [by Zendesk](https://medium.com/zendesk-creative-blog/the-zendesk-triple-diamond-process-fd857a11c179)). Ours looks something like this:

<figure class="max-w-full">
	<img src="/assets/img/process/triple-diamond.png" alt="A diagram how how Dialpad modifed Zendesk's triple diamond design process." height="" width="1600">
    <figcaption>Graphics like this look great in a blog post, but how often are they actually referenced?</figcaption>
</figure>

That works most of the time. Though in reality, sometimes my process looks more like this:

<figure class="max-w-full">
	<img src="/assets/img/process/real-process.svg" alt="A diagram showing a project going from start to finish while taking several u-turns and detours along the way." height="" width="1265">
    <figcaption>The messy reality</figcaption>
</figure>

So it goes 🙃

What do I say when someone asks me that dreaded question?

> “What’s your product design process?”

I’ve picked up a bunch of tools and activities in my years as a product designer, but until recently, had never documented them. As a result, I occasionally forgot parts of the process and my designs suffered as a result.

To fix this, I wrote down each part of my process so I’d have a playbook to refer to in the future. This is that playbook.

I think about my design process not as a mandatory set of actions for every project, but rather a reference and a prompt I can use to either do a task or understand why it can be skipped. Like a carpenter’s toolbox, it’s helpful to remember what tools are available, and how and when they’re helpful.

## Discovery

Not having a clearly defined problem or goal can lead to hundreds of lost hours and resources because of misaligned expectations, incorrect project scoping, or unforeseen problems. While a team may feel they know these answers and so want to skip right to building something, it’s important to align and validate assumptions first so the project is set up for future success.

The goal of this phase is to help identify a problem statement, frame the problem, and gather enough evidence so we can confidently move forward into the ideation phase.

**Potential activities:**
(chose which ones make sense for each project)

- **Make observations:** What do we see? What do we know so far? This deepens our knowledge of the project and saves us from doing repeat discovery. Helpful when starting a Product Requirements Doc (PRD) or [design doc](https://medium.com/p/20ad24f75a8c). 🕓 2-3 days
- **Proto-Personas:** A combination of research and intuition that represent what we *think* our users are like. Helpful when people disagree on who are users are or what their needs are. 🕓 1-2 days
- **Journey mapping:** A visualization of the process someone goes through to complete a goal. Helpful when you want a big picture understanding of the user’s experience. This may include off-site things like user emotions or external touch points. 🕓 1 week. [Example](https://www.nngroup.com/articles/journey-mapping-101/)
- **Service blueprint:** Map out the environment that will be affected by a project, including how different parts of the environment interact with each other. Good for large projects that might impact many parts of a system. Service blueprints also help break down a project into manageable chunks and milestones. 🕓 1 week. [Example](https://www.nngroup.com/articles/service-blueprints-definition/)
- **Contextual inquiry:** Understand how folks use your product and why they do what they do. [Example](https://userpeek.com/blog/contextual-inquiry/)
- **Generative research:** Understand users’ motivations, pain points, behaviors. Five Whys is helpful in going beyond surface-level assumptions and uncovering root causes of a problem. 🕓 1-2 weeks (per round of research). [Example](https://maze.co/guides/ux-research/generative/)
- **Task analysis:** Map out the steps someone takes to complete a task, so you can add or remove steps to improve the process. [Example](https://www.interaction-design.org/literature/article/task-analysis-a-ux-designer-s-best-friend)
- **UX tear downs**: Learn from established or related patterns, especially when those patterns are easily accessible (generally harder for paid products). 🕓 1-2 days
- **Stakeholder / SME interviews:** Understand what we already know and/or have tried. Target folks with historical context of the problem. 🕓 1 week
- **Data analysis**: Answer questions about “how many” and “how often”. Get access to analytics and ask someone in Product Analytics to pull data. 🕓  1-2 days
- **UX canvas:** Show the team “why” they’re doing the current work, exposing gaps in the problem statement and solutions, and shifting the conversation from outputs to outcomes. 🕓 1-2 days. [Example](https://jeffgothelf.com/blog/leanuxcanvas-v2/)

### Exit Criteria

- **Problem statement:** 1 - 3 sentences describing user, their goal, and desired outcome supported by data.
- **A clear, achievable goal:** Outline of expected change(s) and how it ties back into specific product and/or business KPIs.
- **Success criteria:** Select measurable criteria that will be used determine if the solution is solving the problem.
- **Potential concerns, risks, or sticky areas of the project**

These should all be captured in a PRD or functional spec that the team will evolve throughout the project.

## Definition

By defining a problem, stating a goal, and articulating success metrics, the team has helped define some guardrails to design within. Time in this phase can vary depending on the problem and how strongly the team feels about the solution.

**Potential activities:**

- **Break down the project:** Organize the project into manageable chunks and milestones, assign responsibilities, and [delegate appropriately](https://larahogan.me/blog/delegation-is-an-art/). Estimate each phase so the work can be coordinated with other activities and teams. Helpful with large projects that impact multiple product areas. 🕓 2-3 days
- **Problem prioritization:** Make an Impact / Effort matrix for problems and workflows. Helps sequence potential solutions. 🕓 1 day
- **Design sprint:** An all-hands on deck design activity that designs or redesigns a product. Helpful when a quick solution is required, the challenge is big and complex, or the team is stuck. 🕓 5 days (per sprint)
- **Design workshop:** Quickly generate competing ideas for a specific problem or point in the UX. Crazy 8’s, card sorting, etc. Helpful with abstract problems that could be solved in numerous ways. 🕓 1 day (per workshop)
- **Rolling research:** Regularly check your understanding or test a design without having to worry about recruiting on a session-by-session basis.
- **Wireframes & prototyping:** Give the design a basic structure to see if design ideas hold together and “feel right”.
- **UI design & prototyping:** Helpful when the team is confident in a design’s direction and begin to focus on the finer details of a design like typography, color, spacing, UX copy, and interactions.
- **User testing:** Seek feedback about UX, UI, and copy. This step takes time, so use when the project is important enough to warrant an extra week or more.
- **Design reviews:** Regular reviews with other designers, your product team (product managers, engineers, QA, etc.), and (when appropriate) executive stakeholders. Helpful when managing up and around, giving folks at all levels visibility into our progress and the opportunity to contribute. Regular reviews also help ensure a design covers everything, including edges cases and non-happy paths.
- **Manage up and around:** Create a framework (email, chat post, slides, etc.) for regularly socializing the project’s progress and activities around to other product and up to executives. Helpful for high-profile projects with many interested stakeholders.

### Exit Criteria

- A plan to socialize the project
- A complete PRD
- Hi-fidelity designs that cover all known system states and edge cases.
*In my experience a design only needs to be 80%-90% complete to move into development. Engineers usually discover more edge cases and sometimes a designer needs to adjust the design until it “feels right” in the browser or app.

Product, design, engineering, and QA should all have the opportunity to contribute and sign-off before moving into development.

## Development

Using this playbook, I was able to take my project, quickly identify the activities that would have the most impact, and create a rough timeline. 

Product designers are responsible for the design that ends up in the product. For some designers that means creating a detailed design spec, for others it means pushing code directly. Regardless of your direct involvement in code, take an active role in working alongside engineering to implement designs as envisioned.

**Potential activities:**

1. **Finalize design details:** Complete any remaining design tasks that can be done after development starts. Writing error messages, creating animations, designing variable states, defining UX when used by assistive technologies, and anything else that can be done in parallel with development.
2. **Proactively QA designs.** Help ensure a test plan exists and ask for a preview link or periodic demos so we can proactively test features.
3. **Maintain documentation, update artwork.** Update documentation and designs with decisions and open questions after meetings and notable chat conversations. Designs and documentation should always be up-to-date so they continue to be a source of truth for the team.
4. **(For teams with a design system) Create new components.** Identify any new, potentially-reusable components created during the project, and formalize / document them in the design system.

## In Closing

This is what’s currently in my product design toolbox. Instead of standing in front of a huge project and feeling paralyzed, I’m able to reference this playbook and quickly identify the design activities that make sense for any given project. 

When faced with the daunting task of doubling the size of Dialpad’s product, I used this playbook to break this massive project into manageable chunks. For example, it helped me realize the need to create a service blueprint to see how other parts of Dialpad's product would be affected (something I may have missed a few years ago).

To reiterate:

> It’s not a mandatory set of actions that must happen for every project, but rather a reference and a prompt I can use to either do a task or understand why it can be skipped.

I also don’t do this alone. I work on many of these activities with my product managers and engineers. They also have their own toolboxes. But it’s on me to ensure we have a solid product design process.

---

Inspired by [A Product Designer’s Checklist](https://medium.com/zero-to-design/a-product-designers-checklist-891a1ccfc924) and evolved from [Tips for leading a design project](https://uxplanet.org/tips-for-leading-a-design-project-a638f5a71884). Thanks to [Stéphane Martin](https://twitter.com/stephane_m_) and [Beth Devine](https://twitter.com/bethadevine) for reading early drafts of this article.