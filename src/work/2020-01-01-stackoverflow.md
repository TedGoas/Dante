---
title: Stack Overflow
body_class: work
excerpt: I worked on Stack Overflow's private Q7A products, our design system, and lots of other stuff.
thumb: /assets/img/stackoverflow/thumb-lg.jpg
featured_image: /assets/img/stackoverflow/thumb-sm.jpg
highlightjs: true
year: 2016 - 2020
---

I joined Stack Overflow in 2016 as a product designer on their Teams and Enterprise products. Additionally made significant contributions to Documentation (sunset), Stack's design system, and various email marketing projects.

## Enterprise

Stack Overflow for Enterprise is a private, secure version of Stack Overflow for large teams to ask and answer questions amongst themselves. It was Stack Overflow’s first private Q&A product and I joined as the product's first designer when I joined the company.

> It’s the same Stack Overflow developers know and love, built for teams to privately share information within their team.

As a product deisgner, I focused on:

1. Building tools for clients to manage their comminuty, and
2. Bending the public Q&A product in ways that make sense for teams but not the geneal public.

<figure class="unbound mt-12">
    <img src="/assets/img/stackoverflow/function.png" alt="" width="1000">
</figure>

### Theming

Security and privacy are top concerns of Enterprise customers. In many cases, folks have their private Enterprise site open in one tab and public Stack Overflow open in another. It’s important they know which is which at a glance so they don’t post info in the wrong place. One way we tackle this is to make a branded theme for every client.

I created Stack Overflow’s first theming system into something we could scale for our enterprise clients. I refactored existing LESS variables so new themes could be created in as little as eight lines of code. In a later phase, I designed a UI that allows folks to update their theme without touching any code. <a href="https://stackoverflow.com/users/115866/balpha">Balpha</a> and <a href="https://www.aaronshekey.com/work/stackoverflow/">Aaron Shekey</a> have since evolved this system to include the entire Stack Exchange network.

<figure class="max-w-3xl mx-auto code-preview flex flex-col">
    <img src="/assets/img/stackoverflow/theming-preview.png" alt="Preview of a themed Stack Overflow theme." class="w-full">
    <div class="code">
        <pre><code class="code-block scss">@import "less/_enterprise-base.less";
⠀⠀⠀⠀⠀⠀⠀⠀⠀
//  ======================================
//  User-defined variables
//  ======================================
@logo-width:            150px;
@logo-height:           30px;
@topbar-background:     @black-025;
@topbar-nav-color:      @black-900;
@link-color:            #2b00f7;
@accent-color:          #007733;
 ⠀⠀⠀⠀⠀⠀⠀⠀⠀ 
//  Overrides and customizations
@font-family:           -apple-system, BlinkMacSystemFont, Avenir, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;</code></pre>
    </div>
</figure>

### Tag Watching

Private Q&A products are smaller than public Stack Overflow, so it's important that questions are seen by the folks who can answer them. Watching tags is a great way to personalize what you see on Stack Overflow, but tags weren't designed with private Q&A in mind.

I created and tested a few prototypes that made tag watching more flexible while not overwhelming folks with notifications. <a href="https://rockercreative.com/work/stack-overflow">Paweł Ludwiczak</a> and <a href="https://www.aaronshekey.com/work/stackoverflow/">Aaron Shekey</a> further evolved the design to what’s on in the product today.

<figure class="unbound my-12">
    <img src="/assets/img/stackoverflow/tag-watching-sidebar.png" alt="" width="1470">
    <figcaption>Sidebar widget states and dev notes on proposed changes.</figcaption>
</figure>

### Admin Settings

In addition to adjusting the site for average folks, we created a suite of tools that enable admins to manage their own community. How the site looks, who has access to what, how notifications and awards work, that sorta thing. While these setting _did_ exist, we didn't put the most care into their design.

<figure class="unbound">
    <div class="bg-white p-4 rounded inline-block">
        <img src="/assets/img/stackoverflow/admin-rep.png" alt="" width="860">
    </div>
    <figcaption>Visual cues that show how changing repuation levels will impact users.</figcaption>
</figure>

At one point when doing research interviews about an unrelated project, several clients mentioned that our settings weren’t organized well and some features were hard to find and understand. When hearing this became a theme, I pitched a redesign of our private Q&A settings and got it on an uncoming roadmap.

During the project, I worked with our customer success teams to identify the most used features, organized them using card sorting exercises, and created a flexible information structure that supports all of Stack Overflow's Q&A products. After validating the new designs in user testing, we shipped the updated settings to our Enteprrise customers. A few months later, our Teams customers got the update as well.

<figure>
    <div class="bg-white p-4 rounded inline-block">
        <img src="/assets/img/stackoverflow/manage-users.png" alt="" width="855">
    </div>
    <figcaption>Settings screen for controlling user access and privileges.</figcaption>
</figure>

### Health Dashboard

Enterprise clients manage their own community, but understanding its health wasn’t always easy. Our theory was if clients could easily see the return on their investment, they’d have a good chance to renewing and growing. Our product didn’t give them a way to do this, so the goal was to create one.

> As an Enterprise admin, I want to know how I’m doing and measure ROI of Enterprise so that I’m aware of my community’s strengths and weaknesses. - Our user story

First I spoke with our Customer Success team since their job is… <span class="whitespace-nowrap">customer… success</span> 😂 In all seriousness, turns out they had a pretty good formula that indicated whether a community was healthy or in danger.

Now that I knew which metrics to look at, it was time to explore how to organize and present them.

<figure class="max-w-3xl">
    <div class="grid grid-cols-2 gap-2">
        <img src="/assets/img/stackoverflow/sketch1.jpg" alt="" width="400">
        <img src="/assets/img/stackoverflow/sketch2.jpg" alt="" width="400">
        <img src="/assets/img/stackoverflow/sketch3.jpg" alt="" width="400">
        <img src="/assets/img/stackoverflow/sketch4.jpg" alt="" width="400">
    </div>
    <figcaption>Results from a How Might We? sketching done remotely over video chat.</figcaption>
</figure>

I figured this project would be complex, so I organized and led a series of How Might We sketching sessions with the Enterprise developers, product managers, site reliability engineers, and even our product <abbr title="General Manager">GM</abbr>. This open collaboration generated in a bunch of differnet ideas, most of which we would have missed if design was done only by the design team.

I created several wireframes based on these ideas and started shopping them around to my product team, in design critique, and a few customers. At this stage I helped write a functional spec, and kept it updated with research findings, notable conversations, and updated designs. This doc served as a single, findable source of truth throughout the project.

<figure>
    <div class="bg-white p-4 rounded inline-block">
        <img src="/assets/img/stackoverflow/dashboard.png" alt="Hi-def artwork of what we shipped." width="1100">
    </div>
    <figcaption>The design we shipped.</figcaption>
</figure>

When our direction felt validated, I moved into UI design. I worked with the design team and did some competitve research to get an idea of how other folks are visualizing data like ours. Sidenote: Say what you will about “fake work” on dribbble, <a href="blog/an-open-letter-to-designers-of-unsolicited-redesigns-and-unbuildable-apps">I find it incredibly useful</a>

I also worked with our data scientist, who helped review my data visualization choices. She raised a concern about zooming into the data too closely, so we decided not to break down data beyond a certain point (even though we technically could).

After I’d designed most of the design’s views and states, I jumped into the codebase and translated my designs into front-end code. I made some last mile decisions in code, like responsive views and adjusting the graphs’ appearance in D3.

A few times the project started veering towards in an in-depth analytics product. Whenever I saw this happening, I gently reminded the team of our north star to focus on trends and not get too detailed with the data.

<figure class="max-w-3xl">
    <div class="grid grid-cols-2 gap-2">
        <img src="/assets/img/stackoverflow/state1.png" alt="Metric hover state." width="396">
        <img src="/assets/img/stackoverflow/state2.png" alt="Metric alternate hover state." width="396">
        <img src="/assets/img/stackoverflow/state3.png" alt="Metric empty state." width="396">
        <img src="/assets/img/stackoverflow/state4.png" alt="Metric loading state." width="396">
    </div>
    <figcaption>I designed and documented <a href="https://stackoverflow.design/product/components/cards/">our design system's card component</a> based on this project.</figcaption>
</figure>

Most feedback on our Enterprise product was qualitative data from client interviews, so I'd periodically check in with our customer success team to see how our clients are reacting. We heard that clients don’t always remember to visit their dashboard, and when they do they want to share it with folks at their company. We needed to meet people where they already are.

After hearing this a few times, I created and shipped an email digest. We were also looking at notifications and integrations (like Slack and MS Teams) that would make the dashboard’s data more portable.

<figure>
    <img src="/assets/img/stackoverflow/email-dashboard.png" alt="A weekly email of the dashboard metrics." width="1100">
    <figcaption>I pitched, designed, and coded an email version of the dashboard's metrics to make the data more portable.</figcaption>
</figure>

Overall we’ve seen our customer success team spending less time walking clients through their data because clients are able to understand it on their own. While designed for enterprise, this design is currently being used by **every tier of our private Q&A product**.

## Teams

In 2017, the Stack Overflow created a new tier of private Q&A product called Stack Overflow for Teams. It was a new product, so leadership gathered several folks from across the company to help with various efforts. I worked with Jin, Joshua, Pawel, Chance, Kit, and several others to explore the product UX.

<figure class="unbound">
    <div class="inline-block">
        <img src="/assets/img/stackoverflow/teams-empty-state.png" alt="" width="1000">
    </div>
    <figcaption>Wireframe concept for onboarding empty states. Teams was originally called "Channels."</figcaption>
</figure>

Stack Overflow assembled a tiger team of folks. Everyone focused on a different area, with each piece coming together at the end. One area I focused on was the empty state part of onboarding: what happens after you’ve completed the signup flow and and land in the product for the very first time. It was an extremely interesting project and also really challenging given the limited period of time we had for this work.

### Integrations

One way we’re focusing on product adoption and renewals of our private Q&A products is with integrations. We don’t expect our customers to spend all day on Stack Overflow, so we meet them where they already are.

<figure class="unbound">
    <div class="grid-sointegrations sm:block">
        <img src="/assets/img/stackoverflow/jira.png" alt="Unfurled Jira link." width="552" class="jira shadow-xl -mb-16 sm:mb-4">
        <img src="/assets/img/stackoverflow/github.png" alt="Unfurled GitHub link." width="552" class="github shadow-xl sm:mb-4">
        <img src="/assets/img/stackoverflow/slack.png" alt="Slack integration." width="552" class="slack p-2 bg-white rounded shadow-xl sm:mb-4">
        <img src="/assets/img/stackoverflow/stackoverflow.png" alt="Unfurled Sack Overflow link." width="552" class="stackoverflow p-2 bg-white rounded shadow-xl">
    </div>
    <figcaption>Link unfurling for Jira, GitHub, Slack, and Stack Overflow links.</figcaption>
</figure>

I worked across product teams to research, design, and test various integration visuals and workflows that support multiple integrations across all our product lines.

## Design system

Over several weeks, I documented a bunch of email knowledge I’d built up in my head over the years into Stack Overflow’s first email design system. I designed, coded, and wrote everything about how Stack Overflow builds email. I’ve written a few blog posts and given a few conference talks about our design system.

<figure class="unbound">
    <div class="bg-white p-4 rounded inline-block">
        <img src="/assets/img/stackoverflow/stacks.png" alt="" width="1000">
    </div>
    <figcaption>Stacks emails design system.</figcaption>
</figure>

My design system work isn’t limited to email, though. I create components and documentation for tables and cards, as well as several sections for UX copy. I actively contribute to our design system, albeit sporadically.

## Email Marketing and UX

When I joined Stack Overflow, we didn’t send much email aside from a few messages sent to active Q&A users and basic things like resetting a password. Email templates were inconsistent and often broken in many places. I helped standardize our email design, fixed our rendering issues, and set us up to take some bigger swings with our email announcements.

<figure class="unbound  bordered">
    <div class="flex items-center gs4 sm:block">
        <div class="flex--cell sm:mx-auto sm:mb-4">
            <img src="/assets/img/stackoverflow/email-teams.png" alt="Teams product launch email." width="680">
        </div>
        <div class="flex--cell sm:mx-auto sm:mb-4">
            <img src="/assets/img/stackoverflow/email-10th.png" alt="10th anniversary email." width="680">
        </div>
        <div class="flex--cell sm:mx-auto">
            <img src="/assets/img/stackoverflow/email-research.png" alt="user research recruitment email." width="680">
        </div>
    </div>
    <figcaption>Email designs for Teams product launch (<a href="https://stackoverflow.design/email/templates/examples/teams.html">live code</a>), 10th anniversary (<a href="https://stackoverflow.design/email/templates/examples/10th.html">live code</a>), and user research recruitment.</figcaption>
</figure>

As our email program evolved and we started to send better-targeted emails, I helped redesign our email preference center to keep pace. My coworker and I wrote about our design goals and published a UX case study for this project.

<figure>
    <img src="/assets/img/stackoverflow/email-prefs.png" alt="" width="788">
    <figcaption>Changing the UX of clicking an unsubscribe link.</figcaption>
</figure>

I also initiated Stack Overflow’s email design system that empowers non-email-designers to build well-designed, consistently-rendered email without knowing all the ins-and-outs of email design.

## Experiments

Between projects, I’ve explored several product and feature ideas. Some got prioritized on the roadmap while others never saw the light of day. I’m proud of these self-initiated projects.

### Voting from your email client

When speaking with SO for Teams users, some mention they’d like to improve their culture of voting. Eg. The team posts useful answers, but folks don’t upvote or accept the best ones to signal a high quality answer to the rest of the team.

This prototype explores what it would be like if you could vote on Stack Overflow questions right from your inbox.

<a href="https://codepen.io/tedgoas/pen/MWYpazJ" rel="me">View on Codepen</a>

<figure class="unbound max-w-5xl">
    <p class="codepen" data-height="400" data-theme-id="dark" data-default-tab="html,result" data-user="tedgoas" data-slug-hash="MWYpazJ" style="height: 400px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; margin: 1em 0; padding: 1em;" data-pen-title="Voting in Email">
</p>
<script async src="https://static.codepen.io/assets/embed/ei.js"></script>
    <figcaption>Voting from your email client.</figcaption>
</figure>

---

### Grammarly on Stack Overflow

Language and tone are very important when participating on Stack Overflow. What if we could help users craft a high-quality question that’s likely to get a positive response?

<figure class="unbound">
    <div class="bg-white p-4 rounded inline-block">
        <img src="/assets/img/stackoverflow/grammarly.png" alt="" width="1357">
    </div>
    <figcaption>What would Stack Overflow's version of Grammerly look like?</figcaption>
</figure>

---

### Dark mode support in email

Developers love dark mode. The community mentions it often and our survey data backs that up. With a co-worker leading efforts to bring dark mode to the website, I explored what it would take to bring dark mode to email.

<figure>
    <video controls width="750" class="rounded" autoplay="true" controls="false" loop="true" muted="true">
        <source src="/assets/img/stackoverflow/email-dark-mode.mp4" type="video/mp4">
        Sorry, your browser doesn't support embedded videos.
    </video>
    <figcaption>Adapting Stack Overflow's email for dark mode.</figcaption>
</figure>

<a href="https://codepen.io/tedgoas/pen/zYGNamR">View on Codepen</a>
