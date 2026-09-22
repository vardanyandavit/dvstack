# Outcome

Apply this when the change uses a flag, breaks compatibility, needs a rollback, or follows an incident. Small diffs and reading your own diff are already in `coding-rules`.

- Main stays deployable. Separate deploy from release with a flag when a change is risky. After it ships, watch the metrics it should have moved and the ones it should not have.
- Make the change easy, then make the easy change. When a feature is awkward to add, reshape the code in its own behavior-preserving commit first, then add the feature.
- Leave touched code slightly cleaner. Do not hide a large unrelated refactor inside a feature change.
- In an incident, restore service first: roll back, flip the flag, fail over. Understand second. Afterwards, a blameless postmortem with action items that have owners.
- Review generated code more adversarially than human code: plausible-looking wrongness, APIs that do not exist, handlers that swallow errors, tests that assert the implementation back to you.
