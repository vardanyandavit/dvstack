# Evals

A measured skill carries an eval suite under `plugins/<name>/evals/`. A case is one `case.yaml`:
a realistic prompt plus graders that say what a good answer contains. The font switcher has no
case: its proof is the source files it copies.

```bash
cd plugins/testing && claude plugin eval . --judge-model sonnet --runs 4
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

## What the deltas decided

Latest runs before the token diet (sonnet judge, 3 runs per case):

| Plugin | Case | with | without | Δ |
|---|---|---|---|---|
| frontend | testable-component | 0.86 | 0.43 | +0.43 |
| harness | agent-shell-safeguards | 0.93 | 0.48 | +0.45 |
| testing | locator-strict-mode, step-validation-wait | 1.00 | 1.00 | 0 |
| agents | verify-before-ship | 0.70 | 0.73 | −0.03 |

At that point frontend and harness kept every skill. The agents plugin — generic habits a current model already
follows — was cut from twelve skills to two. The testing plugin was cut from twenty to four: the
Playwright API tutorials went, and their house rules were folded into `playwright-code-review`.

The one-command-per-skill aliases were replaced by scenario commands (new, add, rewrite, review,
fix). A command sharing a skill's name shadowed the skill (up to −0.68), and plugin skills are
already slash-invocable, so an alias only duplicated its skill. Scenario commands carry
`disable-model-invocation: true`, so they cost no context until run.

Those scenario commands were then collapsed to one call per plugin. The user was choosing a
command the agent can choose. `dvstack-harness` (designing a tool-using agent) and `testable-ui`
left with that cut: they are not one of the three jobs. The agents habits that measured no delta
moved into `agent-rules`, which adds a short block to the instruction file `/init` already wrote.
The rows above are the measurements that justified the earlier cuts; the cases for removed skills
are gone from the tree.

## Writing a case that can measure anything

A case only has headroom if the base model gets it wrong. `testing/locator-strict-mode` scores
0.94–1.00 in *both* arms — a textbook strict-mode fix is something the model already does, so
that case is pinned at Δ 0 and measures nothing about the plugin.

Target the opinionated calls a competent model does *not* make unprompted: `toBeHidden` over
`not.toBeVisible`, one locator definition per element at the right tier, the review-order rules.

Mix grader types. `tool_used: Skill` with `arm: with-only` is a plugin-fired indicator and is
excluded from the score, so it tells you triggering worked without inflating the delta. Use
`regex` for hard markers and `llm` only for judgement calls.
