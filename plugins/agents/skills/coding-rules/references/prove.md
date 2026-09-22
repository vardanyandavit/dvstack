# Prove it

Apply this when you add or change a test, touch a flake, or cite coverage. Finding and running the project's check is `verify-loop`.

- Test observable contracts: outputs, state transitions, errors, user-visible behavior. An internal test earns its place when it verifies meaningful logic.
- For any test, ask what change would make it fail. If the only answer is renaming a private method, delete it.
- See every new test fail once, by breaking the code or asserting the wrong literal, before you trust it. A test that has never failed has proven nothing.
- Fake only what you must: the clock, the network, the filesystem, the browser, the third party. Prefer a real database in a container to a mock of the database. A test that mocks everything beneath the function under test is asserting the implementation back to itself.
- Control time, randomness, and ordering. A test that reads the wall clock, iterates an unordered set, or depends on which of two async tasks finishes first is a flaky test that has not happened yet.
- Protect trust in the suite. Quarantine a flaky test the day it appears, with an owner and a deadline, or delete it. Do not add a retry to hide it. If the runner retries anyway, a pass on the second attempt is a bug report, not a green build.
- Reproduce before you fix. Write the failing test first.
- Fix the class, not the instance. After the fix, ask where else that pattern lives. If a lint rule or a type can catch the class, add it.
- Coverage measures what ran, not what was checked. Use it to find untested code. It does not prove code is tested. When you want a number that means something, mutation-test the code that matters.
