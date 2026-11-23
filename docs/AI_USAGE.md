# AI usage

**Tool:** Claude Code (Claude Opus 5.5) in VS Code.

## Exact prompts

1. The instruction below, followed by the full text of the assignment email:

   > complete this assignent

2. Two automatic "resume from where you stopped" messages after the response was cut off. No other instructions were given while the code was being written.

## What the AI did

1. Inspected the reference: routes, sitemap, page markup, stylesheet, public scripts and screenshots at two widths.
2. Extracted the puppy and photo data into JSON and optimised the media.
3. Split the reference stylesheet into feature files and set up the Tailwind theme.
4. Wrote the components, interactions, forms and Teddy engine.
5. Compared screenshots with the reference, then fixed what differed. Examples: Teddy missing on phones, Teddy about 12% too small, the house door not opening, and a favicon 404.
6. Wrote and ran the unit and browser tests, and wrote this documentation.
