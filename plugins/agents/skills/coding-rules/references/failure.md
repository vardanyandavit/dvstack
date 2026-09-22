# Failure

Apply this only when the change adds retries, idempotency, logs, metrics, traces, or alerts. Catch blocks, programmer errors, and outbound timeouts are already in `coding-rules`.

- Distinguish expected domain errors from unexpected system failures. They get different handling and different alerting.
- Design for networks timing out, processes restarting, and messages arriving twice: idempotency, bounded retries, and transactional boundaries that mean something.
- Retries need exponential backoff, jitter, and a budget. A retry storm is how a blip becomes an outage. Idempotency keys are what make retrying a write safe.
- Make behavior observable with structured logs, metrics, traces, and actionable error messages that carry useful identifiers. Never log passwords, tokens, or sensitive personal data.
- An alert nobody acts on trains the team to ignore alerts. Every alert has an owner and a response, or it is deleted. Do not add an alert you cannot name a response for.
