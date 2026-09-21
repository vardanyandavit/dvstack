# Evals

Each plugin carries an eval suite under `plugins/<name>/evals/`. A case is one `case.yaml`:
a realistic prompt plus graders that say what a good answer contains.

```bash
cd plugins/frontend && claude plugin eval . --judge-model sonnet --runs 4
```

`claude plugin eval` runs each case twice — once with the plugin loaded, once without — and
reports the delta. **The delta is the whole point.** A high score with no delta means the model
already knew; only the delta says the plugin earned its place in the context window.

## Always pass `--judge-model sonnet`

The default judge is `haiku`, and it under-reports on long answers. Measured on
`harness/agent-shell-safeguards`, changing only the judge:

| judge | with | without | Δ |
|---|---|---|---|
| haiku (default) | 0.44 | 0.39 | +0.045 |
| sonnet | **1.00** | 0.30 | **+0.697** |

Same plugin, same prompt, same graders. Under haiku, two runs scored 0.00 on answers that
carried a labelled remove-and-fail bullet under every control. The CLI warns about this
("llm judges are noisy on long inputs"); the harness answers are the longest in the suite.
A default-judge run here would have read as "this plugin does nothing".

## Command names must not collide with skill names

`scripts/check-marketplace.mjs` fails the build on two things, both of which shipped once:

1. **A command named the same as a skill.** The command shadows the skill, so
   `Skill(dvstack-frontend:testable-ui)` returns the *command* body instead of `SKILL.md`.
2. **A command pointing at `skills/<name>/SKILL.md`.** That path resolves against the user's
   project, not the plugin root, so it never loads. The agent globs for it, finds nothing, and
   answers from general knowledge instead.

Together these cost up to 0.68 of score and roughly doubled turn count. A forcing command should
name the skill for the Skill tool and nothing else:

```md
Load the skill **`dvstack-testing:playwright-locators`** with the Skill tool now, and follow it
for this task. The skill arrives with its own base directory, so do not go looking for
`SKILL.md` on disk.

If the skill does not load, say so plainly and stop — do not answer from general knowledge instead.
```

That last line matters: the failure mode was silently substituting generic advice, which is worse
than failing loudly.

## Writing a case that can measure anything

A case only has headroom if the base model gets it wrong. `testing/locator-strict-mode` scores
0.94–1.00 in *both* arms — a textbook strict-mode fix is something the model already does, so
that case is pinned at Δ 0 and measures nothing about the plugin.

Target the opinionated calls a competent model does *not* make unprompted: `toBeHidden` over
`not.toBeVisible`, one locator definition per element at the right tier, the review-order rules.

Mix grader types. `tool_used: Skill` with `arm: with-only` is a plugin-fired indicator and is
excluded from the score, so it tells you triggering worked without inflating the delta. Use
`regex` for hard markers and `llm` only for judgement calls.
