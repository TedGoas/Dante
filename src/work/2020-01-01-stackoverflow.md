---
title: Stack Overflow
body_class: work
excerpt: I worked on Stack Overflow’s private Q7A products, our design system, and lots of other stuff.
thumb: /assets/img/stackoverflow/thumb-lg.jpg
featured_image: /assets/img/stackoverflow/thumb-sm.jpg
highlightjs: true
year: 2016 - 2020
---

I joined Stack Overflow in 2016 as a product designer on their Teams and Enterprise products. Additionally made significant contributions to Documentation (sunset), Stack’s design system, and various email marketing projects.

## Enterprise

Stack Overflow for Enterprise is a private, secure version of Stack Overflow for large teams to ask and answer questions amongst themselves. It was Stack Overflow’s first private Q&A product and I joined as the product’s first designer when I joined the company.

> It’s the same Stack Overflow developers know and love, built for teams to privately share information within their team.

As a product deisgner, I focused on:

1. Building tools for clients to manage their comminuty, and
2. Bending the public Q&A product in ways that make sense for teams but not the geneal public.

<figure class="unbound mt-12">
    <img src="/assets/img/stackoverflow/function.png" alt="" width="1000">
</figure>

### Theming

Security and privacy were top concerns of Enterprise customers. Many times folks had their private Enterprise site open in one tab and public Stack Overflow open in another, so it was important they know which is which at a glance so they don’t post info in the wrong place. One way we tackle this was to make a Stack Overflow themeable.

I created Stack Overflow’s first theming system and scaled for our enterprise clients. I refactored existing LESS variables so new themes could be created in eight(8) lines of code. Later I designed a UI allowing folks to update their theme without touching code. <a href="https://stackoverflow.com/users/115866/balpha">Balpha</a> and <a href="https://www.aaronshekey.com/work/stackoverflow/">Aaron Shekey</a> have since evolved this system to include the entire Stack Exchange network.

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
@font-family:           -apple-system, BlinkMacSystemFont, Avenir, ’Segoe UI’, Roboto, Helvetica, Arial, sans-serif;</code></pre>
    </div>
</figure>

### Tag Watching

Private Q&A products are smaller than public Stack Overflow, so it’s important that questions are seen by the folks who can answer them. Watching tags is a great way to personalize what you see on Stack Overflow, but tags weren’t designed with private Q&A in mind.

I created and tested a few prototypes that made tag watching more flexible while not overwhelming folks with notifications. <a href="https://rockercreative.com/work/stack-overflow">Paweł Ludwiczak</a> and <a href="https://www.aaronshekey.com/work/stackoverflow/">Aaron Shekey</a> further evolved the design to what’s on in the product today.

<figure class="unbound my-12">
    <img src="/assets/img/stackoverflow/tag-watching-sidebar.png" alt="" width="1470">
    <figcaption>Sidebar widget states and dev notes on proposed changes.</figcaption>
</figure>

### Admin Settings

In addition to adjusting the site for average folks, we created a suite of tools that enable admins to manage their own community. How the site looks, who has access to what, how notifications and awards work, that sorta thing.

<figure class="unbound">
    <div class="bg-white p-4 rounded inline-block">
        <img src="/assets/img/stackoverflow/admin-rep.png" alt="" width="860">
    </div>
    <figcaption>Visual cues that show how changing repuation levels will impact users.</figcaption>
</figure>

At one point when doing research interviews about an unrelated project, several clients mentioned that our settings weren’t organized well and some features were hard to find and understand. When hearing this became a theme, I pitched a redesign of our private Q&A settings and got it on an uncoming roadmap.

I worked with our customer success teams to identify the most used features, organized them using card sorting exercises, and created a flexible information structure that supports all of Stack Overflow’s Q&A products. After validating the new designs in user testing, we shipped the updated settings to our Enteprrise customers. A few months later, our Teams customers got the update as well.

<figure>
    <div class="bg-white p-4 rounded inline-block">
        <img src="/assets/img/stackoverflow/manage-users.png" alt="" width="855">
    </div>
    <figcaption>Settings screen for controlling user access and privileges.</figcaption>
</figure>

### Health Dashboard

Enterprise clients manage their own community, but understanding its health wasn’t always easy. Our theory was if clients could easily see the return on their investment, they’d have a good chance to renewing and growing. Our product didn’t give them a way to do this, so the goal was to create one.

> As an Enterprise admin, I want to know how I’m doing and measure ROI of Enterprise so that I’m aware of my community’s strengths and weaknesses. - Our user story

I started by speaking with our Customer Success team since their job is… <span class="whitespace-nowrap">customer… success</span> 😂 In all seriousness, turns out they had a pretty good quantifiable formula to indicate whether a community was healthy or in danger of churning.

How could we productize this so it could scale beyond the Customer Success team?

<figure class="max-w-3xl">
    <div class="grid grid-cols-2 gap-2 sm:grid-cols-2">
        <img src="/assets/img/stackoverflow/sketch1.jpg" alt="" width="400">
        <img src="/assets/img/stackoverflow/sketch2.jpg" alt="" width="400">
        <img src="/assets/img/stackoverflow/sketch3.jpg" alt="" width="400">
        <img src="/assets/img/stackoverflow/sketch4.jpg" alt="" width="400">
    </div>
    <figcaption>Results from a How Might We? sketching done remotely over video chat.</figcaption>
</figure>

I figured this project would be complex, so I organized and led a series of How Might We? sketching sessions with our developers, product managers, site reliability engineers, and even our product <abbr title="General Manager">GM</abbr>. This open collaboration generated in a bunch of differnet ideas, most of which we would have missed if design was kept within the design team.

I created several wireframes based on these ideas and shopped them around to my product team, in design critique, and a few customers. At this stage I helped write a functional spec, and kept it updated with research findings, notable conversations, and updated designs. This doc served as a single, findable source of truth throughout the project.

<figure>
    <div class="bg-white p-4 rounded inline-block">
        <img src="/assets/img/stackoverflow/dashboard.png" alt="Hi-def artwork of what we shipped." width="1100">
    </div>
    <figcaption>The design we shipped.</figcaption>
</figure>

When our direction felt validated, I moved into UI design. I looked at our own product and as well as competitors to get an idea of how others visualize data like ours. Sidenote: Say what you will about “fake work” on dribbble, <a href="blog/an-open-letter-to-designers-of-unsolicited-redesigns-and-unbuildable-apps">I find it incredibly useful</a>.

After creating a rough draft, I worked with our data scientist to review my data visualization choices. She raised a concern about zooming into the data too closely, so we decided not to break down data beyond a certain point (even though we technically could).

After I’d designed most of the feature’s views and states, I jumped into the codebase and translated my designs into front-end code. I made some last mile design decisions in code, like responsive views and adjusting the graphs’ appearance in D3.

A few times the project started veering towards in an in-depth analytics product. Whenever I saw this happening, I gently reminded the team of our north star to focus on trends and not get too detailed with the data.

<figure class="max-w-3xl">
    <div class="grid grid-cols-2 gap-2 sm:grid-cols-2">
        <img src="/assets/img/stackoverflow/state1.png" alt="Metric hover state." width="396">
        <img src="/assets/img/stackoverflow/state2.png" alt="Metric alternate hover state." width="396">
        <img src="/assets/img/stackoverflow/state3.png" alt="Metric empty state." width="396">
        <img src="/assets/img/stackoverflow/state4.png" alt="Metric loading state." width="396">
    </div>
    <figcaption>I designed and documented <a href="https://stackoverflow.design/product/components/cards/">our design system’s card component</a> based on this project.</figcaption>
</figure>

We saw an immediate drop in the time our customer success team spent reviewing metrics with clients because clients were now able to do this on their own. Shortly after launching for our Enterprise tier, the feature was scaled to **all other tier of Stack’s private Q&A product**.

Most feedback from our Enterprise customers came from client interviews, so I’d periodically check in with our customer success team to see how folks were reacting. The overall feedback good positive, but we heard that clients don’t always remember to visit their dashboard. they also wanted to share it with folks at their company. We needed to make the data more accessible and portable.

After hearing this a few times, I created and shipped an email digest to help solve these problems. We also looked at notifications and integrations (like Slack and MS Teams).

<figure>
    <img src="/assets/img/stackoverflow/email-dashboard.png" alt="A weekly email of the dashboard metrics." width="1100">
    <figcaption>I pitched, designed, and coded an email version of the dashboard’s metrics to make the data more portable.</figcaption>
</figure>

## Teams

In 2017, the Stack Overflow began creating a new product called Teams to fill a gap between the public Q&A product and Enterprise. The goal was to make a scaled-down version of the Enterprise product for smaller teams. Stack Overflow assembled a tiger team of folks including <a href="https://twitter.com/jzy">Jin</a>, <a href="https://www.joshuahynes.com/">Joshua</a>, <a href="https://rockercreative.com/work/stack-overflow">Paweł</a>, <a href="https://twitter.com/ChanceHeath">Chance</a>, <a href="https://twitter.com/KitCarrau">Kit</a>, myself, and several others to explore the product UX. I focused on the product’s first run experience: what happens after you’ve completed the signup flow and and land in the product for the very first time. In the interest of speed, I worked at a low fidelity and guided implementation as engineers used the design system to fill in the details in code.

<figure class="unbound">
    <div class="inline-block">
        <img src="/assets/img/stackoverflow/teams-empty-state.png" alt="" width="1000">
    </div>
    <figcaption>Wireframe concept for onboarding empty states. Teams was originally called "Channels."</figcaption>
</figure>

### Integrations

We don’t expect our customers to spend all day on Stack Overflow, so make our product more sticky, we met them where they already are. Slack, Jira, MS Teams, and the like. One way we did that was with integrations, which are table stakes these days. I worked across product teams to research, design, and test various designs and workflows to support several integrations for all our product lines.

<figure>
    <div class="grid-sointegrations sm:block">
        <img src="/assets/img/stackoverflow/jira.png" alt="Unfurled Jira link." width="552" class="jira shadow-xl -mb-16 sm:mb-4">
        <img src="/assets/img/stackoverflow/github.png" alt="Unfurled GitHub link." width="552" class="github shadow-xl sm:mb-4">
        <img src="/assets/img/stackoverflow/slack.png" alt="Slack integration." width="552" class="slack p-2 bg-white rounded shadow-xl sm:mb-4">
        <img src="/assets/img/stackoverflow/stackoverflow.png" alt="Unfurled Sack Overflow link." width="552" class="stackoverflow shadow-xl">
    </div>
    <figcaption>Link unfurling for Jira, GitHub, Slack, and Stack Overflow links.</figcaption>
</figure>

## Design system

During my time at Stack, I was an "enthusastic volunteer" on our design systems team. I built and documented components for <a href="https://stackoverflow.design/product/components/tables/">tables</a>, <a href="https://stackoverflow.design/product/components/cards/">cards</a>, <a href="https://stackoverflow.design/product/components/empty-states/">empty states</a>, <a href="https://stackoverflow.design/product/components/link-previews/">link previews</a>, <a href="https://stackoverflow.design/product/components/page-titles/">page titles</a>, and more. <a href="https://www.donnachoi.com/">Donna Choi</a> and I also created a section for <a href="">UX copy</a>.

My biggest contribution was <a href="https://stackoverflow.design/email">Stack Overflow’s email design system</a> (one of the first of its kind). I designed, coded, and wrote everything about how I built email at Stack Overflow. Tons of knowledge that was previously only in my head was now documented.

The email design system empowers non-email-designers to build well-designed, consistently-rendered email without knowing all the ins-and-outs of email design. It removed me as a bottleneck. I’ve written several articles and given a few conference talks about this topic.

<figure class="unbound">
    <div class="bg-white p-4 rounded inline-block">
        <img src="/assets/img/stackoverflow/stacks.png" alt="" width="1000">
    </div>
    <figcaption>Stacks emails design system.</figcaption>
</figure>

## Email Marketing and UX

When I joined Stack Overflow, the company didn’t send much email aside from a few transactional emails. Email templates were inconsistent and often broken in many places. I standardized our email design, fixed rendering issues, and set the company up to take some bigger swings with its email announcements. A lot of this work fed back into the aforementioned email design system.

<figure class="bordered">
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

### Email Preference Center

As Stack Overflow’s email program evolved and started to send better-targeted emails, <a href="https://www.donnachoi.com/">Donna Choi</a> and I redesigned our email preference center to keep pace and bring us in line with <abbr title="
General Data Protection Regulation">GDPR</abbr> compliance, which had just started being enforced. We <a href="/blog/email-preferences-design/">wrote a case study</a> about this project.

<figure>
    <img src="/assets/img/stackoverflow/email-prefs.png" alt="Screenshot of how an email’s unsubscribe link leads to email preferences." width="788">
    <figcaption>Updating the UX of managing emails subscriptions.</figcaption>
</figure>

## Experiments

Between projects, I explored several product and feature ideas. Some got prioritized on the roadmap while others never saw the light of day. Here are the ones I’m proud of:

### Voting from your email inbox

When speaking with Teams users, many mentioned wanting to improve their community’s culture of voting. Their team posts useful answers, but folks didn’t acknowledge them to signal a high quality answer for others.

If folks don’t return to the site to vote, what if we reduced that friction by meeting them in their inbox? This prototype explores what it would be like if you could vote on Stack Overflow questions right from your inbox.

<a href="https://codepen.io/tedgoas/pen/MWYpazJ" rel="me">View on Codepen</a>

<figure class="max-w-5xl">
    <p class="codepen" data-height="400" data-theme-id="dark" data-default-tab="html,result" data-user="tedgoas" data-slug-hash="MWYpazJ" style="height: 400px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; margin: 1em 0; padding: 1em;" data-pen-title="Voting in Email">
</p>
<script async src="https://static.codepen.io/assets/embed/ei.js"></script>
    <figcaption>Voting from your email inbox.</figcaption>
</figure>

### Grammarly on Stack Overflow

Language and tone are very important when participating on Stack Overflow. Data showed that well-crafted and properly-formatted questions are likely to get a positive response.

This design exploration productized some of our internal knowledge and experience of what makes for a good question.

<figure class="unbound">
    <div class="bg-white p-4 rounded inline-block">
        <img src="/assets/img/stackoverflow/grammarly.png" alt="" width="1357">
    </div>
    <figcaption>What would Stack Overflow’s version of Grammerly look like?</figcaption>
</figure>

### Dark mode in email

Developers love dark mode. The community mentioned it often and our survey data backed that up. With a co-worker leading efforts to bring dark mode to the website, I explored what it would take to bring dark mode to email.

<a href="https://codepen.io/tedgoas/pen/zYGNamR">View on Codepen</a>

<figure>
    <video controls width="750" class="rounded" autoplay="true" controls="false" loop="true" muted="true">
        <source src="/assets/img/stackoverflow/email-dark-mode.mp4" type="video/mp4">
        Sorry, your browser doesn’t support embedded videos.
    </video>
    <figcaption>Adapting Stack Overflow’s email for dark mode.</figcaption>
</figure>
