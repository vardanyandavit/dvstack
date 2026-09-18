# I read a paper on QA for AI agents — here are my notes

I spend most of my time as an SDET: not “does the model sound smart,” but **does the system stay inside the boundaries we meant?** That lens is exactly what this paper is about.

Paper: [A Large-Scale Empirical Study of Quality Assurance Practices and Gaps in AI Agents](https://arxiv.org/abs/2609.17698) (arXiv:2609.17698, Sep 2026). [HTML](https://arxiv.org/html/2609.17698v1)

The authors looked at **157** popular open-source LLM agent projects (≥100 GitHub stars) and asked a practical question: what QA do these repos actually show — in code, config, docs, and tests — when agents can plan, call tools, touch files, run shell, browse, use MCP/plugins, and keep state?

Below are my notes. Analysis and takeaways for builders/QA — not a review score.

---

## The shift that matters

Classic LLM apps mostly fail by giving a wrong answer.

Agents fail by **doing the wrong thing in the world**: shell, file writes, APIs, browser sessions, installing packages, talking to other agents. So QA has to ask:

> Are model-influenced actions still authorized, scoped, monitored, and tested across every path that can reach them?

That matches how I already think about harnesses: the quality bar is **bounded action**, not a green unit-test count.

---

## Their four-layer map (useful checklist)

| Layer | Question |
|---|---|
| **Execution surfaces** | Where can the agent act? (CLI, API, UI, browser, FS, shell, MCP/plugin, subagent) |
| **Safeguards** | What constrains those actions? (approval, sandbox, policy, redaction, domain scope) |
| **Testing artifacts** | What proves the bounds hold? |
| **Risk scenarios** | Which end-to-end chains turn “normal” steps into privileged damage? |

Important caveat from the paper (and I agree): repo evidence shows **something exists**. It does **not** prove the control works in production.

---

## What they found (the numbers I care about)

### Almost every popular agent exposes high-risk paths
Roughly mid-90s%+ of projects show issues like:

- Overlapping action routes with **uneven** controls
- Outbound network/API effects
- Credential leakage via config / env / MCP
- Workspace / file escape
- Host process changes via commands
- MCP/plugin authority expansion (~80%+)
- Browser session / cross-domain exposure (~75%+)

So if you’re shipping an agent with tools, assume you have these surfaces until you prove otherwise.

### Safeguards are common — consistency is not
Lots of projects have approvals, sandboxes, policies, redaction, domain scoping. The failure mode is:

**Same power, different door.**
Interactive CLI might ask for approval; API / headless / MCP / hook path to the same shell or file write might not.

If I had to put one sticky note on my monitor from this paper, it’s that.

### Testing is the weakest layer
Approximate picture from the study:

- Conventional tests/specs: common (~87%)
- Security/safety-oriented tests: maybe ~60%
- Eval / red-team-like paths: ~half
- Real prompt-injection / adversarial / jailbreak tests: only about **5%** of projects

So most “agent QA” is still **feature and component** testing. Boundary, adversarial, and multi-step tool-use failures are rarely first-class.

### Risk is a chain, not a single bug
Useful chain templates to steal for test design:

1. **Secret → tool** (key/token ends up in tool args, logs, subprocess env)
2. **Workspace → persistent state** (task write becomes lasting settings/secrets)
3. **Extension → authority** (MCP/plugin adds tools that inherit local power)
4. **Mode switch → privilege** (gated in chat, open in auto/API/batch)
5. **Runtime code** (loaded plugin/snippet after review of the “main” app)
6. **Model → process** (model picks a host-mutating command)
7. **Session → action** (browser cookies/storage influence a later step)
8. **Untrusted context → action** (page/file/MCP output steers a later privileged call)

---

## My takeaways as an SDET

1. **Inventory surfaces before you invent more prompts.** List every route that can reach shell, FS, network, secrets, browser, MCP.
2. **Define policy by protected action/asset, not by UI.** “Shell needs approval + sandbox” must mean CLI **and** API **and** MCP **and** hooks.
3. **A safeguard in config ≠ a safeguard under test.** Prefer failure-oriented checks: remove approval/sandbox/redaction and the test must go red.
4. **Add the missing ~5%.** At least a few adversarial / untrusted-context cases for anything that reads the web, files, email, or MCP tool output.
5. **Turn risk chains into QA tickets.** Trigger → asset → required control → regression. Don’t leave them as wiki fears.

This is why I’m pushing agent work into a **harness** mindset (contracts, tool gates, verify-to-reject, receipts) instead of “the model will be careful.”

---

## What I’m doing with this in DVstack

I’m folding these ideas into the **`dvstack-harness`** plugin as concrete skills (surface map, safeguard parity, boundary tests, risk-chain checks) so an agent (or a human) can apply them without re-reading the paper every time.

If you build agents: read the paper, then go verify **one** high-authority route end-to-end today. That’s more valuable than another happy-path demo.

---

**Source:** Dai, Openja, Shin, Pham, Wang — *A Large-Scale Empirical Study of Quality Assurance Practices and Gaps in AI Agents*, arXiv:2609.17698, 2026.
https://arxiv.org/abs/2609.17698
