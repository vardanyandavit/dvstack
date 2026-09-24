<!-- section:always -->
## DVstack

- Package manager comes from the lockfile. Do not guess.
- Verify: (fill from CI, else package scripts)
- Full check: (fill from CI)
- A diff read is not proof. Paste the command and its real result. Say what was not run.
- Do not weaken, skip, or delete a test to get green. Do not raise a timeout or add a retry instead of fixing the cause.
- Lint passing is not proof the behavior works.
- Do not invent an API, a flag, or a file. Copy the nearest sibling.
- Money, auth, user data, or anything irreversible gets a harder check.
<!-- section:web -->
- A control a test or an agent must find needs an accessible name. Change the markup instead of selecting it by a CSS class.
<!-- section:e2e -->
- Do not add a second test style beside the suite already in the repo.
- No hard-coded wait. Every step ends in an assertion.
