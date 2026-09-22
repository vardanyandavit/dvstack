# Playbook: review

1. `agent-ops-bar`: judge against blast radius and stated done — reject scope creep in the diff.
2. Load `coding-rules`. Read only the references whose triggers match the diff. Report rule violations. Name a contested trade-off the diff decided without saying so.
3. `anti-rationalization`: watch for skipped verify, “looks right”, invented APIs.
4. `agent-trust-stack`: are agents about to copy a bad pattern? Is a review note better as lint/CI?
5. Domain: `using-dvstack` → testing/frontend/harness review skills when the diff is in that domain (e.g. Playwright code-review skill).
6. `source-check` when framework APIs look guessed.
7. Output: concrete findings + what to promote up the trust stack. Do not rewrite the PR unless asked.
