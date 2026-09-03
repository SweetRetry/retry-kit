# How our agents build on-brand pages with design.md

**Author:** [John Phamous](https://twitter.com/johnphamous), Design Engineer  
**Contributor:** [Kevin Corbett](https://twitter.com/Kev_InDev)  
**Published:** 31 Aug 2026 · 12 min read  
**Source:** [vercel.com/blog/how-our-agents-build-on-brand-pages-with-design-md](https://vercel.com/blog/how-our-agents-build-on-brand-pages-with-design-md)

---

Across Vercel, we use coding agents to design and build pages that have to look and feel like Vercel. The typography, color, and composition all need to carry the same judgment that we put into the pages we already ship ourselves.

[We recently wrote about](https://vercel.com/blog/teaching-agents-product-design-at-vercel) `product-design`, our skill that teaches agents how we design when they work in our codebases. The skill lives in each repository alongside the code that it governs, explaining how agents can find and understand our design system, from the Geist type scale to how we handle responsive breakpoints, so that their code matches the patterns we already follow.

This works great when agents are working in our codebases, where everything the skill needs is right there. But what about reports, proposals, and the one-off pages that still have to look like Vercel, even though they are generated outside any repository? That is why we built [design.md](https://vercel.com/design.md), one public file any agent can load.

## How we approached building design.md

What made `product-design` work well was that the design system and product guidelines were sitting right there in the repository for agents to read. We needed a way for agents and tools outside that environment to reach the same level of quality, which meant building something that could stand on its own. The requirements came down to two things:

- A single public URL that anyone can point their agents at, regardless of the environment they run in.
- Guidance covering everything that made `product-design` useful in the first place, from brand, layout, and copywriting to the design system, responsiveness, and information architecture.

The naive approach we tried first was to simply port `product-design` into a public prompt, collapsing the skill's reference files into one file any agent could read from a URL. The problem we found was that while the prompt described our visual language just fine, every model reading it interpreted that description differently, generating vastly different pages from the same guidance.

Part of this comes from the fact that design language is subjective. Phrases like "keep the layout clean" can really mean anything. What is "clean"? Beyond that, the bigger problem was everything else that the repository environment used to provide. Inside one of our projects, `product-design` is surrounded by real components and shipped examples of the things it describes. But a public prompt includes none of that, leaving every model to rebuild our style from just words alone.

So what we needed to do was distill what that environment provided into a single file, and the only way to know whether we were getting closer was to look at the pages coming out. We set the port aside and started building eval scenarios.

We wrote seven of them, pulled from real use cases and paired with mock inputs:

- Usage and performance report
- Renewal proposal
- Benchmark report
- Interactive planning page
- Build-versus-buy brief
- Security governance brief
- Presentation deck

The prompts stayed fixed while the file changed, so any difference in the output traced back to the guidance.

## The first comparison

These evals gave us a way to measure both what the file was actually doing and how it was being interpreted by different agents. For our first test, we wanted to know whether `design.md` would actually change what a model produced at all. We ran the renewal proposal eval twice in the same environment with the same model, once without `design.md` and once with it loaded, keeping the prompt, data, and viewport identical in both runs.

> *Same prompt, data, model, and viewport. Each version generated once, no rerolls.*

Without `design.md`, the model generated a generic SaaS dashboard. But with it, the page led with the renewal recommendation itself, pulled the commercial evidence into one grid, put peer values on a single scale so the reader could compare at a glance.

## The three parts that make the system work

As we tested and rebuilt `design.md`, the scope evolved into a three-part system that made the entire thing work:

- [**design.md**](https://vercel.com/design.md) supplies guidance that shows agents how to frame the reader's job, structure evidence, and choose a composition.
- A public [**stylesheet**](https://vercel.com/geist/vercel-brand.css) that defines a bounded, documented vocabulary of classes and tokens.
- An **evaluation loop** turns repeated human feedback into better guidance and deterministic checks.

Each of these layers covers a different slice of the work that creates a high-quality, on-brand Vercel page. The judgment that gets encoded in `design.md` gives agents guidance on:

- Shaping a page for both a quick executive read and a detailed audit.
- Writing copy with concrete claims and honest caveats.
- Composing hierarchy, typography, and color so that evidence and prose support each other.
- How to publish as Vercel, down to the asset rules for our wordmark and the triangle logo.

`design.md` also names the recurring generated-design patterns that we never want to see, allowing agents to recognize and avoid them far more reliably by giving the patterns names.

> *An excerpt from design.md. Naming recurring generated-design patterns explicitly helps agents recognize and avoid them.*

We created a stylesheet because agents kept inventing their own typography, spacing, and layout, so we took those decisions away from the model entirely. The stylesheet packages our design system's primitives into a bounded vocabulary, and `design.md` documents the class names and tokens that the stylesheet provides, allowing the agent to build the page with those names in the HTML instead of reinventing them.

Another benefit to this is that the agent never actually reads the stylesheet itself. The stylesheet loads when the page renders in your browser, so none of the code enters the model's context, saving that context for design guidance.

Last, the evaluation loop is what helps make the other two pieces work. Deterministic checks are used to help catch mechanical failures, such as a table that ignores the width available to it, while providing consistent feedback to editors on each run.

## How guidance made it into the file

Every line of guidance in `design.md` earned its place through the eval loop. We generated pages from fixed scenarios, reviewed what came back, encoded the corrections we accepted, and reran the scenarios to see whether each change stuck, improved the output, or caused something else to regress.

### Scenarios and rounds

Each of the seven prompts becomes a scenario, meaning the prompt is frozen together with its mock inputs and render settings. The renewal proposal, for example, always runs with the same fake customer data, the same viewport width, and the same model version, with `design.md` as the only thing that changes between runs. A round means generating a fresh page from every scenario against the current version of the file. Full rounds cover all seven scenarios on both Claude Opus and Sonnet.

If we want to investigate something specific, such as a rule change that only affects tables, we can rerun the affected scenarios or a single model, keeping iteration loops tight.

Generating all seven pages together also made them easy to compare side by side, and what stood out was that `design.md` wasn't pushing every page toward one template. The interactive planning page put its controls front and center, because someone opens a planning page to change the numbers and see what happens. The renewal proposal led with a recommendation and evidence because that is what a reader is looking for.

> *Outputs from different scenarios sharing a visual language while using different page structures.*

### Reviewing every run

To review the pages each round produced, we built a local app that displays full-page renders and runs blind A/B comparisons. This app eventually became our eval harness, running each scenario and storing the version of `design.md` it used, the screenshots, and whatever feedback the reviewer left about it. Reviewers record every correction against the exact run that produced it.

> *Our local review harness, showing full-page renders and blind A/B comparisons of each run.*

### Turning corrections into rules and checks

Each correction a reviewer records gets landed in the narrowest place that can consistently enforce it. Judgment changes go into `design.md` as prose, reusable mechanics go into the stylesheet, and anything that we can check mechanically becomes a deterministic check in code. Problems with the harness itself stay in the harness, and when a complaint is too vague to encode, we ask for a clearer rewrite.

Take one of the early renewal proposals. Its commercial terms table came back squeezed to the same width as the prose, even though the page had room for the table to be twice as wide.

> *Before and after design.md incorporated feedback*

During review, we flagged that evidence tables should use the full width available to them. But when looking through previous outputs, we found this same failure everywhere. So this correction ended up in two places:

- A rule in `design.md` stating the intended behavior.
- A deterministic check in code that catches the same layout failure the next time it appears.

Once this landed, later renewal proposal prompts resulted in pages with correct full-width tables. To verify changes like this one, we reran the affected scenarios after encoding them. At milestones we also ran full rounds comparing the current `design.md` against an earlier version of the file to decide whether to keep, revise, or revert each change.

## Measuring whether it worked

Building the file had taken well over 200 runs, counting full rounds, targeted checks, dry runs, and all of the dead ends. Alongside the human reviewers, a model judge wrote critiques for each round, giving us a second perspective we could compare to the human notes.

> *Shows every 3rd generation for brevity, each round got feedback to improve for the next*

After all of those runs, we wanted to know whether the corrections we had encoded were actually preventing the failures they were written for. So we picked three desktop scenarios, and for each one we generated one page with `design.md` loaded and once without. We kept the first attempt from every generation, with no re-rolls. Then we ran our deterministic checks over all six pages and counted how many times a known failure, like a table ignoring available width, appeared. The pages generated with `design.md` had 39 of those failures. The pages generated without it had 91, which works out to 57% fewer in this test.

Those numbers come with two caveats. The checks can only catch failures we have already seen and written down, so this test says nothing about whether a page is well designed overall. Six pages is also a small sample, so this measures whether specific corrections held, not overall reliability.

## How design.md stays current

The eval loop got the file shipped, but what keeps it current is real usage. Inside our Slack, that usage comes through `@design-agent`, an agent built on [eve](https://eve.dev/) that we use for anything from design critiques and copy alternatives to icon recommendations and report sites built from pasted data. Instead of setting up a prompt or hunting down source files, you just describe what you need and drop in the relevant data. The agent loads `design.md`, builds the page against the published stylesheet, and posts a full-page screenshot and deployment URL back to the thread. Unlike our fixed scenarios, each of these threads captures a real request, a real conversation, and whatever corrections the person had to make.

Every week, we gather all of that feedback in one place, the Slack threads along with comments from GitHub reviews and Figma. Automation groups the comments that keep repeating, and each repeated complaint becomes a proposed update to `@design-agent`, the `product-design` skill, `design.md`, the stylesheet, or a deterministic check. And if people start asking for a kind of page we have never tested, that request becomes a new eval scenario.

To know whether any of this is working, we count how often each kind of complaint shows up in similar work over time. Once we encode a fix, that count should start falling. When it does not, something about the correction is not working, so we revisit it.

## Build your own

You can build the same loop yourself, starting with one recurring artifact and one manual comparison.

**1. Pick one repeated artifact**

Use a recent task with a real reader and real inputs, like a proposal, performance report, benchmark, or microsite. Avoid broad goals such as "make it on-brand." Before generating anything, write down what a good result would look like.

**2. Save the baseline first**

Generate the page once without any new design context, and save the prompt, inputs, configuration, and a screenshot. Keep that first output even if it looks rough, unless the harness itself failed. You need one honest before-picture to measure against.

**3. Start from your last ten corrections**

Collect the feedback you keep giving in design reviews, pull requests, or Slack, and rewrite each correction as something observable. That means writing "Let evidence tables use the full available width" instead of "Make the table feel less cramped", since only one of those can be checked.

Put the decisions in one file with sections for scope, reader and task, observable decisions, and available primitives. That file is your first `design.md`.

**4. Constrain repeatable mechanics**

If your outputs keep inventing their own typography, spacing, or layout, publish a stylesheet and document the exact classes and tokens the agent may use. Keep your judgment in prose, and push the repeatable mechanics into code.

**5. Run one matched comparison**

Generate the page one more time with the same input, model, and viewport, but now with your file loaded. Shuffle it with the baseline and score both against your rubric without knowing which is which.

You do not need a runner or a model judge to start, a single trial can reveal the large, obvious failures. To measure reliability, run multiple independent first-attempt trials ([Anthropic's guide to evals for agents](https://www.anthropic.com/engineering/demystifying-evals-for-ai-agents)) and report how often the result holds.

**6. Encode the correction**

Review the output alongside whatever follow-up prompts you have to send, and then ask:

- What did the user have to repeat or steer manually?
- Is a rule missing or unclear?
- Can the stylesheet express the correction?
- Is the failure mechanical enough to check in code?
- Does the correction generalize beyond this output?

Update the guidance instead of hand-tuning the generated page. Your next comparison tells you whether first attempts actually improved.

Add tooling after the manual loop starts paying off:

- Include scenarios where the guidance should and should not apply.
- Keep a small holdout hidden while editing.
- Record model and guidance versions.
- Automate mechanical checks.
- Use multiple blind reviewers.

However far you take the automation, keep final changes human-reviewed.

Then keep the loop running. Collect feedback on a cadence, and watch whether each kind of complaint actually becomes less common after you change the guidance. A passing evaluation matters less if people are still correcting the same things in production.

And if you want working examples, ours are public. We load [design.md](https://vercel.com/design.md) into tools like [v0](https://v0.app/), Codex, and Claude every day to make artifacts that feel like Vercel, and the [eve design agent template](https://github.com/vercel-labs/eve-design-template) will get you a Slack design agent like the one we run.
