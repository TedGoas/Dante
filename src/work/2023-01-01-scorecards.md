---
title: Scorecards
index_title: Scorecards
body_class: work
excerpt: How Dialpad Scorecards grew from manual QA into an AI grading platform supervisors can trust.
year: 2020 - present
role: Design lead, Support
index_summary: Grew Dialpad Scorecards from a manual QA tool into an AI grading platform, with trust and overrides designed in from the start.
index_image: /assets/img/scorecards/th-work-scorecards.svg
index_image_alt: Dialpad Scorecards product design.
index_card_layout: framed-inset
---

Scorecards is a QA tool for contact centers. A big part of a supervisor’s job is watching conversations and finding ways to make them better, usually with more volume than time. Even a small support operation can log hundreds of conversations a day. Scorecards helps teams evaluate that work at scale over time, and suggest improvements, without grading everything by hand.

This is the story of how we got from a fully manual product to the AI grading experience that ships today, and what we learned about trust along the way.

<section class="work-gallery" aria-label="Scorecards case study">
  <figure class="work-gallery__item">
    <figcaption class="work-gallery__caption">What’s in production today</figcaption>
    <p class="work-gallery__description">There’s a lot moving in this demo. Builder, grading, evidence, analytics. We don’t need to take it all in at once. I want to show where we landed first, then walk through how we got here.</p>
    {% prototypeEmbed "scorecards", "Dialpad Scorecards product in production.", 1440, 900 %}
    <p class="work-gallery__followup">A lot of this project was as much about managing customer experience and expectations as it was about the model. The details below are the path from manual grading to AI that supervisors were willing to turn on.</p>
  </figure>

  <figure class="work-gallery__item">
    <figcaption class="work-gallery__caption">Make quality measurable</figcaption>
    <p class="work-gallery__description">Ask ten contact center supervisors how they run their team and you’ll get ten answers. Everyone tracks different metrics. Everyone has a different definition of what good looks like. We started from an existing Scorecards product I had designed a couple years earlier: create a scorecard, grade a call, then look at the analytics. Three pieces that stayed a common thread the whole way.</p>
    {% prototypeEmbed "scorecards-v1-mvp", "Dialpad Scorecards manual grading MVP.", 1440, 900 %}
    <p class="work-gallery__followup">It gave supervisors a way to grade calls objectively, but it was completely manual. Only about 2% to 3% of conversations actually got scored. Useful, and nowhere near a complete picture of the floor. As we signed larger customers, some teams hired people whose whole job was grading. They didn’t need supervisor privileges like schedules, live listen-in, or full analytics, so we created a new grader role for them.</p>
  </figure>

  <figure class="work-gallery__item">
    <figcaption class="work-gallery__caption">What if quality could scale?</figcaption>
    <p class="work-gallery__description">We had growth targets. We wanted into larger RFPs, and we needed a QA tool that covered more ground, gave better insights, and made Dialpad stickier. AI was getting serious around the same time, and Dialpad GPT was getting off the ground, so we explored how it could help with the volume problem.</p>
    <img src="/assets/img/scorecards/scorecards-discovery.webp" alt="Scorecards discovery collage with sketches, journey map, competitive research, and early prototypes." width="1920" height="1080" loading="lazy">
    <p class="work-gallery__followup">Discovery was a team sport. Crazy 8s included PMs, engineers, and QA, not just design, and a lot of those ideas made it into the product. Competitive teardowns, a service blueprint, and internal search through Glean helped us move faster on homework. A PM even sent a rough Figma Make prototype with a short note instead of a PRD. We took that spirit and went wide on purpose, something like a dozen rough variants in a little more than a day. Bootstrap-looking on purpose. The point was to poke at what felt right.</p>
  </figure>

  <figure class="work-gallery__item">
    <figcaption class="work-gallery__caption">First AI release: suggest, don’t decide</figcaption>
    <p class="work-gallery__description">The first automated step was limited on purpose. We wanted to build trust, not get into trouble with AI features. Yes or no questions only, based on trigger words. Deterministic. When AI weighed in, it only suggested. It did not grade, and it did not fill the fields. Just “I think this is what you want,” hopefully saving a click or two.</p>
    {% prototypeEmbed "scorecards-v1-ai-questions", "Dialpad Scorecards AI-assisted grading.", 1440, 900 %}
    <p class="work-gallery__followup">We originally wanted to pre-select those radio buttons. Reading GDPR a certain way made that look like AI had already decided, even though a human still had to submit the form. Gray area. We played it safe and left the suggestions as suggestions. The bigger twist: as more conversations got graded, agents wanted a way to appeal scores they disagreed with. Their livelihood is numbers-driven. We knew dispute mode would matter, hoped we could ship it later, then heard from beta customers that it was a requirement. We prioritized it as a fast follow before moving on.</p>
  </figure>

  <figure class="work-gallery__item">
    <figcaption class="work-gallery__caption">Questions the way people coach</figcaption>
    <p class="work-gallery__description">Trigger words were fine. Understanding intent is something else. We asked what if customers could write questions the way they actually coach, so the scorecard became both a rubric and a grading engine. Automation like that creates a new trust problem: if AI submits the score, how does a human stay in control?</p>
    {% prototypeEmbed "scorecards-v3-llm-questions", "Dialpad Scorecards AI automated grading with natural language.", 1440, 900 %}
    <p class="work-gallery__followup">Natural language is powerful and ambiguous. If someone types jargon or an acronym, we wanted AI to call that out instead of inventing a definition and scoring calls wrong. You can rewrite the question, or define the term on the spot, and AI checks that it still understands. Skip conditions need the same precision. When a question is scored, you can open the part of the conversation used as evidence. The tech was there. The hard part was making natural language feel safe enough to use. We also ran this with an early access group for months before general availability, previewing in research and letting them live on the beta.</p>
    <div class="work-gallery__thumbs work-gallery__thumbs--halves">
      <figure class="work-gallery__thumb">
        <div class="work-gallery__thumb-media work-gallery__thumb-media--inset work-gallery__thumb-media--inset-card">
          <img src="/assets/img/dialpad/th-scorecards-unclear-term.svg" alt="Scorecards unclear term warning." loading="lazy">
        </div>
        <figcaption class="work-gallery__thumb-caption">When AI hits jargon it does not know, it asks for a definition instead of inventing one.</figcaption>
      </figure>
      <figure class="work-gallery__thumb">
        <img src="/assets/img/dialpad/th-email-digest-mobile.svg" alt="Scorecards weekly report." loading="lazy">
        <figcaption class="work-gallery__thumb-caption">A mobile weekly report that puts QA metrics in the inbox, not only in the app.</figcaption>
      </figure>
    </div>
  </figure>

  <figure class="work-gallery__item">
    <figcaption class="work-gallery__caption">What showed up after</figcaption>
    <p class="work-gallery__description">All three types still excel in different places: fully manual, AI-assisted suggestions, and fully automated grading. Plenty of customers use more than one. Revenue moved in the right direction. The stat I find most interesting: only about a quarter of support customers used Scorecards, but they accounted for almost half of the seats. The larger companies adopted it, and they were the ones spending more with us.</p>
    <img src="/assets/img/scorecards/scorecards-results.webp" alt="Scorecards results summary with revenue growth and adoption metrics." width="1920" height="1080" loading="lazy">
    <p class="work-gallery__followup">It also nudged more people to turn AI on in Dialpad. We don’t flip that switch by default. When they do, we can do more for them, and yes, we make more money too.</p>
  </figure>

  <figure class="work-gallery__item">
    <figcaption class="work-gallery__caption">Ideas still on the board</figcaption>
    <p class="work-gallery__description">Two directions I’ve been poking at. Mining: look across months of transcripts and notice topics that show up a lot but aren’t covered by any scorecard question, then offer to create one. And drafting a whole scorecard in natural language, then either keep chatting with a copilot or switch to point-and-click when you want to get specific.</p>
    {% prototypeEmbed "scorecards-future", "Dialpad Scorecards future concepts for mining and natural language drafting.", 1440, 900 %}
  </figure>

  <figure class="work-gallery__item work-gallery__item--plain">
    <figcaption class="work-gallery__caption">Lessons I keep repeating</figcaption>
    <p class="work-gallery__description">Best design ideas don’t always come from designers. PMs, engineers, QA, and product marketing were in the work early and often, not only for one sketching session.</p>
    <p class="work-gallery__followup">Trust is a feature. Show the evidence. Provide overrides. Warn when language is fuzzy. Give guardrails and precision controls in the core experience, not as a bolted-on settings page. And people are harder than software. The model was the easier half of shipping something customers would actually run on live traffic.</p>
  </figure>
</section>
